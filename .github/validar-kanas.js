const path = require("path")

module.exports = {
    validarKanas
}

// Devuelve una cadena con todos los errores (vacía si no hay ninguno).
// Cada kana es una ficha del carácter: el `id` es el propio carácter, es único
// y el nombre del fichero lo declara. El esquema no puede comprobar esto porque
// solo ve el contenido, no la ruta (ADR 0012).
function validarKanas(entradas){

    let errores = ""

    const porId = {}

    for(const entrada of entradas){

        const datos = entrada.datos
        const ruta = entrada.ruta

        const base = path.basename(ruta).replace(/\.ya?ml$/, "").trim()

        const nombresValidos = [datos.id, `${datos.id}-hiragana`, `${datos.id}-katakana`]

        if(!nombresValidos.includes(base)){

            errores += `${ruta}: el nombre debe ser "${datos.id}.yml", "${datos.id}-hiragana.yml" o "${datos.id}-katakana.yml"\n`
        }

        if([...datos.id].length != 1){

            errores += `${ruta}: el id de un kana debe ser un solo carácter, no "${datos.id}"\n`
        }

        const carpeta = path.basename(path.dirname(ruta))

        if(carpeta == "hiragana" && !/^[\u3040-\u309f]$/.test(datos.id)){

            errores += `${ruta}: "${datos.id}" no es un hiragana y está en la carpeta hiragana\n`
        }

        if(carpeta == "katakana" && !/^[\u30a0-\u30ff]$/.test(datos.id)){

            errores += `${ruta}: "${datos.id}" no es un katakana y está en la carpeta katakana\n`
        }

        if(porId[datos.id]){

            errores += `${ruta}: el id "${datos.id}" ya existe en ${porId[datos.id]}\n`
        }
        else{

            porId[datos.id] = ruta
        }
    }

    console.log(`Total de kanas ${entradas.length} (${Object.keys(porId).length} ids únicos)`)

    return errores
}
