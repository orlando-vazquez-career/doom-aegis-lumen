# Journey del primer minuto + Audit heurístico del estado del arte

## Journey-as-is — el primer minuto deseado

| t | Momento | Estado emocional | Riesgo de diseño |
|---|---|---|---|
| 0s | Carga el index | Expectativa | Pantalla negra muda = duda. → Title screen inmediato con logo DOOM-idiom. |
| 1-3s | Title screen | "ok, dale" | Demasiado texto. → Logo + "PRESS ANY KEY" + controles mínimos. |
| 3-5s | Pointer lock + spawn | Inmersión | Click-to-lock confuso. → Prompt claro "click para jugar". |
| 5-10s | Primer pasillo, ve un imp | Tensión | Pasillo vacío = anticlímax. → Enemigo a la vista desde el spawn. |
| 10-20s | Primer disparo + kill | **Rush** (momento de la verdad) | Disparo mudo o sin feedback = pierde el job. → Audio + muzzle flash + sangre + reacción del enemigo. |
| 20-60s | Explora, encuentra arma/pickup, abre puerta | Engagement | Sin recompensa de exploración = se va. → Pickup visible, puerta con sonido, escopeta mejor que pistola. |

## Audit heurístico del estado del arte (los 15 del CSV)

No auditamos un producto existente nuestro (no hay) — auditamos **qué falla sistemáticamente el campo**, que es nuestro baseline a superar. Nielsen + lente DOOM:

| Heurística | Falla común en el campo | Nuestra respuesta |
|---|---|---|
| **Match con el mundo real** (el "mundo" = DOOM canónico) | Estética genérica HTML5; no se *lee* como DOOM. | Pilares estéticos committed (Material.0). |
| **Visibilidad del estado del sistema** | HUD plano con números; sin la cara que comunica vida de un vistazo. | Cara reactiva del marine. |
| **Estética y diseño minimalista** (mal aplicado) | Confunden "minimal" con "vacío/genérico". DOOM NO es minimal — es denso, ornamentado, sucio. | Densidad informacional calibrada (Visual DNA axioma 3). |
| **Feedback** | Disparo sin sonido (0/15) ni impacto. | Audio procedural + partículas + reacción de enemigo. |
| **Reconocimiento > recuerdo** | Controles en ningún lado o en un párrafo. | Controles en title + iconografía del HUD. |
| **Flexibilidad/eficiencia** | Solo WASD; sin run, sin strafe consistente. | WASD + strafe + mouse-look + sprint. |

**Conclusión del audit**: el hueco no es técnico (raycasting está resuelto 15/15). El hueco es **de identidad sensorial**. Por eso este sprint es 60% LUMEN, 40% AEGIS en peso de diferenciación.
