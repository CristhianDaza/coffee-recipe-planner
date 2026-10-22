import type { EspressoDrinkId, MethodId } from "./coffee";

export const RECIPE_REVIEW_DATE = "2026-10-22";
export const RECIPE_SOURCES = {
  hario: { title: "Hario · guía V60", url: "https://www.hario.co.uk/pages/brew-guides-v60-expert" },
  chemex: { title: "CHEMEX · técnica y filtro", url: "https://chemexcoffeemaker.com/pages/classic-series-product-support" },
  chemexRatio: { title: "Stumptown · receta Chemex", url: "https://www.stumptowncoffee.com/pages/brew-guide-chemex" },
  aero: { title: "AeroPress · instrucciones del fabricante", url: "https://aeropress.com/pages/how-to-use" },
  french: { title: "Stumptown · prensa francesa", url: "https://www.stumptowncoffee.com/pages/brew-guide-french-press" },
  kalita: { title: "Kalita USA · receta de referencia", url: "https://kalitausa.com/blogs/news/brew-like-a-pro-the-kalita-pour-over-method-for-exceptional-coffee" },
  clever: { title: "Subtext · guía Clever Dripper", url: "https://www.subtext.coffee/pages/clever-dripper-brew-guide" },
  sca: { title: "SCA · proporción y medición del espresso", url: "https://sca.coffee/sca-news/25-magazine/issue-3/defining-ever-changing-espresso-25-magazine-issue-3-zyx36" },
  ratios: { title: "La Marzocco · ratios de extracción", url: "https://www.lamarzocco.com/es/es/usando-ratios-de-extraccion/" },
  latte: { title: "Breville · latte", url: "https://www.breville.com/us/en/coffee-journey/recipes/latte.html" },
  cappuccino: { title: "Breville · cappuccino", url: "https://www.breville.com/us/en/coffee-journey/recipes/cappuccino.html" },
  flatwhite: { title: "Breville · flat white", url: "https://www.breville.com/us/en/coffee-journey/recipes/flat-white.html" },
  cortado: { title: "Breville · cortado", url: "https://www.breville.com/inspiration/en-us/recipes/coffee-espresso/essential-cortado" },
  macchiato: { title: "Breville · macchiato", url: "https://www.breville.com/us/en/coffee-journey/recipes/macchiato.html" },
  mocha: { title: "Breville · mocha", url: "https://www.breville.com/us/en/coffee-journey/recipes/mocha.html" },
  longblack: { title: "Breville · long black y americano", url: "https://www.breville.com/us/en/coffee-journey/recipes/long-black.html" },
  piccolo: { title: "Breville · piccolo", url: "https://www.breville.com/us/en/coffee-journey/recipes/piccolo.html" },
  icedlatte: { title: "Breville · latte frío", url: "https://www.breville.com/us/en/coffee-journey/recipes/iced-latte.html" },
  affogato: { title: "Breville · affogato", url: "https://www.breville.com/us/en/coffee-journey/recipes/affogato.html" },
} as const;

export type RecipeSourceId = keyof typeof RECIPE_SOURCES;
export type RecipeEvidence = { sourceIds: RecipeSourceId[]; note: string };

export const BREW_EVIDENCE: Record<MethodId, RecipeEvidence> = {
  v60: { sourceIds: ["hario"], note: "Hario propone 15 g y 250 g de agua, 92–96 °C y unos 2:30 min. Aquí usamos una base práctica 1:16 y un margen de drenaje; los perfiles son adaptaciones." },
  chemex: { sourceIds: ["chemex", "chemexRatio"], note: "La colocación del filtro sigue a CHEMEX. La base 1:16 y los vertidos se adaptan de Stumptown (42 g / 700 g, alrededor de 4 min). El tiempo cambia con el lote y el filtro." },
  aero: { sourceIds: ["aero"], note: "La posición normal, presión suave y referencia de 85 °C siguen al fabricante. Proporciones, reposos y límite de 240 g en la cámara son adaptaciones: el agua restante se añade a la taza, no a la cámara." },
  french: { sourceIds: ["french"], note: "Adaptada de Stumptown: molienda gruesa, agua en dos etapas e infusión hasta 4:00. El tiempo total de 4:30 añade unos 30 s para presionar y servir." },
  kalita: { sourceIds: ["kalita"], note: "Base del fabricante: 20 g de café, 320 g de agua, preinfusión de 60 g y 30–45 s. La distribución de pulsos y los perfiles de sabor son adaptaciones para Wave 185." },
  clever: { sourceIds: ["clever"], note: "Base de Subtext: 16 g / 240 g, agua primero, remover a 1:30, abrir a 2:00 y drenar 60–90 s. Se usa el modelo grande con filtro n.º 4; la temperatura y los perfiles son adaptaciones." },
};

export const ESPRESSO_EVIDENCE: Record<EspressoDrinkId, RecipeEvidence> = {
  espresso: { sourceIds: ["sca", "ratios"], note: "1:2 y 25–30 s son un punto de partida observado por la SCA, no una receta universal. Ristretto 1:1.5 y lungo 1:3 son referencias de estilo; calibra molienda y rendimiento según el café." },
  americano: { sourceIds: ["sca", "longblack"], note: "Esta versión diluye el espresso con agua añadida después. La cantidad de agua es una adaptación ajustable; el orden y la concentración distinguen esta base del long black." },
  longblack: { sourceIds: ["sca", "longblack"], note: "Agua primero y espresso después. Se eligen dos partes de agua como base práctica; la guía de Breville contempla distintas diluciones." },
  cappuccino: { sourceIds: ["sca", "cappuccino"], note: "La técnica de microespuma y temperatura sigue a Breville. La cantidad de leche y altura de espuma son referencias de esta aplicación, no una fórmula obligatoria de tercios." },
  latte: { sourceIds: ["sca", "latte"], note: "Técnica de leche y vertido basada en Breville. La cantidad de leche medida en frío es una base doméstica adaptada y escala con la dosis." },
  flatwhite: { sourceIds: ["sca", "flatwhite"], note: "Se prioriza una capa muy fina de microespuma. La dosis y cantidad de leche son una adaptación de estilo; existen variaciones regionales." },
  cortado: { sourceIds: ["sca", "cortado"], note: "Busca volúmenes similares al servir. La cantidad calculada de leche es orientativa: gramos de espresso y mililitros no son equivalentes exactos por la crema." },
  macchiato: { sourceIds: ["sca", "macchiato"], note: "Se distinguen la pequeña cantidad a servir y la leche necesaria para trabajar en la jarra. La guía de Breville prepara 100 ml y sirve solo una pequeña porción de microespuma." },
  mocha: { sourceIds: ["sca", "mocha"], note: "La técnica combina chocolate, espresso y leche. Aquí se adapta a salsa de chocolate pesada en gramos; la cantidad y el tipo de chocolate no reproducen literalmente la receta de Breville." },
  piccolo: { sourceIds: ["ratios", "piccolo"], note: "Inspirado en el formato pequeño de Breville. La base de 9 g, ristretto 1:1.5 y 60 ml de leche es una adaptación; requiere canasta individual adecuada." },
  icedlatte: { sourceIds: ["sca", "icedlatte"], note: "Breville combina leche fría, hielo y espresso sin texturizar. Los gramos de hielo y mililitros de leche son cantidades adaptadas y escalables." },
  affogato: { sourceIds: ["sca", "affogato"], note: "Espresso caliente sobre helado de vainilla, servido al momento. Se adopta 60 g de helado como referencia pesable; el peso de una bola depende del helado." },
};
