// Generador determinista de lexicones.
//
// Deriva el conjunto de palabras de cada familia (kanji) del diccionario JMdict
// filtrado al inventario de `data/`, calcula la máscara con las lecturas de
// KANJIDIC y el tipo de lectura por el kanji de la familia, y ensambla los YAML
// de `lexicon/lexicon/` conservando los campos de idioma ya redactados.
//
// La redacción de `significado`, `frase` y `traduccion` no es cosa de este
// script: lo pendiente sale en una lista de trabajo que la skill rellena. Ver
// docs/adr/0007-los-lexicones-se-generan-desde-jmdict.md.
//
// Modos:
//   node .github/generar-lexicones.js --generar   calcula, emite la lista de
//                                                  trabajo y escribe los YAML
//   node .github/generar-lexicones.js --check      evalúa sin escribir; falla
//                                                  ante cualquier deriva
//
// Variables de entorno (mismas que el resto del repo, más las fuentes):
//   DATA_DIR, LEXICON_DIR, EXCEPCIONES_DIR, PENDIENTES_FILE, DICCIONARIOS_DIR
//   JMDICT_JSON, KANJIDIC_JSON  rutas directas a las fuentes ya extraídas
//   COBERTURA_COMPLETA=1        convierte la cobertura en requisito duro

const fs = require("fs")
const path = require("path")
const https = require("https")
const zlib = require("zlib")
const yaml = require("js-yaml")

const DATA_DIR = process.env.DATA_DIR || "data"
const LEXICON_DIR = process.env.LEXICON_DIR || "lexicon/lexicon"
const EXCEPCIONES_DIR = process.env.EXCEPCIONES_DIR || "lexicon/excepciones"
const PENDIENTES_FILE = process.env.PENDIENTES_FILE || "lexicon/pendientes.json"
const DICCIONARIOS_DIR = process.env.DICCIONARIOS_DIR || ".cache/diccionarios"
const REVISAR_FILE = process.env.REVISAR_FILE || ".cache/lexicones-revisar.txt"
const COBERTURA_COMPLETA = process.env.COBERTURA_COMPLETA == "1"

const JMDICT_VERSION = process.env.JMDICT_VERSION || "3.6.2+20260928191014"
const KANJIDIC_VERSION = process.env.KANJIDIC_VERSION || JMDICT_VERSION

const KANJI = /^[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]$/
const MAX_GLOSAS = 3

main()

async function main(){

    const modo = process.argv[2]

    if(modo != "--generar" && modo != "--check"){

        console.error("uso: node .github/generar-lexicones.js --generar|--check")
        process.exit(2)
    }

    const inventario = leerInventario(DATA_DIR)

    const kanjidic = leerKanjidic(await rutaFuente("kanjidic"))
    const jmdict = leerJmdict(await rutaFuente("jmdict"))

    const excepciones = leerExcepciones(EXCEPCIONES_DIR)

    const objetivo = calcularObjetivo(jmdict, inventario, kanjidic, excepciones)

    if(modo == "--check"){

        comprobar(objetivo, excepciones)
    }
    else{

        generar(objetivo)
    }
}

// --- inventario ---------------------------------------------------------

// Recorre `data/` y devuelve dos conjuntos: `presentes`, todos los caracteres
// que existen en la app (raíz o `componentes/`), y `noSolo`, los que pueden
// tener lexicon porque no son solo-componentes.
function leerInventario(dir){

    const presentes = new Set()
    const noSolo = new Set()

    for(const ruta of ficherosYaml(dir)){

        const datos = yaml.load(fs.readFileSync(ruta, "utf-8"))

        if(datos && datos.id){

            presentes.add(datos.id)

            if(!datos.solo_componente) noSolo.add(datos.id)
        }
    }

    return {presentes, noSolo}
}

function ficherosYaml(dir){

    const salida = []

    for(const entrada of fs.readdirSync(dir, {withFileTypes:true})){

        const ruta = path.join(dir, entrada.name)

        if(entrada.isDirectory()){

            salida.push(...ficherosYaml(ruta))
        }
        else if(/\.ya?ml$/.test(entrada.name)){

            salida.push(ruta)
        }
    }

    return salida
}

// --- fuentes ------------------------------------------------------------

async function rutaFuente(tipo){

    const directa = process.env[tipo == "jmdict" ? "JMDICT_JSON" : "KANJIDIC_JSON"]

    if(directa) return directa

    const destino = path.join(DICCIONARIOS_DIR, `${tipo}.json`)

    if(fs.existsSync(destino)) return destino

    await descargarFuente(tipo, destino)

    return destino
}

