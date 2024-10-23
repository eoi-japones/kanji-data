/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/docs.ts":
/*!*********************!*\
  !*** ./src/docs.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.listNiveles = exports.getNivel = exports.listDocs = exports.getDoc = exports.initDocsBD = void 0;\nlet dbInitiated = false;\nconst docsMap = new Map();\nconst docsList = [];\nconst nivelesMap = new Map();\nconst nivelesList = [];\nasync function initDocsBD(docLoader, docs, niveles) {\n    if (dbInitiated) {\n        return;\n    }\n    dbInitiated = true;\n    for (const doc of docs) {\n        docsMap.set(doc.id, doc);\n        docsList.push(doc);\n    }\n    for (const nivel of niveles) {\n        nivelesMap.set(nivel.id, nivel);\n        nivelesList.push(nivel);\n    }\n}\nexports.initDocsBD = initDocsBD;\nasync function getDoc() {\n}\nexports.getDoc = getDoc;\nasync function listDocs(labels, operacion = \"any\") {\n    console.error(labels);\n    const filter = (operacion === \"any\") ? (doc) => {\n        return Object.keys(doc.labels).find((label) => doc.labels[label] === labels[label]);\n    } : (operacion === \"and\") ? (doc) => {\n        console.error(doc);\n        return Object.keys(labels).every((label) => doc.labels[label] === labels[label]);\n    } : null;\n    if (!filter) {\n        throw `listDocs: operacion desconocida = ${operacion}`;\n    }\n    return docsList.filter((doc) => filter(doc));\n}\nexports.listDocs = listDocs;\nasync function getNivel() {\n}\nexports.getNivel = getNivel;\nasync function listNiveles() {\n    return nivelesList;\n}\nexports.listNiveles = listNiveles;\n\n\n//# sourceURL=webpack://contentsLib/./src/docs.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.mockInit = exports.init = void 0;\nconst docs_1 = __webpack_require__(/*! ./docs */ \"./src/docs.ts\");\nasync function init(docLoader, docs = [], niveles = []) {\n    (0, docs_1.initDocsBD)(docLoader, docs, niveles);\n}\nexports.init = init;\nasync function mockInit() {\n    let docs = [];\n    let niveles = [];\n    return Promise.resolve().then(() => __importStar(__webpack_require__(/*! ./static/bundle.json */ \"./src/static/bundle.json\"))).then((mod) => {\n        return mod[\"default\"];\n    }).then((data) => {\n        docs = data.filter((e) => e.kind === \"contenidos.eoi/doc\");\n        niveles = data.filter((e) => e.kind === \"contenidos.eoi/nivel\");\n        return docs;\n    }).then((docs) => {\n        return (0, docs_1.initDocsBD)(() => { }, docs, niveles);\n    }).then(() => {\n        return {\n            getDoc: docs_1.getDoc,\n            listDocs: docs_1.listDocs,\n            listNiveles: docs_1.listNiveles\n        };\n    });\n}\nexports.mockInit = mockInit;\n\n\n//# sourceURL=webpack://contentsLib/./src/main.ts?");

/***/ }),

/***/ "./src/static/bundle.json":
/*!********************************!*\
  !*** ./src/static/bundle.json ***!
  \********************************/
