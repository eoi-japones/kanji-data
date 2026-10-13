# Una forma escrita ocupa una sola fila del lexicon

El ADR 0007 fija «una fila por entrada» de JMdict. Como JMdict trae una misma forma escrita en entradas distintas —una por lectura—, una palabra como 無口 (むくち y むこう) o 目下 (めした y もっか) producía dos filas con la misma `palabra` y lecturas distintas. El campo de idioma se conserva por `palabra`, así que el texto redactado se copiaba a las dos filas: el lexicon salía duplicado y el `--check` lo marcaba como deriva. La regla pasa a ser **una fila por forma escrita**, y de las lecturas elegibles se queda la de uso más frecuente.

## Estado

**aceptado**

## Decisión

- **Clave del lexicon**: la forma escrita (`palabra`), no la entrada de JMdict. Una forma con dos lecturas elegibles ocupa **una** fila.
- **Lectura ganadora**: la de uso más frecuente, con el mismo criterio que ordena `palabras` en el ADR 0007 —primero lo marcado como común en JMdict, después el rango `nfXX` de menor a mayor—.
- **Desempate**: a igual frecuencia gana la lectura menor por orden de puntos de código. El criterio es arbitrario, pero fija y reproducible: la generación ha de ser determinista de principio a fin.
- **Las lecturas descartadas no aparecen** en la lista de trabajo: no son un pendiente de redactar, son una variante que el diccionario admite y el lexicon no recoge.

## Opciones consideradas

- **Mantener una fila por entrada**: descartada. Requiere que la redacción se haga por `palabra` + `lectura`, duplica el trabajo y publica lecturas marginales (むこう, イー, ダース) en lexicones de kanji básico.
- **Excepción curada por cada forma duplicada**: descartada. En el universo de kanji-data son 319 formas; cada regeneración las traería de nuevo y el curado no escala.
- **Filtrar por umbral de frecuencia**: descartado. El ADR 0007 lo excluye expresamente y haría desaparecer familias enteras.

## Consecuencias

- El motor de kanji-api (ADR 0006 de ese repositorio) descarta las lecturas perdedoras antes de repartir la palabra entre familias; `--check` las excluye igual, así que ambos modos miden lo mismo.
- `DEFINICIONES.md` §6 añade el límite a sus **Límites**, y `lexicon/lexicon/RULES.md` §7 la regla de contenido que lo refleja. No cambia `lexicon.schema.json`: la estructura del fichero es la misma.
- El validador `.github/validar-lexicones.js` no necesita código nuevo: la §5.4 ya prohíbe repetir `palabra` dentro de un lexicon, y esta decisión quita de la raíz la única forma legítima de repetirla.
- La lista de trabajo baja de 13.854 a 13.454 formas en el universo de los grupos básicos: 400 lecturas menos que redactar.
