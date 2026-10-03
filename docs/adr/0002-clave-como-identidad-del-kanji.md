# La clave es la identidad del kanji; el carácter (`id`) puede repetirse

Un mismo carácter japonés se estudia a veces bajo dos lecturas o dos significados distintos, y el modelo tiene que representarlo sin ambigüedad. Por eso la identidad de un kanji es su **clave** —la palabra en castellano, única en todo el sistema— y no su `id`, que es simplemente el carácter y **no es único**: en `data/` conviven hoy **catorce** caracteres con dos ficheros cada uno. Nueve viven solo en `data/` — 加 `añadir`/`agregar`, 吾 `yo_interior`/`el_yo_metafísico`, 昌 `prospero`/`próspero`, 贈 `regalo`/`Regalar`, 旦 `alba`/`amanecer`, 暖 `calidez`/`templado`, 粗 `burdo`/`chapuza`, 脈 `vena`/`venas` y 項 `parrafo`/`párrafo` — y cinco cruzan con `data/componentes/`: ⻖ `cúspide`/`muralla_cúspide`, 冂 `casco`/`vitrina`, 彡 `forma`/`Forma`, 𠂢 `porquería`/`ramificar` y 冊, que tiene un fichero en cada carpeta (`bloc_de_notas` y `Tomo`).

Vale la pena mirar los pares: dos de ellos (`昌`, `項`) solo se distinguen por un acento y dos (`彡`, `贈`) por una mayúscula, de modo que la separación entre claves es en algunos casos puramente ortográfica.

La validación refuerza esta decisión: `.github/validar-schema.js` comprueba que ninguna clave se repita y no comprueba nada sobre `id`.

## Estado

**aceptado**

## Opciones consideradas

- **Unicidad del `id`**: descartada. Obligaría a fusionar o renombrar los catorce caracteres duplicados y a perder la posibilidad de estudiar un mismo carácter bajo dos claves pedagógicas distintas.
- **Identidad compuesta `id + clave`**: descartada. Aporta lo mismo que la clave ya garantiza, con más complejidad en cada referencia.

## Consecuencias

- Cualquier referencia a un kanji fuera de `data/` debe hacerse **por clave**, no por carácter.
- El mapa interno `kanjisPorId` usado para validar grupos sobrescribe silenciosamente la entrada anterior cuando un carácter se repite: la comprobación de que un kanji de un grupo exista se resuelve sobre el último fichero cargado de ese carácter. Conviene recordarlo antes de dar por buena esa validación.
- El nombre del fichero, `id,clave.yml`, contiene ambos elementos, de modo que dos ficheros del mismo carácter se distinguen por su segunda mitad.
