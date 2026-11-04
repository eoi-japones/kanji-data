const yaml = require("js-yaml")
const fs = require("fs")
const path = require("path")
const ajv = require("ajv")

const utiles = require("./utiles.js")

const {validarGrupos} = require("./validar-grupos.js")

const {validarItinerarios} = require("./validar-itinerarios.js")

const {validarLexicones, validarMascarasYomi} = require("./validar-lexicones.js")

const {validarPalabrasKana} = require("./validar-palabras-kana.js")

const {validarKanas} = require("./validar-kanas.js")

const kanaSchema = require("../schemas/kana.schema.json")
const kanjiSchema = require("../schemas/kanji.schema.json")
const grupoSchema = require("../schemas/grupo.schema.json")
const itinerarioSchema = require("../schemas/itinerario.schema.json")
const colaboradorSchema = require("../schemas/colaborador.schema.json")

const grupoOnSchema = require("../schemas/grupo-on.schema.json")

const kanjiHintSchema = require("../schemas/kanji-hint.schema.json")

const KanjiAlterSchema = require("../schemas/kanji-alter.schema.json")

const lexiconSchema = require("../schemas/lexicon.schema.json")

const lexiconExcepcionesSchema = require("../schemas/lexicon-excepciones.schema.json")

const palabraKanaSchema = require("../schemas/palabra-kana.schema.json")

const guionSchema = require("../schemas/guion.schema.json")

const PALABRA_KANA_DIR = process.env["PALABRA_KANA_DIR"] || "vocabulario/palabras-kana"

const GUION_DIR = process.env["GUION_DIR"] || "guiones"

const Ajv = new ajv()
const kanaValidation = Ajv.compile(kanaSchema)
const kanjiValidation = Ajv.compile(kanjiSchema)
const grupoValidation = Ajv.compile(grupoSchema)
const itinerarioValidation = Ajv.compile(itinerarioSchema)
const colaboradorValidation = Ajv.compile(colaboradorSchema)
const grupoOnValidation = Ajv.compile(grupoOnSchema)
const kanjiHintValidation = Ajv.compile(kanjiHintSchema)
const kanjiAlterValidation = Ajv.compile(KanjiAlterSchema)
const lexiconValidation = Ajv.compile(lexiconSchema)
const lexiconExcepcionesValidation = Ajv.compile(lexiconExcepcionesSchema)
const palabraKanaValidation = Ajv.compile(palabraKanaSchema)
const guionValidation = Ajv.compile(guionSchema)

const processors = {
    procesarEntrada,
}

const kanjisPorId = {}
const clavesUnicas = {}
const grupos = {}
const gruposYomi = {}
const itinerarios = {}
const lexicones = {}

const guiones = {}

const palabrasKana = []

const kanas = []

utiles.walk(dir = process.env["DATA_DIR"], processors).then(() => {

    return utiles.walk(process.env["META_DIR"], processors)

}).then(() => {

    return utiles.walk(process.env["YOMI_DIR"], processors)

}).then(() => {
    
    return utiles.walk(process.env["KANA_DIR"], processors)

}).then(() => {

    return utiles.walk(PALABRA_KANA_DIR, processors)

}).then(() => {

    return utiles.walk(process.env["KANJI_HINT_DIR"], processors)

}).then(() => {

    return utiles.walk(process.env["PROFILES_DIR"], processors)

}).then(() => {

    // Solo se recorre si la ruta está declarada: si no, walk() caería por
    // defecto en META_DIR y procesaría los meta-datos dos veces.
    return process.env["LEXICON_DIR"] ? utiles.walk(process.env["LEXICON_DIR"], processors) : Promise.resolve()

}).then(() => {

    return process.env["EXCEPCIONES_DIR"] ? utiles.walk(process.env["EXCEPCIONES_DIR"], processors) : Promise.resolve()

}).then(() => {

    return process.env["GUION_DIR"] ? utiles.walk(process.env["GUION_DIR"], processors) : Promise.resolve()

}).then(() => {

    return validarGrupos(
        grupos,
        kanjisPorId
    )
}).then(() => {

    return validarItinerarios(
        itinerarios,
        grupos
    )
}).then(() => {

    const errores = validarMascarasYomi(gruposYomi) + validarLexicones(lexicones, kanjisPorId) + validarPalabrasKana(palabrasKana) + validarKanas(kanas)

    if(errores != ""){
        throw `\n${errores}`
    }
})

