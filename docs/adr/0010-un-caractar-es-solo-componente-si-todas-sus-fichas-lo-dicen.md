# Un carácter es solo componente si todas sus fichas lo declaran así

Un mismo carácter puede tener **dos fichas** en `data/`: la del kanji y la del componente. `冊` es el caso que destapó el problema: `data/冊,Tomo.yml` lo trae como kanji real —el contador «un tomo, un volumen», `solo_componente: 0`— y `data/componentes/冊,bloc_de_notas.yml` como componente —el bloc de notas, `solo_componente: 1`—. El bundle de la app conserva las dos fichas, pero el validador de CI metía todas en un único `kanjisPorId[id]` con la última ficha que pasara, así que ganaba la del componente y rechazaba `lexicon/lexicon/冊.yaml` con «"冊" es un solo componente, no existe en la lengua y no puede tener lexicon», mientras que el motor de kanji-api —que sí distingue las dos fichas— le daba familia (一冊, 別冊, 小冊子) y lo generaba. El CI y la generación decían, por tanto, dos cosas distintas sobre el mismo carácter. El mismo cruce existe hoy en `𠂢`.

## Estado

**aceptado**

## Decisión

- **`solo_componente` es una propiedad del carácter, no de la ficha.** Un carácter es solo componente **si todas sus fichas** lo declaran así.
- **Basta una ficha de kanji real** (`solo_componente: 0`) para que el carácter exista en la lengua y pueda tener lexicon.
- El resultado **no depende del orden del recorrido** de `data/` y `data/componentes/`: el validador conserva la ficha del kanji real cuando ya había una para ese `id`.
- La regla se aplica solo al cómputo de lexicones; cada ficha sigue teniendo su `clave` única y su propia historia.

## Opciones consideradas

- **Mantener la última ficha que pase** (lo que había): descartada. El resultado depende del orden del recorrido, y ese orden ya ha cambiado una vez: el CI rechazaba un lexicon que el motor escribía a la vez.
- **Cambiar el `id` de la ficha componente**: descartada. `lexicon/lexicon/RULES.md` §2 fija que el `id` es el carácter, no la clave; un mismo carácter tiene una sola identidad aunque se estudie bajo dos claves.
- **Tratar `冊` y `𠂢` como solo componente en el motor**: descartada. Contradice `data/冊,Tomo.yml` y `data/𠂢,ramificar.yml` y destruye un lexicon legítimo: la lengua usa 冊 como contador (一冊, 別冊, 小冊子).

## Consecuencias

- `lexicon/lexicon/冊.yaml` vuelve a ser válido: sus cuatro filas (一冊, 冊子, 別冊, 小冊子) se publican. `𠂢` queda cubierto por la misma regla el día que pida lexicon.
- El motor de lexicones de kanji-api (ADR 0006 de ese repositorio) y el validador de este repo vuelven a decir lo mismo sobre el mismo carácter, que era el verdadero problema.
- `DEFINICIONES.md` §2 añade el límite a su **Solo Componente**; `彡`, cuyas dos fichas declaran `solo_componente: 1`, no cambia de resultado.
- No cambia `schemas/kanji.schema.json`: la estructura de cada fichero es la misma; cambia solo cómo se resuelve el cruce entre dos fichas de un mismo carácter.
