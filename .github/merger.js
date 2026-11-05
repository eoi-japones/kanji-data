const yaml = require("js-yaml")
const fs = require("fs")
const path = require("path")

const output_file = process.env["OUTPUT_FILE"] || './kanji.data'

// Cada paquete se lee de su ruta; sin variable de entorno se usa la del repo.
// Antes, una carpeta sin declarar caía en DATA_DIR y el inventario se procesaba
// varias veces. Las rutas son relativas a la raíz del repositorio (o al WORKDIR
// del contenedor, que monta el repo).
const DATA_DIR = process.env["DATA_DIR"] || "data"
const META_DIR = process.env["META_DIR"] || "meta-data"
const KANA_DIR = process.env["KANA_DIR"] || "kanas"
const PALABRA_KANA_DIR = process.env["PALABRA_KANA_DIR"] || "vocabulario/palabras-kana"
const YOMI_DIR = process.env["YOMI_DIR"] || "yomi"
const KANJI_HINT_DIR = process.env["KANJI_HINT_DIR"] || "lexicon/hints-kanji"
const PROFILES_DIR = process.env["PROFILES_DIR"] || "profiles"
const LEXICON_DIR = process.env["LEXICON_DIR"] || "lexicon/lexicon"
const EXCEPCIONES_DIR = process.env["EXCEPCIONES_DIR"] || "lexicon/excepciones"
const GUION_DIR = process.env["GUION_DIR"] || "guiones"
const BADGE_DIR = process.env["BADGE_DIR"] || "badges"

const f = []

walk(DATA_DIR).then(() => {

    return walk(META_DIR)

}).then(() => {

    return walk(KANA_DIR)

}).then(() => {

    return walk(PALABRA_KANA_DIR)

}).then(() => {

    return walk(YOMI_DIR)

}).then(() => {

    return walk(KANJI_HINT_DIR)

}).then(() => {
    return walk(PROFILES_DIR)

}).then(() => {

    return walk(LEXICON_DIR)

}).then(() => {

    return walk(EXCEPCIONES_DIR)

}).then(() => {

    return walk(GUION_DIR)

}).then(() => {

    return walk(BADGE_DIR)

}).then(() => {

    return escribirEnFichero(f)

}).then(() => {

    console.log(`Escrito en ${output_file}`)

}).catch((err) => {
  console.log(err.stack)
  throw `Error merge: ${err}`
})

async function escribirEnFichero(datos){

  return new Promise((ok, ko) => {

    // El recorrido del sistema de ficheros no garantiza un orden estable entre
    // hosts y contenedores. Se ordena aquí para que el bundle sea reproducible:
    // sin esto, los kanjis con dos claves (mismo id) cambiaban de ganador.
    const ordenados = datos.slice().sort(compararEntradas)

    // Se sobrescribe: el bundle es la foto completa, no un acumulado. Con
    // appendFile, una segunda ejecución dejaba dos arrays concatenados.
    fs.writeFile(output_file, JSON.stringify(ordenados), 'utf-8', (err) => {
      if(err)
        return ko(err)
      else
        return ok()
    })
  })
}

function compararEntradas(a, b){

  const clave = (e) => `${e.kind || ""}\u0000${e.id || ""}\u0000${e.clave || ""}\u0000${JSON.stringify(e)}`

  const ca = clave(a)

  const cb = clave(b)

  return ca < cb ? -1 : ca > cb ? 1 : 0
}

