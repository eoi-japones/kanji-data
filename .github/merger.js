const yaml = require("js-yaml")
const fs = require("fs")
const path = require("path")

const output_file = process.env["OUTPUT_FILE"] || './kanji.data'

walk()

async function escribirEnFichero(datos){

  return new Promise((ok, ko) => {

    fs.appendFile(output_file, JSON.stringify(yaml.load(datos)) + "\n", 'utf-8', (err) => {

      if(err)
        return ko(`Escribiendo: ${err}`)
      else
        return ok()
    })
  })
}

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

          console.log(`procesando fichero de kanji ${entrada}`)

          try{
          
            escribirEnFichero(data)
      
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
