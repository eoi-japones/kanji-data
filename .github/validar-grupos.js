module.exports = {

    validarGrupos
}

function validarGrupos(grupos, kanjis){

   let errores = ""

   let kanjisEnVariosGrupos = {}

   for(const grupoId in grupos){
       console.log(`Validando internamente ${grupoId}`) 
       errores += validarGrupo(grupos[grupoId], kanjis)
   }

   errores += validarKanjisEnVariosGrupos(grupos, kanjisEnVariosGrupos)

    if(errores != "")
        throw `\n${errores}`
    else
        console.log(`Total de grupos ${Object.keys(grupos).length} => con ${Object.keys(kanjisEnVariosGrupos).length} kanjis\n`)
}

function validarKanjisEnVariosGrupos(grupos, kanjisEnVariosGrupos){

   let errores = ""

   for(const grupoId in grupos){
   
        const totalKanjisGrupo = helperExtractorKanjisGrupo(grupos[grupoId])

        for(kanji of totalKanjisGrupo){

            if(kanji in kanjisEnVariosGrupos){
        
                errores += `El kanji ${kanji} del grupo '${grupoId}' ya esta presente en el grupo "${kanjisEnVariosGrupos[kanji]}"\n`  
            }
            else{
        
                kanjisEnVariosGrupos[kanji] = grupoId
            }
        }

   }

   return errores

}

function helperExtractorKanjisGrupo(grupo){

    return [].concat(
        grupo.integrantes
    ).concat(
        grupo.auxiliares.map((aux) => aux.id)
    ).flat(Infinity)
}

function validarGrupo(grupo, kanjis){

    let errores = ""

    let kanjisEnGrupo = {}

    const totalKanjisGrupo = helperExtractorKanjisGrupo(grupo)

    for(const kanji of totalKanjisGrupo){

        if(kanji in kanjisEnGrupo){
            errores += `- Error ya existe el kanji ${kanji} en el grupo ${grupo.id}: un kanji no puede repetirse en el mismo grupo\n`
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
