const yaml = require("js-yaml")
const fs = require("fs")
const path = require("path")
const ajv = require("ajv")

const kanaSchema = require("../schemas/kana.schema.json")
const kanjiSchema = require("../schemas/kanji.schema.json")
const grupoSchema = require("../schemas/grupo.schema.json")
const itinerarioSchema = require("../schemas/itinerario.schema.json")
const colaboradorSchema = require("../schemas/colaborador.schema.json")

const grupoOnSchema = require("../schemas/grupo-on.schema.json")

const Ajv = new ajv()
const kanaValidation = Ajv.compile(kanaSchema)
const kanjiValidation = Ajv.compile(kanjiSchema)
const grupoValidation = Ajv.compile(grupoSchema)
const itinerarioValidation = Ajv.compile(itinerarioSchema)
const colaboradorValidation = Ajv.compile(colaboradorSchema)
const grupoOnValidation = Ajv.compile(grupoOnSchema)

walk(process.env["YOMI_DIR"])

walk(process.env["KANA_DIR"])

walk(process.env["DATA_DIR"])

walk(process.env["META_DIR"])

const clavesUnicas = {}

async function walk(dir = process.env["DATA_DIR"]){
  
  console.log(`DIR ${dir}`)

  await Promise.all(

    (await leerDir(dir)).map((entrada) => {

      return procesarEntrada(entrada)

    })

  ).catch((err) => {

    console.error(err)

    throw err

  })

}

  function determinarTipo(entrada){

      const dir = path.basename(path.dirname(entrada))

      return (dir == "data" || dir == "componentes") ? "KANJI" :
          (dir == "kana" || dir == "hiragana" || dir == "katakana") ? "KANA" :
          (dir == "grupos") ? "GRUPO" :
          (dir == "on") ? "GRUPO-ON" :
          (dir == "itinerarios") ? "ITER" : 
          (dir == "colaboradores") ? "COLABORADOR" : 
           "DESCONOCIDO"

  }

  function procesarEntrada(entrada){

    if(entrada.tipo == "d")
      return walk(entrada.ruta)
    else
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

            validarFichero(data, tipo)

          }
          catch(err){

            ko(`en "${entrada}": ${err}`)

          }

        })

      })

    }

  }

  function validarFichero(kanjiData, tipo){

    const validador = (tipo === "KANJI") ? kanjiValidation : 

                        (tipo == "GRUPO") ? grupoValidation : 

                        (tipo == "GRUPO-ON") ? grupoOnValidation :

                        (tipo == "KANA") ? kanaValidation : 
                    
                        (tipo == "ITER") ? itinerarioValidation : colaboradorValidation;

    if(!validador(kanjiData)){
       
      //console.log(JSON.stringify(validador.errors, null, 4))
      throw JSON.stringify(validador.errors, null, 4)
    }

    if(tipo == "GRUPO" || tipo == "ITER" || tipo == "COLABORADOR" || tipo == "KANA" || tipo == "GRUPO-ON"){
        return
    }

    if(clavesUnicas[kanjiData.clave]){

      throw `Clave repetida: "${kanjiData.clave}"`
    }
    else{

      clavesUnicas[kanjiData.clave] = true
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
