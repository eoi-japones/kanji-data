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

    let kanjisEnGrupo = {}

    const totalKanjisGrupo = [].concat(
        grupo.integrantes
    ).concat(
        grupo.auxiliares.map((aux) => aux.id)
    ).flat(Infinity)

    for(const kanji of totalKanjisGrupo){

        if(kanji in kanjisEnGrupo){
            errores += `- Error ya existe el kanji ${kanji} en el grupo ${grupo.id}: un kanji no puede repetirse en el mismo grupo`
        }
        else{
            kanjisEnGrupo[kanji] = true
        }

        if(!(kanji in kanjis)){
            errores += `- Error validando grupo ${grupo.id}: kanji no encontrando ${kanji}\n`
        }
    }

    return errores
}