/***/ ((module) => {

eval("module.exports = /*#__PURE__*/JSON.parse('[{\"id\":\"xa-a1.jp-ol-kana\",\"clave\":\"Ejercicios de japonés de verano I (Kanas)\",\"ref\":\"https://eoi-japones.github.io/contenidos/jp_ol_kana.pdf\",\"labels\":{\"nivel\":\"a1\",\"tipo\":\"practica\",\"mes\":\"agosto\",\"formato\":\"pdf\"},\"kind\":\"contenidos.eoi/doc\",\"version\":\"v1\"},{\"id\":\"xa-a1.kahoot-kanji-mayo-1\",\"clave\":\"Kahoot de kanji recomendados I\",\"ref\":\"https://create.kahoot.it/share/kanjis-obligatorios/0254d034-511b-44db-a498-ac9c2367e136\",\"labels\":{\"nivel\":\"a1\",\"tipo\":\"practica\",\"mes\":\"mayo\",\"formato\":\"kahoot\"},\"kind\":\"contenidos.eoi/doc\",\"version\":\"v1\"},{\"id\":\"xa-a1.kahoot-mayo-2\",\"clave\":\"Kahoot de japonés vocabulario urgente II\",\"ref\":\"https://create.kahoot.it/share/vocabulario-urgente-2/63fa86c6-7a22-4094-b935-8efff096f98b\",\"labels\":{\"nivel\":\"a1\",\"tipo\":\"practica\",\"mes\":\"mayo\",\"formato\":\"kahoot\"},\"kind\":\"contenidos.eoi/doc\",\"version\":\"v1\"},{\"id\":\"xa-a1.kahoot-mayo-1\",\"clave\":\"Kahoot de japonés vocabulario urgente I\",\"ref\":\"https://create.kahoot.it/share/vocabulario-urgente-1/eb486b00-952c-49f6-8c77-10c3aac3afac\",\"labels\":{\"nivel\":\"a1\",\"tipo\":\"practica\",\"mes\":\"mayo\",\"formato\":\"kahoot\"},\"kind\":\"contenidos.eoi/doc\",\"version\":\"v1\"},{\"id\":\"xa-a1.pr-mayo-1\",\"clave\":\"Práctica de japonés mayo I\",\"ref\":\"https://eoi-japones.github.io/contenidos/a1_practica_particulas_mayo.pdf\",\"labels\":{\"nivel\":\"a1\",\"tipo\":\"practica\",\"mes\":\"mayo\",\"formato\":\"pdf\"},\"kind\":\"contenidos.eoi/doc\",\"version\":\"v1\"},{\"id\":\"xa-a1.vocabulario-mayo\",\"clave\":\"Vocabulario recomendado\",\"ref\":\"https://eoi-japones.github.io/contenidos/a1_vocabulario.pdf\",\"labels\":{\"nivel\":\"a1\",\"tipo\":\"vocabulario\",\"mes\":\"mayo\",\"formato\":\"pdf\"},\"kind\":\"contenidos.eoi/doc\",\"version\":\"v1\"},{\"id\":\"xa-general.anki-tutorial\",\"clave\":\"Tutorial de Anki para crear contenido\",\"ref\":\"https://eoi-japones.github.io/contenidos/general_anki_tutorial.pdf\",\"labels\":{\"nivel\":\"general\",\"tipo\":\"tutorial\",\"mes\":\"mayo\",\"formato\":\"pdf\"},\"kind\":\"contenidos.eoi/doc\",\"version\":\"v1\"},{\"id\":\"xa-general.kanji-estudiar\",\"clave\":\"Recomendaciones para el estudio de kanjis con esta app\",\"ref\":\"https://eoi-japones.github.io/contenidos/kanji_user_manual.pdf\",\"labels\":{\"nivel\":\"general\",\"tipo\":\"tutorial\",\"mes\":\"mayo\",\"formato\":\"pdf\"},\"kind\":\"contenidos.eoi/doc\",\"version\":\"v1\"},{\"id\":\"xa-a1.kahoot-mayo-3\",\"clave\":\"Kahoot de japonés vocabulario urgente III\",\"ref\":\"https://create.kahoot.it/share/vocabulario-complementario/2c8aab65-9494-4925-abb4-1e6a13199cd2\",\"labels\":{\"nivel\":\"a1\",\"tipo\":\"practica\",\"mes\":\"mayo\",\"formato\":\"kahoot\"},\"kind\":\"contenidos.eoi/doc\",\"version\":\"v1\"},{\"id\":\"a1\",\"clave\":\"Nivel Básico I\",\"kind\":\"contenidos.eoi/nivel\",\"version\":\"v1\"},{\"id\":\"general\",\"clave\":\"Generalidades para el estudio\",\"kind\":\"contenidos.eoi/nivel\",\"version\":\"v1\"}]');\n\n//# sourceURL=webpack://contentsLib/./src/static/bundle.json?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	window.contentsLib = __webpack_exports__;
/******/ 	
/******/ })()
;