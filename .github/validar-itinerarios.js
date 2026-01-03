module.exports = {
    
    validarItinerarios
}

function validarItinerarios(itinerarios, grupos){

    let errores = ""

    for(const itinerario_id in itinerarios){

        console.log(`Validando itinerario ${itinerario_id}`)

        errores += validarItinerario(itinerarios[itinerario_id], grupos)
    }

    if(errores != "")
        throw `\n${errores}`

}

function validarItinerario(itinerario, grupos){

    let errores = ""

    for(const grupo_id of itinerario.iter){

        if(!(grupo_id in grupos)){

            errores += `En itinerario ${itinerario.id} => el grupo ${grupo_id} no existe\n`
        }
    }

    return errores

}