async function acumularParaFichero(datos, tipo, entrada){

  const d = yaml.load(datos)

  switch(tipo){

      case "KANJI":
          d.kind = "kanji.eoi/kanji"
          d.version = "v1"
      break

      case "GRUPO":
          d.kind = "kanji.eoi/grupo"
          d.version = "v1"
      break

      case "GRUPO-ON":
          d.kind = "kanji.eoi/grupo-on"
          d.version = "v1"
      break

      case "ITER":
          d.kind = "kanji.eoi/itinerario"
          d.version = "v1"
      break

      case "ITER-YOMI":
          d.kind = "kanji.eoi/itinerario-yomi"
          d.version = "v1"
      break

      case "KANA":
          d.kind = "kanji.eoi/kana"
          d.version = "v1"
      break

      case "PALABRA-KANA":
          d.kind = "kanji.eoi/palabra-kana"
          d.version = "v1"
      break

      case "COLABORADOR":
          d.kind = "kanji.eoi/colaborador"
          d.version = "v1"
      break

      case "KANJI-HINT":
          d.kind = "kanji.eoi/kanji-hint"
          d.version = "v1"
      break

      case "KANJI-ALTER":
          d.kind = "kanji.eoi/kanji-alter"
          d.version = "v1"
          d.profile = path.basename(path.dirname(entrada)).replace(/^profile\-/, '')
      break

      case "LEXICON":
          d.kind = "kanji.eoi/lexicon"
          d.version = "v1"
      break

      case "EXCEPCION":
          d.kind = "kanji.eoi/lexicon-excepciones"
          d.version = "v1"
      break

      case "GUION":
          d.kind = "kanji.eoi/guion"
          d.version = "v1"
      break

      case "BADGE":
          d.kind = "kanji.eoi/badge-logro"
          d.version = "v1"
      break

  }

  f.push(d)

}


async function walk(dir){

  if(!dir) return

  await Promise.all(

    (await leerDir(dir)).map((entrada) => {

      return procesarEntrada(entrada)

    })

  )


}

  function procesarEntrada(entrada){

    if(entrada.tipo == "d")
      return walk(entrada.ruta)
    else
      return procesarFichero(entrada.ruta)
  }

  function determinarTipo(entrada){

      const dir = path.basename(path.dirname(entrada))

      return (dir == "data" || dir == "componentes") ? "KANJI" :
          (dir == "grupos") ? "GRUPO" :
          (dir == "on") ? "GRUPO-ON" :
          (dir == "kanas" || dir == "hiragana" || dir == "katakana") ? "KANA" :
          (dir == "palabras-kana") ? "PALABRA-KANA" :
          (dir == "itinerarios") ? "ITER" : 
          (dir == "itinerarios-yomi") ? "ITER-YOMI" : 
          (dir == "colaboradores") ? "COLABORADOR" : 
          (dir == "hints-kanji") ? "KANJI-HINT" : 
          (dir == "lexicon") ? "LEXICON" : 
          (dir == "excepciones") ? "EXCEPCION" : 
          (dir == "guiones") ? "GUION" : 
          (dir == "badges") ? "BADGE" :
          (dir.match(/^profile\-/)) ? "KANJI-ALTER" : 
           "DESCONOCIDO"

  }

  function procesarFichero(entrada){

    if(entrada.match(/\.yaml$|\.yml$/)){

      return new Promise((ok, ko) => {

        fs.readFile(entrada, 'utf-8', (err, data) => {
        
          if(err){

            return `Leyendo ${entrada}: ${err}`
          }

          console.log(`procesando fichero de kanji ${entrada}`)

          try{

            tipo = determinarTipo(entrada)
 
            acumularParaFichero(data, tipo, entrada)

            ok()
          }
          catch(err){

            ko(`en "${entrada}": ${err}`)

          }

        })

      })

    }

  }

  function leerDir(dir){

    return new Promise((ok, ko) => {

      fs.readdir(dir, function(err, entradas){

        if(err){
          return ko(`Leyendo ${dir}: ${err}`)
        }

        Promise.all(
          entradas.map((entrada) => {

            return new Promise((ok, ko) => {

              fs.stat(path.join(dir, entrada), (err, stats) => {

                if(err)
                  return ko(`Haciendo fstat sobre: ${path.join(dir, entrada)}: ${err}`)

                ok({

                  ruta: path.join(dir, entrada),

                  tipo: stats.isDirectory() ? "d" : "f"

                })

              })

            })

          })

        ).then((listado) => ok(listado))

        .catch((err) => {

          ko(err)
        })


      })

    })

  }
