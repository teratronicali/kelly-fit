export const FRASES_MOTIVACION = [
  'Tu cuerpo creó una vida. Ahora lo estás reconstruyendo con la misma fuerza. 💪',
  'No estás "volviendo" a tu cuerpo de antes — estás construyendo una versión más fuerte de ti. 🌸',
  'Cada repetición es un acto de amor propio. Sigue así, mamá. 🩷',
  'El progreso postparto no es lineal, y eso está bien. Hoy es solo un día más sumando. ✨',
  'Eres más fuerte de lo que ayer creías posible. Demuéstratelo hoy. 🔥',
  'Pequeños hábitos, todos los días, construyen grandes cambios. Vas muy bien. 🌷',
  'Date gracia. Estás criando y entrenando — eso ya es admirable. 💗',
  'No compares tu capítulo 3 con el capítulo 20 de alguien más. Tu ritmo es válido. 🌼',
  'Hidrátate, descansa, y celebra cada pequeño logro de hoy. Lo mereces. 💧',
  'La constancia le gana a la perfección. Aparecer hoy ya es una victoria. 🏆',
]

export interface Tip {
  categoria: string
  titulo: string
  texto: string
}

export const TIPS: Tip[] = [
  {
    categoria: 'Postparto',
    titulo: 'Escucha a tu cuerpo',
    texto: 'El piso pélvico y el core necesitan reconstruirse con paciencia. Si sientes presión, dolor o pérdidas de orina al entrenar, baja la intensidad y consulta con un especialista en suelo pélvico.',
  },
  {
    categoria: 'Nutrición',
    titulo: 'Proteína primero',
    texto: 'Prioriza una fuente de proteína en cada comida (pollo, huevo, pescado, lácteos, legumbres). Te ayuda a recuperar tejido muscular y a sentirte satisfecha por más tiempo.',
  },
  {
    categoria: 'Descanso',
    titulo: 'El sueño también es entrenamiento',
    texto: 'Sabemos que dormir con un bebé es todo un reto, pero cada siesta cuenta. El descanso es cuando tu cuerpo realmente repara y construye músculo.',
  },
  {
    categoria: 'Mentalidad',
    titulo: 'Mídete por consistencia, no por la báscula',
    texto: 'Tu peso fluctúa por hormonas, lactancia, agua y muchas variables. Mejor celebra: ¿entrenaste esta semana? ¿comiste mejor que la pasada? Eso sí está bajo tu control.',
  },
  {
    categoria: 'Hidratación',
    titulo: 'Agua, tu mejor aliada',
    texto: 'Si estás en lactancia tus necesidades de líquidos aumentan. Ten siempre una botella cerca, sobre todo durante y después de entrenar.',
  },
  {
    categoria: 'Energía',
    titulo: 'Carbohidratos no son el enemigo',
    texto: 'Necesitas energía para entrenar y para cuidar a tu bebé. Frutas, avena, arroz y tubérculos te dan el combustible que tu cuerpo está pidiendo ahora mismo.',
  },
  {
    categoria: 'Movimiento',
    titulo: 'Activa tu core de adentro hacia afuera',
    texto: 'Antes de cargar peso, practica respiración diafragmática y ejercicios como Dead Bug o Bird Dog: reconectan tu core profundo después del embarazo.',
  },
  {
    categoria: 'Mentalidad',
    titulo: 'Celebra las victorias chiquitas',
    texto: '¿Lograste salir a entrenar hoy aunque dormiste poco? ¿Elegiste una opción más nutritiva? Eso también cuenta — y mucho.',
  },
]

export const GRUPOS_ALIMENTO_RAPIDO = [
  { nombre: 'Pechuga de pollo (100g)', kcal: 165, proteina: 31, grasa: 3.6, carbohidrato: 0 },
  { nombre: 'Huevo entero (1 unidad)', kcal: 78, proteina: 6.3, grasa: 5.3, carbohidrato: 0.6 },
  { nombre: 'Arroz blanco cocido (100g)', kcal: 130, proteina: 2.7, grasa: 0.3, carbohidrato: 28 },
  { nombre: 'Avena en hojuelas (40g)', kcal: 150, proteina: 5.3, grasa: 2.7, carbohidrato: 27 },
  { nombre: 'Plátano (1 unidad mediana)', kcal: 105, proteina: 1.3, grasa: 0.4, carbohidrato: 27 },
  { nombre: 'Yogur griego natural (170g)', kcal: 100, proteina: 17, grasa: 0.7, carbohidrato: 6 },
  { nombre: 'Aguacate (100g)', kcal: 160, proteina: 2, grasa: 15, carbohidrato: 9 },
  { nombre: 'Almendras (30g)', kcal: 174, proteina: 6.4, grasa: 15, carbohidrato: 6.5 },
  { nombre: 'Atún en agua (100g)', kcal: 116, proteina: 26, grasa: 1, carbohidrato: 0 },
  { nombre: 'Pan integral (1 rebanada)', kcal: 80, proteina: 4, grasa: 1, carbohidrato: 14 },
]
