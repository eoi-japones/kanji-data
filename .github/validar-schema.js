const yaml = require("js-yaml")
const fs = require("fs")
const path = require("path")
const ajv = require("ajv")

const kanjiSchema = require("../schemas/kanji.schema.json")

const Ajv = new ajv()
const kanjiValidation = Ajv.compile(kanjiSchema)

walk()

const clavesUnicas = {}

async function walk(dir = process.env["DATA_DIR"]){
  
  await Promise.all(

    (await leerDir(dir)).map((entrada) => {

      return procesarEntrada(entrada)

    })

  ).catch((err) => {

    console.error(err)

    throw err

  })

}

  function procesarEntrada(entrada){

    if(entrada.tipo == "d")
      return walk(entrada.ruta)
    else
      return procesarFichero(entrada.ruta)
  }

  function procesarFichero(entrada){

    if(entrada.match(/\.yaml|\.yml$/)){

      return new Promise((ok, ko) => {

        fs.readFile(entrada, 'utf-8', (err, data) => {
        
          if(err){

            return `Leyendo ${entrada}: ${err}`
          }

          console.log(`Validando fichero de kanji ${entrada}`)

          try{
           
            data = yaml.load(data)

            validarFichero(data)

          }
          catch(err){

            ko(`en "${entrada}": ${err}`)

          }

        })

      })

    }

  }

  function validarFichero(kanjiData){

    if(!kanjiValidation(kanjiData)){

      throw JSON.stringify(kanjiValidation.errors, null, 4)
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
