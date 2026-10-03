const path = require("path")

module.exports = {

    validarLexicones,
    validarMascarasYomi
}

// Devuelve una cadena con todos los errores (vacía si no hay ninguno).
// El llamador es quien lanza, para que se vean todos los fallos de una vez.
function validarLexicones(lexicones, kanjisPorId){

    let errores = ""

    for(const id in lexicones){

        errores += validarLexicon(lexicones[id], kanjisPorId)
    }

    console.log(`Total de lexicones ${Object.keys(lexicones).length}`)

    return errores
}

function validarLexicon(entrada, kanjisPorId){

    const datos = entrada.datos
    const ruta = entrada.ruta
    const id = datos.id

    let errores = ""

    if(path.basename(ruta) != `${id}.yaml`){

        errores += `${ruta}: la nomenclatura obligatoria del paquete es "${id}.yaml"\n`
    }

    const kanji = kanjisPorId[id]

    if(!kanji){

        errores += `${ruta}: el carácter "${id}" no existe en data/\n`
    }
    else if(kanji.solo_componente){

        errores += `${ruta}: "${id}" es un solo componente, no existe en la lengua y no puede tener lexicon\n`
    }

    const vistas = {}

    for(const palabra of datos.palabras){

        errores += validarPalabra(palabra, id, kanjisPorId, ruta, vistas)
    }

    return errores
}

function validarPalabra(palabra, id, kanjisPorId, ruta, vistas){

    const ref = `${ruta} -> "${palabra.palabra}"`

    let errores = ""

    if(vistas[palabra.palabra]){

        errores += `${ref}: la palabra aparece más de una vez en este lexicon\n`
    }
    else{

        vistas[palabra.palabra] = true
    }

    if(![...palabra.palabra].includes(id)){

        errores += `${ref}: la palabra no contiene el carácter "${id}", que es el que da nombre al lexicon\n`
    }

    errores += validarMascara(palabra.mascara, palabra.palabra, palabra.lectura, ref)

    errores += validarFrase(palabra.frase, id, kanjisPorId, ref)

    return errores
}

function validarMascara(mascara, palabra, lectura, ref){

    let errores = ""

    if(/[^-.]/.test(mascara)){

        errores += `${ref}: la máscara "${mascara}" solo admite guiones y puntos\n`

        return errores
    }

    const guiones = (mascara.match(/-/g) || []).length
    const puntos = (mascara.match(/\./g) || []).length

    const kanaDeLectura = [...lectura].length
    const caracteresDePalabra = [...palabra].length

    if(guiones != kanaDeLectura){

        errores += `${ref}: la máscara "${mascara}" lleva ${guiones} guiones y la lectura "${lectura}" tiene ${kanaDeLectura} kana\n`
    }

    if(puntos != caracteresDePalabra - 1){

        errores += `${ref}: la máscara "${mascara}" lleva ${puntos} puntos y la palabra "${palabra}" pide ${caracteresDePalabra - 1}\n`
    }

    return errores
}

function validarFrase(frase, id, kanjisPorId, ref){

    let errores = ""

    const abiertos = (frase.match(/\(/g) || []).length
    const cerrados = (frase.match(/\)/g) || []).length

    if(abiertos != cerrados){

        errores += `${ref}: la frase tiene ${abiertos} paréntesis que abren y ${cerrados} que cierran\n`
    }

    if(!frase.includes(`(${id})`)){

        errores += `${ref}: la frase debe marcar el carácter de la familia como Referencia: "(${id})"\n`
    }

    const referencias = frase.match(/\([^()]*\)/g) || []

    for(const referencia of referencias){

        const contenido = referencia.slice(1, -1)

        if([...contenido].length != 1){

            errores += `${ref}: la Referencia "${referencia}" debe llevar un solo carácter entre paréntesis\n`
        }
        else if(!kanjisPorId[contenido]){

            errores += `${ref}: la Referencia "${referencia}" no apunta a un kanji que exista en data/\n`
        }
    }

    return errores
}

// La misma pauta de máscara que se exige a los lexicones, aplicada a los
// ejemplos de los grupos yomi: es el campo que la web usa para repartir la
// lectura bajo cada kanji.
function validarMascarasYomi(gruposYomi){

    let errores = ""

    let total = 0

    for(const id in gruposYomi){

        const ejemplos = gruposYomi[id].ejemplos || {}

        for(const clave in ejemplos){

            const ejemplo = ejemplos[clave]

            const ref = `yomi "${id}" -> ${clave} "${ejemplo.palabra}"`

            errores += validarMascara(ejemplo.mascara, ejemplo.palabra, ejemplo.lectura, ref)

            total++
        }
    }

    console.log(`Total de ejemplos de yomi con máscara comprobada ${total}`)

    return errores
}
