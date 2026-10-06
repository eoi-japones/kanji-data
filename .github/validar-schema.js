const yaml = require("js-yaml")
const fs = require("fs")
const path = require("path")
const ajv = require("ajv")

const utiles = require("./utiles.js")

const {validarGrupos} = require("./validar-grupos.js")

const {validarItinerarios} = require("./validar-itinerarios.js")

const {validarLexicones, validarMascarasYomi} = require("./validar-lexicones.js")

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

const processors = {
    procesarEntrada,
}

const kanjisPorId = {}
const clavesUnicas = {}
const grupos = {}
const gruposYomi = {}
const itinerarios = {}
const lexicones = {}

utiles.walk(dir = process.env["DATA_DIR"], processors).then(() => {

    return utiles.walk(process.env["META_DIR"], processors)

}).then(() => {

    return utiles.walk(process.env["YOMI_DIR"], processors)

}).then(() => {
    
    return utiles.walk(process.env["KANA_DIR"], processors)

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

    const errores = validarMascarasYomi(gruposYomi) + validarLexicones(lexicones, kanjisPorId)

    if(errores != ""){
        throw `\n${errores}`
    }
})

function determinarTipo(entrada){

    const dir = path.basename(path.dirname(entrada))

    return (dir == "data" || dir == "componentes") ? "KANJI" :
        (dir == "kana" || dir == "hiragana" || dir == "katakana") ? "KANA" :
        (dir == "grupos") ? "GRUPO" :
        (dir == "on") ? "GRUPO-ON" :
        (dir == "itinerarios") ? "ITER" : 
        (dir == "itinerarios-yomi") ? "ITER-YOMI" : 
        (dir == "colaboradores") ? "COLABORADOR" : 
        (dir == "hints-kanji") ? "KANJI-HINT" : 
        (dir == "lexicon") ? "LEXICON" : 
        (dir == "excepciones") ? "EXCEPCION" : 
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
                  
                      (tipo == "ITER") ? itinerarioValidation : 
                      
                      (tipo == "ITER-YOMI") ? itinerarioValidation: 

                      (tipo == "KANJI-HINT") ? kanjiHintValidation :

                      (tipo == "KANJI-ALTER") ? kanjiAlterValidation :

                      (tipo == "LEXICON") ? lexiconValidation :

                      (tipo == "EXCEPCION") ? lexiconExcepcionesValidation :

                      colaboradorValidation;

  if(!validador(kanjiData)){
     
    //console.log(JSON.stringify(validador.errors, null, 4))
    throw JSON.stringify(validador.errors, null, 4)
  }

  if(tipo == "GRUPO"){

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
  else if(tipo == "ITER-YOMI" || tipo == "COLABORADOR" || tipo == "KANA" || tipo == "KANJI-HINT" || tipo == "KANJI-ALTER"){

      return 
  }

  if(clavesUnicas[kanjiData.clave]){

    console.log(clavesUnicas[kanjiData.clave])
    throw `Clave repetida: "${kanjiData.clave}"`
  }
  else{

    clavesUnicas[kanjiData.clave] = kanjiData
    kanjisPorId[kanjiData.id] = kanjiData
  }

}

