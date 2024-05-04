const yaml = require("js-yaml")
const fs = require("fs")
const path = require("path")

const fichero = process.argv[2];

const data = fs.readFileSync(fichero)

if(!data)
    throw `Error leyendo ${fichero}`

const kanji = yaml.load(data)

if(!kanji){
    throw `No se puede cargar el kanji ${fichero}`
}

let change = false

if(!("solo_componente" in kanji)){

    kanji["solo_componente"] = 0
    change = true

}

if(change)
    fs.writeFileSync(fichero, yaml.dump(kanji), 'utf-8')
