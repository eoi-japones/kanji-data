# kanji-data

Base de conocimiento en YAML del curso de kanji de la EOI de Vigo: kanji, kana, grupos, itinerarios, lecturas y las personas que los sostienen.

> **Relación con la norma suprema.** `DEFINICIONES.md` tiene fuerza suprema (`CONSTITUCION.md`, Regla 2.3) y **no puede ser redefinida**. Por eso las cinco entradas del núcleo no se enuncian aquí: solo se señalan. Este glosario aporta los conceptos que `DEFINICIONES.md` no recoge. Ante cualquier discrepancia prevalece `DEFINICIONES.md`.

## Glosario

### Núcleo — definido con fuerza suprema en `DEFINICIONES.md`

**Kanji**:
`DEFINICIONES.md`, sección 1.
_Evitar_: carácter, ideograma

**Solo componente**:
`DEFINICIONES.md`, sección 2.
_Evitar_: componente suelto, radical inventado

**Grupo**:
`DEFINICIONES.md`, sección 3.
_Evitar_: lección, unidad, categoría

**Itinerario**:
`DEFINICIONES.md`, sección 4 (Itinerario).
_Evitar_: ruta, secuencia, programa

**Paquete**:
`DEFINICIONES.md`, sección 4 (Paquete).
_Evitar_: módulo, directorio, carpeta

### Identidad y contenido de un kanji

**Clave**:
La palabra en castellano que nombra a un kanji. Conforme a `DEFINICIONES.md` sección 1, es única en todo el sistema: dos kanji distintos jamás comparten clave.
_Evitar_: traducción, título, etiqueta, palabra clave

**Id de kanji**:
El carácter japonés del kanji, tal y como se escribe (`DEFINICIONES.md` sección 1). **No es único**: un mismo carácter puede repetirse en ficheros distintos cuando se estudia bajo dos claves.
_Evitar_: clave, código, identificador

**Componente**:
Una pieza que forma parte de un kanji y que se cita por su clave. Un componente puede ser a su vez un kanji o un solo componente.
_Evitar_: radical (no todo componente es radical), pieza, parte

**Componente sin glifo propio**:
Una forma inventada para fines mnemotécnicos que no se escribe con un carácter propio: su identidad es una etiqueta que lleva el prefijo `#` y su clave una etiqueta que lleva el prefijo `*`.
_Evitar_: pseudo-kanji, componente falso, componente libre

**Historia**:
El relato que explica el dibujo de un kanji, un kana o un solo componente. `DEFINICIONES.md` sección 1 fija su estructura y `data/RULES.md` sus normas de redacción.
_Evitar_: significado, definición, biografía

### Kana

**Kana**:
Un signo del silabario, ya sea hiragana o katakana. Comparte la estructura del kanji, incluida su historia.
_Evitar_: letra, sílaba, carácter

### Grupos de lectura

**Grupo yomi**:
Un kanji señalizador junto a los kanji en cuyo dibujo se reconoce esa misma forma y que comparten su lectura on. Hoy el repositorio solo recoge lecturas on, de modo que todo grupo yomi es de hecho un grupo de on-yomi.
_Evitar_: grupo-on, grupo fonético, onyomi

**Señalizador**:
El kanji que señala un grupo yomi y que la web muestra como la cabecera del grupo. Los miembros se agrupan en torno a él por compartir su lectura.
_Evitar_: indicador, cabeza de grupo, representante

**Lectura**:
La lectura on que comparten los integrantes de un grupo yomi y su señalizador.
_Evitar_: pronunciación, katakana

**Tipo de grupo yomi**:
El grado de homogeneidad de la lectura de un grupo, con valores admitidos `puro`, `semi-puro` y `mixto`.
_Evitar_: clase, nivel

**Especial**:
Un kanji que un grupo yomi admite por excepción, al no seguir la forma del señalizador. El campo existe en los 88 grupos y está vacío en todos.
_Evitar_: invitado, miembro excepcional

**Ejemplo**:
Una palabra de muestra de un grupo yomi, acompañada de su significado, su lectura y su máscara.
_Evitar_: muestra, ilustración, oración

**Máscara**:
La pauta que reparte la lectura de un ejemplo entre los kanji de la palabra. Cada `-` consume el siguiente kana de la lectura y lo atribuye al kanji en curso; cada `.` cierra ese kanji y pasa al siguiente. De ahí que lleve tantos guiones como caracteres de lectura y un punto menos que caracteres de palabra.
_Evitar_: patrón, codificación, huella, plantilla

**Itinerario yomi**:
Una lista ordenada de kanji señalizador de grupos yomi. **No es un Itinerario**: ordena kanji, no grupos.
_Evitar_: itinerario de yomi, ruta de lectura

### Marcado de los textos

**Referencia**:
Lo que va entre paréntesis dentro de una historia: nombra el kanji o componente del que se está hablando y la web lo muestra como enlace a su ficha. El paréntesis debe llevar dentro al carácter; un paréntesis vacío no se interpreta.
_Evitar_: cita, enlace, hipervínculo

**Resaltado**:
Lo que va entre asteriscos en una historia o en un nombre de grupo: la web lo muestra en negrita. En las historias se fuerza además a minúsculas.
_Evitar_: negrita suelta, énfasis libre, formato suelto

**Clave marcada**:
Lo que va entre guiones bajos en un nombre de grupo: es la palabra clave en castellano de la que arranca la frase, mostrada en cursiva. Solo el nombre de grupo la admite; dentro de una historia no se interpreta.
_Evitar_: subrayado, cursiva libre, formato suelto

### Agrupaciones y personas

**Auxiliar**:
Un kanji añadido a un grupo por una razón concreta que se declara junto a él, distinto de los integrantes principales. Cuenta igual que un integrante a la hora de comprobar que un kanji no pertenece a dos grupos.
_Evitar_: secundario, soporte, invitado

**Colaborador**:
Una persona que contribuye al repositorio, con sus roles y su avatar.
_Evitar_: miembro, autor, usuario

### Contenido derivado

**Pista**:
Un texto breve que se muestra para recordar un kanji o un componente sin revelar su clave.
_Evitar_: hint, ayuda, pista visual

**Perfil**:
Una variante de la historia de un kanji destinada a un enfoque concreto. Cada perfil publica el mismo kanji con otra historia, junto al nombre del perfil.
_Evitar_: versión, edición, variante libre

**Publicación**:
El proceso que reúne todos los ficheros de la base de conocimiento en un único artefacto JSON destinado a la web.
_Evitar_: exportación, compilación, volcado

**Registro publicado**:
Cada entrada del artefacto publicado, que añade a sus campos de origen una etiqueta de tipo `kanji.eoi/...` y una versión `v1`.
_Evitar_: objeto, entrada suelta, JSON
