const fs = require("fs")
const path = require("path")

module.exports = {
    walk,
    leerDir
}

function walk(dir = process.env["META_DIR"], {procesarEntrada}){

    console.log(`DIR ${dir}`)

    return new Promise((ok, ko) => {

        leerDir(dir).then((ee) => {

            return ee.map((entrada) => {
  
                if(entrada.tipo == "d")
                    return  walk(entrada.ruta, {procesarEntrada})
                else
                    return Promise.resolve(procesarEntrada(entrada))

            })

        }).then((entradas) => {

            return Promise.all(entradas.flat(Infinity))

        }).then((procesados) => {

            ok(procesados)

        })

    })


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