async function descargarFuente(tipo, destino){

    const version = tipo == "jmdict" ? JMDICT_VERSION : KANJIDIC_VERSION
    const nombre = tipo == "jmdict" ? "jmdict-eng" : "kanjidic2-en"
    const codificada = encodeURIComponent(version)

    const url = `https://github.com/scriptin/jmdict-simplified/releases/download/${codificada}/${nombre}-${codificada}.json.tgz`

    console.error(`descargando ${tipo} ${version}`)

    const comprimido = await descargar(url)

    const json = extraerDeTar(zlib.gunzipSync(comprimido), ".json")

    fs.mkdirSync(path.dirname(destino), {recursive:true})

    fs.writeFileSync(destino, json)
}

function descargar(url, redirecciones = 0){

    return new Promise((ok, ko) => {

        https.get(url, (res) => {

            if([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location){

                res.resume()

                if(redirecciones > 5) return ko(`demasiadas redirecciones en ${url}`)

                return descargar(res.headers.location, redirecciones + 1).then(ok, ko)
            }

            if(res.statusCode != 200) return ko(`HTTP ${res.statusCode} en ${url}`)

            const trozos = []

            res.on("data", (d) => trozos.push(d))
            res.on("end", () => ok(Buffer.concat(trozos)))
            res.on("error", ko)

        }).on("error", ko)
    })
}

// Extractor mínimo de tar: basta con recorrer las cabeceras de 512 bytes.
function extraerDeTar(buffer, sufijo){

    let offset = 0

    while(offset + 512 <= buffer.length){

        const nombre = buffer.toString("utf-8", offset, offset + 100).replace(/\0.*$/, "")

        const tamaño = parseInt(buffer.toString("ascii", offset + 124, offset + 136).replace(/\0.*$/, "").trim(), 8) || 0

        if(nombre.endsWith(sufijo)){

            return buffer.subarray(offset + 512, offset + 512 + tamaño)
        }

        offset += 512 + Math.ceil(tamaño / 512) * 512
    }

    throw `no se encontró ${sufijo} en el tar`
}

function leerJmdict(ruta){

    console.error("cargando JMdict…")

    return JSON.parse(fs.readFileSync(ruta, "utf-8")).words
}

// Devuelve un mapa kanji -> candidatos de lectura, cada uno {seg, tipo},
// ordenados de más largo a más corto para el retroceso.
function leerKanjidic(ruta){

    console.error("cargando KANJIDIC…")

    const caracteres = JSON.parse(fs.readFileSync(ruta, "utf-8")).characters

    const mapa = new Map()

    for(const c of caracteres){

        const grupos = (c.readingMeaning && c.readingMeaning.groups) || []

        const candidatos = []

        for(const grupo of grupos){

            for(const lectura of grupo.readings || []){

                if(lectura.type == "ja_on"){

                    candidatos.push({seg: aHiragana(lectura.value), tipo: "on"})
                }
                else if(lectura.type == "ja_kun"){

                    const limpia = lectura.value.replace(/^-/, "").replace(/-$/, "")

                    const partes = limpia.split(".")

                    const tallo = partes[0]

                    const completa = partes.join("")

                    if(tallo) candidatos.push({seg: tallo, tipo: "kun"})

                    if(completa != tallo) candidatos.push({seg: completa, tipo: "kun"})

                    // La okurigana no siempre va marcada con punto: 其 "その" se
                    // reparte como そ + の. Se admiten prefijos y el retroceso
                    // decide; el más largo gana.
                    for(let n = completa.length - 1; n >= 1; n--){

                        candidatos.push({seg: completa.slice(0, n), tipo: "kun"})
                    }
                }
            }
        }

        const unicos = new Map()

        for(const candidato of candidatos){

            if(!unicos.has(candidato.seg)) unicos.set(candidato.seg, candidato)
        }

        mapa.set(c.literal, [...unicos.values()].sort((a, b) => b.seg.length - a.seg.length))
    }

    return mapa
}

// --- excepciones --------------------------------------------------------

// Mapa `${palabra}\u0000${lectura}` -> {mascara, tipo_lectura, motivo}
function leerExcepciones(dir){

    const mapa = new Map()

    if(!fs.existsSync(dir)) return mapa

    for(const ruta of ficherosYaml(dir)){

        const datos = yaml.load(fs.readFileSync(ruta, "utf-8"))

        for(const e of (datos && datos.excepciones) || []){

            const clave = `${e.palabra}\u0000${e.lectura}`

            if(mapa.has(clave)){

                throw `${ruta}: excepción repetida para "${e.palabra}" (${e.lectura})`
            }

            const guiones = (e.mascara.match(/-/g) || []).length
            const puntos = (e.mascara.match(/\./g) || []).length

            if(guiones != [...e.lectura].length || puntos != [...e.palabra].length - 1){

                throw `${ruta}: la máscara de "${e.palabra}" (${e.lectura}) no cuadra: ${guiones} guiones, ${puntos} puntos`
            }

            mapa.set(clave, e)
        }
    }

    return mapa
}

// --- cálculo del objetivo -----------------------------------------------

// Devuelve un mapa kanji -> lista ordenada de palabras objetivo.
function calcularObjetivo(jmdict, inventario, kanjidic, excepciones){

    const porKanji = new Map()

    let elegibles = 0
    let aproximadas = 0

    const revisar = []

    for(const entrada of jmdict){

        if(!esElegible(entrada, inventario)) continue

        const forma = formaPrincipal(entrada)
        const lectura = lecturaPrincipal(entrada, forma)

        if(!forma || !lectura) continue

        elegibles++

        const excepcion = excepciones.get(`${forma}\u0000${lectura}`)

        let segmentos = null
        let mascara = null

        if(excepcion){

            mascara = excepcion.mascara
        }
        else{

            segmentos = segmentar(forma, lectura, kanjidic)

            if(!segmentos){

                // Reparto aproximado: los kana se casan literalmente y el
                // tramo dudoso de cada racha de kanji va al primero. Queda
                // anotado para revisión; una excepción puede afinarlo.
                segmentos = segmentarAproximado(forma, lectura)

                if(!segmentos) segmentos = ultimoRecurso(forma, lectura)

                aproximadas++
                revisar.push(`${forma} (${lectura}) -> ${construirMascara(segmentos)}`)
            }

            mascara = construirMascara(segmentos)
        }

        const frecuencia = claveFrecuencia(entrada)

        for(const kanji of new Set([...forma].filter(esKanji))){

            if(!inventario.noSolo.has(kanji)) continue

            const tipo = tipoDeFamilia(kanji, forma, segmentos, excepcion)

            if(!tipo) continue

            if(!porKanji.has(kanji)) porKanji.set(kanji, [])

            porKanji.get(kanji).push({

                palabra: forma,
                lectura,
                tipo_lectura: tipo,
                mascara,
                frecuencia,
                glosas: glosas(entrada)
            })
        }
    }

    for(const lista of porKanji.values()){

        lista.sort((a, b) => a.frecuencia - b.frecuencia || a.palabra.localeCompare(b.palabra))
    }

    console.error(`elegibles ${elegibles}, reparto aproximado ${aproximadas}, familias ${porKanji.size}`)

    if(revisar.length){

        fs.mkdirSync(path.dirname(REVISAR_FILE), {recursive:true})

        fs.writeFileSync(REVISAR_FILE, revisar.join("\n") + "\n")

        console.error(`repartos aproximados a revisar: ${revisar.length} -> ${REVISAR_FILE}`)
    }

    return porKanji
}

function esElegible(entrada, inventario){

    if(!Array.isArray(entrada.kanji) || !entrada.kanji.length) return false
    if(!Array.isArray(entrada.kana) || !entrada.kana.length) return false

    const forma = formaPrincipal(entrada)

    if(!forma) return false

    const kanjis = [...forma].filter(esKanji)

    if(!kanjis.length) return false

    // Todos los kanji de la palabra han de existir en la app; al menos uno,
    // el que puede dar familia, no puede ser solo-componente.
    if(!kanjis.every((k) => inventario.presentes.has(k))) return false
    if(!kanjis.some((k) => inventario.noSolo.has(k))) return false

    const sentidos = entrada.sense || []
    const pos = sentidos.flatMap((s) => s.partOfSpeech || [])
    const misc = sentidos.flatMap((s) => s.misc || [])

    if(pos.includes("pn") || pos.includes("name")) return false

    if(misc.some((m) => ["arch", "obs", "obsc"].includes(m))) return false

    return true
}

// Reparto aproximado: cada kana se casa literalmente y el tramo entre dos
// kanas va al primer kanji de la racha; los demás de la racha quedan vacíos.
function segmentarAproximado(palabra, lectura){

    const chars = [...palabra]
    const kana = [...lectura]

    const resultado = new Array(chars.length)

    let j = 0

    for(let i = 0; i < chars.length; i++){

        const c = chars[i]

        if(!esKanji(c)){

            if(j >= kana.length || !igualKana(kana[j], aHiragana(c))) return null

            resultado[i] = {seg: c, tipo: "kana"}
            j++

            continue
        }

        let siguienteKana = -1

        for(let k = i + 1; k < chars.length; k++){

            if(!esKanji(chars[k])){ siguienteKana = k; break }
        }

        let fin = kana.length

        if(siguienteKana != -1){

            const esperado = aHiragana(chars[siguienteKana])

            fin = -1

            for(let n = j; n < kana.length; n++){

                if(igualKana(kana[n], esperado)){ fin = n; break }
            }

            if(fin == -1) return null
        }

        const enRacha = i > 0 && esKanji(chars[i - 1])

        const tramo = enRacha ? "" : kana.slice(j, fin).join("")

        if(!enRacha) j = fin

        resultado[i] = {seg: tramo, tipo: "kun"}
    }

    return j == kana.length ? resultado : null
}

// Si ni siquiera los kana se pueden casar, toda la lectura va al primer
// carácter. Garantiza una máscara válida y deja el caso en revisión.
function ultimoRecurso(palabra, lectura){

    return [...palabra].map((c, i) => ({seg: i == 0 ? lectura : "", tipo: "kun"}))
}

function formaPrincipal(entrada){

    const comunes = entrada.kanji.filter((k) => k.common)

    return (comunes[0] || entrada.kanji[0]).text
}

function lecturaPrincipal(entrada, forma){

    const aplicables = entrada.kana.filter((k) =>
        k.appliesToKanji.includes("*") || k.appliesToKanji.includes(forma)
    )

    const comunes = aplicables.filter((k) => k.common)

    return (comunes[0] || aplicables[0] || entrada.kana[0]).text
}

// Menor es más frecuente: primero las comunes, luego el rango `nfXX`.
function claveFrecuencia(entrada){

    const formas = [...(entrada.kanji || []), ...(entrada.kana || [])]

    const comun = formas.some((f) => f.common)

    let rango = 99

    for(const f of formas){

        for(const tag of f.tags || []){

            const m = /^nf(\d+)$/.exec(tag)

            if(m) rango = Math.min(rango, Number(m[1]))
        }
    }

    return (comun ? 0 : 1000) + rango
}

function glosas(entrada){

    const salida = []

    for(const sentido of entrada.sense || []){

        for(const glosa of sentido.gloss || []){

            if(glosa.lang == "eng" && !salida.includes(glosa.text)){

                salida.push(glosa.text)
            }
        }

        if(salida.length >= MAX_GLOSAS) break
    }

    return salida.slice(0, MAX_GLOSAS)
}

// --- segmentación y máscara ---------------------------------------------

// Reparte la lectura entre los caracteres de la palabra. Devuelve una lista de
// {seg, tipo} por carácter, o null si no hay reparto posible.
function segmentar(palabra, lectura, kanjidic){

    const chars = [...palabra]
    const kana = [...lectura]

    const resultado = new Array(chars.length)

    function rec(i, j){

        if(i == chars.length && j == kana.length) return true
        if(i == chars.length || j > kana.length) return false

        const c = chars[i]

        if(esKanji(c)){

            for(const candidato of kanjidic.get(c) || []){

                const seg = [...candidato.seg]

                if(seg.every((k, n) => igualKana(kana[j + n], k))){

                    resultado[i] = candidato

                    if(rec(i + 1, j + seg.length)) return true
                }
            }

            return false
        }

        if(igualKana(kana[j], aHiragana(c))){

            resultado[i] = {seg: c, tipo: "kana"}

            return rec(i + 1, j + 1)
        }

        return false
    }

    return rec(0, 0) ? resultado : null
}

function construirMascara(segmentos){

    return segmentos.map((s, i) => "-".repeat([...s.seg].length) + (i < segmentos.length - 1 ? "." : "")).join("")
}

function tipoDeFamilia(kanji, forma, segmentos, excepcion){

    if(excepcion) return excepcion.tipo_lectura

    const indice = [...forma].indexOf(kanji)

    if(indice == -1) return null

    const tipo = segmentos[indice] && segmentos[indice].tipo

    return (tipo == "on" || tipo == "kun") ? tipo : null
}

// --- evaluación (--check) -----------------------------------------------

function comprobar(objetivo, excepciones){

    const errores = []

    const existentes = leerLexicones(LEXICON_DIR)

    for(const [kanji, entrada] of existentes){

        const lista = objetivo.get(kanji)

        if(!lista){

            errores.push(`${entrada.ruta}: "${kanji}" ya no tiene lexicon en el objetivo`)
            continue
        }

        const objetivoPorPalabra = new Map(lista.map((p) => [p.palabra, p]))

        for(const palabra of entrada.datos.palabras){

            const objetivoPalabra = objetivoPorPalabra.get(palabra.palabra)

            if(!objetivoPalabra){

                errores.push(`${entrada.ruta} -> "${palabra.palabra}": no está en el conjunto generado`)
                continue
            }

            if(palabra.lectura != objetivoPalabra.lectura)
                errores.push(`${entrada.ruta} -> "${palabra.palabra}": lectura "${palabra.lectura}" != "${objetivoPalabra.lectura}"`)

            if(palabra.mascara != objetivoPalabra.mascara)
                errores.push(`${entrada.ruta} -> "${palabra.palabra}": máscara "${palabra.mascara}" != "${objetivoPalabra.mascara}"`)

            if(palabra.tipo_lectura != objetivoPalabra.tipo_lectura)
                errores.push(`${entrada.ruta} -> "${palabra.palabra}": tipo_lectura "${palabra.tipo_lectura}" != "${objetivoPalabra.tipo_lectura}"`)

            for(const campo of ["significado", "frase", "traduccion"]){

                if(!palabra[campo]) errores.push(`${entrada.ruta} -> "${palabra.palabra}": falta ${campo}`)
            }
        }

        const pendientes = lista.filter((p) => !entrada.porPalabra.has(p.palabra))

        if(pendientes.length){

            console.error(`${kanji}: ${pendientes.length} palabras pendientes de redactar`)
        }
    }

    const cobertura = [...objetivo.entries()].filter(([, lista]) => lista.length >= 2)

    const sinFichero = cobertura.filter(([kanji]) => !existentes.has(kanji))

    console.error(`lexicones objetivo ${cobertura.length}, existentes ${existentes.size}, sin fichero ${sinFichero.length}`)

    if(COBERTURA_COMPLETA && sinFichero.length){

        for(const [kanji] of sinFichero) errores.push(`cobertura incompleta: "${kanji}" tiene familia y no tiene lexicon`)
    }

    if(errores.length){

        throw `\n${errores.join("\n")}\n`
    }
}

// --- generación (--generar) ---------------------------------------------

function generar(objetivo){

    const idioma = leerIdiomaExistente(LEXICON_DIR, objetivo)

    const trabajo = leerTrabajo(PENDIENTES_FILE)

    for(const [palabra, contenido] of trabajo) idioma.set(palabra, contenido)

    const pendientes = new Map()

    const escritos = new Set()

    for(const [kanji, lista] of objetivo){

        const filas = []

        for(const p of lista){

            const textos = idioma.get(p.palabra)

            if(textos){

                filas.push({...p, ...textos, frase: marcarReferencia(textos.frase, p.palabra, kanji)})
            }
            else{

                if(!pendientes.has(p.palabra)) pendientes.set(p.palabra, {...p})
            }
        }

        const ruta = path.join(LEXICON_DIR, `${kanji}.yaml`)

        if(filas.length >= 2){

            escribirLexicon(ruta, kanji, filas)
            escritos.add(kanji)
        }
        else if(fs.existsSync(ruta)){

            fs.rmSync(ruta)
            console.error(`borrado ${ruta}: ya no alcanza el mínimo`)
        }
    }

    escribirTrabajo(PENDIENTES_FILE, pendientes)

    const cobertura = [...objetivo.entries()].filter(([, lista]) => lista.length >= 2)

    console.error(`lexicones escritos ${escritos.size} de ${cobertura.length} objetivo, palabras pendientes ${pendientes.size}`)
}

function leerLexicones(dir){

    const mapa = new Map()

    if(!fs.existsSync(dir)) return mapa

    for(const ruta of ficherosYaml(dir)){

        const datos = yaml.load(fs.readFileSync(ruta, "utf-8"))

        if(!datos || !datos.id) continue

        const porPalabra = new Map((datos.palabras || []).map((p) => [p.palabra, p]))

        mapa.set(datos.id, {ruta, datos, porPalabra})
    }

    return mapa
}

// Recolecta el idioma ya redactado, en cualquier familia, indexado por palabra.
function leerIdiomaExistente(dir, objetivo){

    const idioma = new Map()

    const existentes = leerLexicones(dir)

    for(const {datos} of existentes.values()){

        for(const palabra of datos.palabras || []){

            if(palabra.significado && palabra.frase && palabra.traduccion){

                idioma.set(palabra.palabra, {

                    significado: palabra.significado,
                    frase: sinMarcas(palabra.frase),
                    traduccion: palabra.traduccion
                })
            }
        }
    }

    return idioma
}

// Envuelve el kanji de la familia en `(...)`, dentro de la palabra si se puede
// localizar, o en su primera aparición.
function marcarReferencia(frase, palabra, kanji){

    const base = sinMarcas(frase)

    if(base.includes(`(${kanji})`)) return base

    const posicion = localizarEnPalabra(base, palabra, kanji)

    if(posicion >= 0) return base.slice(0, posicion) + `(${kanji})` + base.slice(posicion + 1)

    const primera = base.indexOf(kanji)

    if(primera >= 0) return base.slice(0, primera) + `(${kanji})` + base.slice(primera + 1)

    return base
}

function localizarEnPalabra(frase, palabra, kanji){

    let desde = 0

    while(true){

        const i = frase.indexOf(palabra, desde)

        if(i < 0) return -1

        const dentro = palabra.indexOf(kanji)

        if(dentro >= 0) return i + dentro

        desde = i + 1
    }
}

function sinMarcas(texto){

    return texto.replace(/\(([^()]*)\)/g, "$1")
}

function escribirLexicon(ruta, kanji, filas){

    const datos = {

        id: kanji,
        palabras: filas.map((f) => ({

            palabra: f.palabra,
            lectura: f.lectura,
            tipo_lectura: f.tipo_lectura,
            significado: f.significado,
            mascara: f.mascara,
            frase: f.frase,
            traduccion: f.traduccion
        }))
    }

    const texto = yaml.dump(datos, {lineWidth: -1, noRefs: true, quotingType: "'"})
        .replace(/^(\s*mascara: )(.+)$/gm, (m, etiqueta, valor) =>
            etiqueta + (/^['"]/.test(valor) ? valor : `'${valor}'`))

    fs.writeFileSync(ruta, texto)
}

function leerTrabajo(ruta){

    const mapa = new Map()

    if(!fs.existsSync(ruta)) return mapa

    const datos = JSON.parse(fs.readFileSync(ruta, "utf-8"))

    for(const p of datos.palabras || []){

        if(p.significado && p.frase && p.traduccion){

            mapa.set(p.palabra, {significado: p.significado, frase: p.frase, traduccion: p.traduccion})
        }
    }

    return mapa
}

function escribirTrabajo(ruta, pendientes){

    const palabras = [...pendientes.values()].map((p) => ({

        palabra: p.palabra,
        lectura: p.lectura,
        tipo_lectura: p.tipo_lectura,
        mascara: p.mascara,
        glosas: p.glosas,
        significado: "",
        frase: "",
        traduccion: ""
    }))

    if(!palabras.length && !fs.existsSync(ruta)) return

    fs.mkdirSync(path.dirname(ruta), {recursive:true})

    fs.writeFileSync(ruta, JSON.stringify({version: 1, palabras}, null, 2))
}

// --- utilidades ---------------------------------------------------------

function esKanji(c){

    return KANJI.test(c)
}

// Compara kana ignorando la sonorización (rendaku: はこ -> ばこ, ぱこ).
function igualKana(a, b){

    return a != null && b != null && normalizarKana(a) == normalizarKana(b)
}

function normalizarKana(c){

    const DAKUTEN = {

        "が":"か","ぎ":"き","ぐ":"く","げ":"け","ご":"こ",
        "ざ":"さ","じ":"し","ず":"す","ぜ":"せ","ぞ":"そ",
        "だ":"た","ぢ":"ち","づ":"つ","で":"て","ど":"と",
        "ば":"は","び":"ひ","ぶ":"ふ","べ":"へ","ぼ":"ほ",
        "ぱ":"は","ぴ":"ひ","ぷ":"ふ","ぺ":"へ","ぽ":"ほ",
        "ゔ":"う"
    }

    return DAKUTEN[c] || c
}

function aHiragana(texto){

    return [...texto].map((c) => {

        const code = c.charCodeAt(0)

        return (code >= 0x30a1 && code <= 0x30f6) ? String.fromCharCode(code - 0x60) : c

    }).join("")
}
