const path = require("path")

module.exports = {
    validarPalabrasKana
}

// Devuelve una cadena con todos los errores (vacía si no hay ninguno).
// El esquema ya comprueba campos y tipos; aquí se comprueba que el artefacto
// dice lo mismo que su nombre de fichero y que sus datos no se contradicen.
function validarPalabrasKana(entradas){

    let errores = ""

    const porId = {}

    for(const entrada of entradas){

        const datos = entrada.datos
        const ruta = entrada.ruta

        const esperado = `${datos.id.replace(/\//g, "_")}.yml`

        if(path.basename(ruta) != esperado){

            errores += `${ruta}: la nomenclatura obligatoria del paquete es "${esperado}"\n`
        }

        if(datos.id != `${datos.nivel}/${datos.seccion}/${datos.palabra}`){

            errores += `${ruta}: el id "${datos.id}" no casa con nivel/seccion/palabra ("${datos.nivel}/${datos.seccion}/${datos.palabra}")\n`
        }

        if(porId[datos.id]){

            errores += `${ruta}: el id "${datos.id}" ya existe en ${porId[datos.id]}\n`
        }
        else{

            porId[datos.id] = ruta
        }

        const rutaImagen = `/vocabulario/imagenes/${datos.nivel}/${datos.seccion}/`

        if(!datos.imagen.includes(rutaImagen)){

            errores += `${ruta}: la imagen debe estar bajo "${rutaImagen}"\n`
        }
    }

    console.log(`Total de palabras de kana ${entradas.length}`)

    return errores
}
