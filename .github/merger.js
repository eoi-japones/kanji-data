const yaml = require("js-yaml")
const fs = require("fs")
const path = require("path")

const output_file = process.env["OUTPUT_FILE"] || './kanji.data'

const f = []

walk().then(() => {

    return walk(process.env["META_DIR"])

}).then(() => {

    return escribirEnFichero(f)

}).then(() => {

    console.log(`Escrito en ${output_file}`)

}).catch((err) => {

  throw `Error merge: ${err}`
})

async function escribirEnFichero(datos){

  return new Promise((ok, ko) => {

    fs.appendFile(output_file, JSON.stringify(datos), 'utf-8', (err) => {
      if(err)
        return ko(err)
      else
        return ok()
    })
  })
}

async function acumularParaFichero(datos, tipo){

  const d = yaml.load(datos)

  switch(tipo){

      case "GRUPO":
          d.kind = "kanji.eoi/grupo"
          d.version = "v1"
      break

      case "ITER":
          d.kind = "kanji.eoi/itinerario"
          d.version = "v1"
      break

  }

  f.push(d)

}


async function walk(dir = process.env["DATA_DIR"]){
  
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
          (dir == "itinerarios") ? "ITER" : 
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
          
            acumularParaFichero(data, tipo)

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
