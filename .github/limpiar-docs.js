const fs = require("fs")
const path = require("path")

// Limpia de docs/assets los ficheros que ninguna versión publicada referencia.
// Cada publicación de la web añade un bundle con hash nuevo (index-*.js/css,
// mqtt.esm-*.js) sin borrar el anterior, y los assets acumulados acaban pesando
// más que la propia web. Este script conserva solo lo que referencia la versión
// viva (docs/index.html y docs/404.html) y borra el resto.
//
// Es conservador: solo actúa sobre el nivel superior de docs/assets. Los
// subdirectorios historias/ e iconos_grupos/ se cargan por nombre en tiempo de
// ejecución y se dejan intactos. Si no encuentra ninguna referencia, no borra
// nada (para no vaciar la carpeta por un fallo de lectura).

const DOCS_DIR = process.env["DOCS_DIR"] || "docs"
const ASSETS_DIR = path.join(DOCS_DIR, "assets")
const ENTRADAS = ["index.html", "404.html"]
const DRY_RUN = process.env["DRY_RUN"] == "1"

const EXTENSIONES = "js|css|svg|png|jpe?g|gif|ico|webp|woff2?|ttf|eot"

// Dos formas de citar un asset: con la ruta "assets/<nombre>" (fuentes,
// imágenes) o como import relativo "./<nombre>" que Vite resuelve contra
// docs/assets (el chunk de mqtt).
function patrones(){
    return [
        new RegExp(`assets/([A-Za-z0-9_.@-]+\\.(?:${EXTENSIONES}))`, "g"),
        /["'(]\.\/([A-Za-z0-9_.@-]+\.(?:js|css))["')]/g
    ]
}

function leer(ruta){
    return fs.readFileSync(ruta, "utf-8")
}

function esFichero(ruta){
    try {
        return fs.statSync(ruta).isFile()
    } catch (e) {
        return false
    }
}

// Basenames de assets citados en un texto (HTML, bundle JS o CSS).
function citados(texto){
    const nombres = new Set()
    for (const patron of patrones()) {
        let m
        while ((m = patron.exec(texto)) !== null) {
            nombres.add(m[1])
        }
    }
    return nombres
}

// Sigue las referencias desde los HTML de entrada: bundle -> chunks -> fuentes
// e imágenes. Se detiene cuando no aparecen nombres nuevos.
function referenciados(){
    const vistos = new Set()
    const pendientes = []

    const encolar = (nombre) => {
        if (!vistos.has(nombre)) {
            vistos.add(nombre)
            pendientes.push(nombre)
        }
    }

    for (const entrada of ENTRADAS) {
        const ruta = path.join(DOCS_DIR, entrada)
        if (!esFichero(ruta)) continue
        for (const nombre of citados(leer(ruta))) encolar(nombre)
    }

    while (pendientes.length) {
        const nombre = pendientes.pop()
        if (!/\.(js|css)$/.test(nombre)) continue
        const ruta = path.join(ASSETS_DIR, nombre)
        if (!esFichero(ruta)) continue
        for (const citado of citados(leer(ruta))) encolar(citado)
    }

    return vistos
}

function principales(){
    return fs.readdirSync(ASSETS_DIR).filter((nombre) => {
        return esFichero(path.join(ASSETS_DIR, nombre))
    })
}

const conservados = referenciados()

if (conservados.size == 0) {
    console.error(`Sin referencias en ${ENTRADAS.map((e) => path.join(DOCS_DIR, e)).join(", ")}; no se borra nada.`)
    process.exit(0)
}

let borrados = 0
let bytes = 0

for (const nombre of principales()) {
    if (conservados.has(nombre)) continue

    const ruta = path.join(ASSETS_DIR, nombre)
    const peso = fs.statSync(ruta).size

    console.log(`${DRY_RUN ? "[dry-run] borraría" : "borrado"} ${ruta} (${peso} bytes)`)
    if (!DRY_RUN) fs.unlinkSync(ruta)

    borrados++
    bytes += peso
}

console.log(`${borrados} fichero(s) sin referencia, ${(bytes / 1024 / 1024).toFixed(1)} MB.`)
