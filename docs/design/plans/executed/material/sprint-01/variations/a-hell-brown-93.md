# Variation A — "Hell-Brown '93"

**Sesgo estético**: fidelidad reverente al DOOM original de id Software (1993). La versión "si cerrás los ojos y pensás DOOM".

## Paleta

```
Techbase brown   #6b4a2b  #4a3220  #2a1d12   (paredes, paneles UAC)
Blood            #a01010  #d22020  #ff3a1a   (sangre, lava, acentos)
Toxic green      #2f6e16  #6abe30            (nukage, viales, ARMS activa)
Bone / UI tan    #d8c8a0  #b8a070            (números HUD, hueso)
Near-black       #0a0806                     (penumbra, sombras duras)
```

Dominante cálida y sucia. Marrón = 50% del campo visual, rojo como puntería emocional, verde tóxico como chispa de peligro.

## Tipografía

Slab roja pesada, todo mayúsculas, **sombra dura negra 1px** abajo-derecha, cero anti-alias. Bitmap propia generada proceduralmente (no webfont). Números del HUD enormes, estilo display de 7 segmentos engrosado.

## Composición

Status bar **full-width, densa, panel de metal marrón con bordes biselados** (el STBAR clásico). Viewport con penumbra sectorizada: zonas oscuras y zonas iluminadas marcadas. Bisel hundido alrededor del viewport como un gabinete.

## Motion vocabulary

Pesado y mínimo. Weapon bob sinusoidal al caminar. Parpadeo de luces (flicker de sector). La cara cicla idle cada ~2s. Sin easing "suave moderno" — todo es step o lineal, mecánico.

## Motifs

Paneles UAC con tornillos · cables expuestos · **corrupción infernal** (carne, sangre, pentagramas) filtrándose en lo tecnológico · antorchas rojas · calaveras · nukage verde burbujeante.

## style_vector

`warm · filthy · reverent · dense · mechanical · 1993`

## Por qué elegirla

Es la apuesta segura de mayor reconocimiento. El jugador la lee como DOOM en 0 frames. Riesgo: es la que más se acerca a lo que un buen one-shot intentaría — ganamos por *ejecución* (audio, cara, correctness), no por audacia visual.
