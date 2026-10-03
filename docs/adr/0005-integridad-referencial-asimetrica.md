# Dos espacios de referencia — `id` y `clave` — con integridad referencial asimétrica

El modelo usa dos formas distintas de apuntar a un kanji y solo una de ellas se comprueba. Los **grupos** referencian kanji por su `id` —el carácter— y sí se validan: `.github/validar-grupos.js` comprueba que cada integrante y cada auxiliar exista, que nadie esté repetido dentro de un grupo y que ningún kanji aparezca en dos grupos. Los **itinerarios** referencian grupos por su `id` y `.github/validar-itinerarios.js` comprueba que cada grupo exista. En cambio, el campo `componentes` de un kanji referencia por `clave` y **no se comprueba en ningún sitio**: el esquema solo exige que sea una lista de textos. Los **itinerarios yomi** tampoco se cruzan con nada: se validan contra su esquema y nadie comprueba que los kanji que ordenan existan.

Tampoco se cruzan los **grupos yomi** (`yomi/on/`), que declaran sus miembros por carácter igual que los grupos: **18 de los 232 integrantes que ordenan no tienen ficha en `data/`** — 燥, 操, 藻, 批, 碑, 餓, 爆, 蓄, 懲, 働, 舞, 促, 閥, 航, 磁, 滋, 巨 y 認 — y la validación pasa igual. Es la misma asimetría que con `componentes`, solo que en el otro extremo del par.

Medido sobre la base actual, el efecto es grande: de los 862 tokens distintos que aparecen en los campos `componentes` de `data/`, solo 250 coinciden exactamente con una clave existente. `data/争,contienda.yml` declara `rastrillo`, mientras la clave real es `*rastrillo`; **140** de los que fallan lo harían solo por una mayúscula — el token `Cuántos` frente a la clave `cuántos`, o el token `montaña` frente a la clave `Montaña` —; tres llevan un espacio de más, como `Carmesí `, que duplica a `Carmesí`; y otros ni siquiera nombran a un kanji, como `Botella de sake`.

## Estado

**propuesto** — hoy describe el comportamiento real, pero la decisión no está documentada ni ratificada y debe aceptarse o revertirse explícitamente.

## Opciones consideradas

- **Validar `componentes` contra las claves, como ya se hace con los grupos**: rechazada de momento porque exige una migración de cientos de ficheros y fija de antemano un formato que la propia base no respeta hoy (faltan los prefijos `*` y `#`, sobran mayúsculas, hay espacios finales y textos que no son claves).
- **Unificar grupos y componentes en un solo espacio de referencia**: descartada. Exigiría reescribir todos los grupos existentes y renombrar el campo `integrantes`, sin que aporte nada al aprendizaje.
- **Dejar `componentes` como texto libre y asumirlo**: es lo que ocurre hoy. Mantiene la edición sencilla, pero la nube de componentes no se puede recorrer de forma fiable ni generar a partir de ella ninguna vista de «¿dónde aparece este componente?».

## Consecuencias

- Cualquier consulta que quiera seguir el grafo kanji → componentes debe tolerar que una referencia no resuelva.
- La regla de unicidad de clave (`DEFINICIONES.md` sección 1, con fuerza suprema según `CONSTITUCION.md` Regla 2.3) solo se aplica a las claves declaradas, no a las citadas.
- Mientras esto siga abierto, añadir validación referencial sobre `componentes` cambiará el coste de toda edición futura: hay que decidirlo antes, no después.
