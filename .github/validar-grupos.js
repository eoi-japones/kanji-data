module.exports = {

    validarGrupos
}

function validarGrupos(grupos, kanjis){

   let errores = ""

   for(const grupoId in grupos){
       console.log(`Validando internamente ${grupoId}`) 
       errores += validarGrupo(grupos[grupoId], kanjis)
   }

    if(errores != "")
        throw `\n${errores}`
}

function validarGrupo(grupo, kanjis){

    let errores = ""

    for(const kanji of grupo.integrantes){
        if(!(kanji in kanjis)){
            errores += `- Error validando grupo ${grupo.id}: kanji no encontrando ${kanji}\n`
        }
    }

    return errores
}