function determinarTipo(entrada){

    const dir = path.basename(path.dirname(entrada))

    return (dir == "data" || dir == "componentes") ? "KANJI" :
        (dir == "kana" || dir == "hiragana" || dir == "katakana") ? "KANA" :
        (dir == "palabras-kana") ? "PALABRA-KANA" :
        (dir == "grupos") ? "GRUPO" :
        (dir == "on") ? "GRUPO-ON" :
        (dir == "itinerarios") ? "ITER" : 
        (dir == "itinerarios-yomi") ? "ITER-YOMI" : 
        (dir == "colaboradores") ? "COLABORADOR" : 
        (dir == "hints-kanji") ? "KANJI-HINT" : 
        (dir == "lexicon") ? "LEXICON" : 
        (dir == "excepciones") ? "EXCEPCION" : 
        (dir == "guiones") ? "GUION" :
        (dir.match(/^profile\-/)) ? "KANJI-ALTER" :
         "DESCONOCIDO"

}

function procesarEntrada(entrada){

    return procesarFichero(entrada.ruta)
}

function procesarFichero(entrada){

  if(entrada.match(/\.yaml$|\.yml$/)){

    return new Promise((ok, ko) => {

      fs.readFile(entrada, 'utf-8', (err, data) => {
      
        if(err){

          return `Leyendo ${entrada}: ${err}`
        }

        try{
         
          data = yaml.load(data)

          tipo = determinarTipo(entrada)

          console.log(`Validando fichero de ${tipo} ${entrada}`)

          validarFichero(data, tipo, entrada)
        
          ok(entrada)

        }
        catch(err){

          ko(`en "${entrada}": ${err}`)

        }

      })

    })

  }
  else{
    return Promise.resolve(entrada)
  }

}

function validarFichero(kanjiData, tipo, ruta){

  const validador = (tipo === "KANJI") ? kanjiValidation : 

                      (tipo == "GRUPO") ? grupoValidation : 

                      (tipo == "GRUPO-ON") ? grupoOnValidation :

                      (tipo == "KANA") ? kanaValidation : 

                      (tipo == "PALABRA-KANA") ? palabraKanaValidation :
                  
                      (tipo == "ITER") ? itinerarioValidation : 
                      
                      (tipo == "ITER-YOMI") ? itinerarioValidation: 

                      (tipo == "KANJI-HINT") ? kanjiHintValidation :

                      (tipo == "KANJI-ALTER") ? kanjiAlterValidation :

                      (tipo == "LEXICON") ? lexiconValidation :

                      (tipo == "EXCEPCION") ? lexiconExcepcionesValidation :

                      (tipo == "GUION") ? guionValidation :

                      colaboradorValidation;

  if(!validador(kanjiData)){
     
    //console.log(JSON.stringify(validador.errors, null, 4))
    throw JSON.stringify(validador.errors, null, 4)
  }

  if(tipo == "PALABRA-KANA"){

      palabrasKana.push({ ruta, datos: kanjiData })

      return
  }
  else if(tipo == "KANA"){

      kanas.push({ ruta, datos: kanjiData })

      return
  }
  else if(tipo == "GRUPO"){

      grupos[kanjiData.id] = kanjiData

      return
  }
  else if(tipo == "ITER"){

      itinerarios[kanjiData.id] = kanjiData

      return

  }
  else if(tipo == "GRUPO-ON"){

      gruposYomi[kanjiData.id] = kanjiData

      return
  }
  else if(tipo == "LEXICON"){

      lexicones[kanjiData.id] = { ruta, datos: kanjiData }

      return
  }
  else if(tipo == "EXCEPCION"){

      return
  }
  else if(tipo == "GUION"){

      if(guiones[kanjiData.id]){

          throw `Guion repetido: "${kanjiData.id}"`
      }

      validarIdsGuion(kanjiData)

      guiones[kanjiData.id] = kanjiData

      return
  }
  else if(tipo == "ITER-YOMI" || tipo == "COLABORADOR" || tipo == "KANJI-HINT" || tipo == "KANJI-ALTER"){

      return 
  }

  if(clavesUnicas[kanjiData.clave]){

    console.log(clavesUnicas[kanjiData.clave])
    throw `Clave repetida: "${kanjiData.clave}"`
  }
  else{

    clavesUnicas[kanjiData.clave] = kanjiData

    // Un mismo carácter puede tener dos fichas: la del kanji y la del
    // componente (冊, 𠂢). Solo es «solo componente» si todas sus fichas lo
    // declaran así; basta una ficha de kanji real para que exista en la
    // lengua y pueda tener lexicon. Ver ADR 0010.
    const previo = kanjisPorId[kanjiData.id]

    kanjisPorId[kanjiData.id] = (previo && !previo.solo_componente) ? previo : kanjiData
  }

}

function validarIdsGuion(guion){

    const ids = new Set([guion.id])

    for(const escena of guion.escenas){

        if(ids.has(escena.id)){

            throw `Guion "${guion.id}": id duplicado "${escena.id}"`
        }

        ids.add(escena.id)

        for(const actividad of escena.actividades || []){

            if(ids.has(actividad.id)){

                throw `Guion "${guion.id}": id duplicado "${actividad.id}"`
            }

            ids.add(actividad.id)
        }
    }
}

