export const METHODS = [
  { id: "v60", name: "V60", subtitle: "Limpio y brillante", icon: "V" },
  { id: "chemex", name: "Chemex", subtitle: "Suave y delicado", icon: "◇" },
  { id: "aero", name: "AeroPress", subtitle: "Dulce y versátil", icon: "A" },
  { id: "french", name: "Prensa", subtitle: "Cuerpo intenso", icon: "P" },
] as const;

export const FLAVORS = ["Equilibrada", "Más dulce", "Más intensa"] as const;

export type Method = (typeof METHODS)[number];
export type MethodId = Method["id"];
export type Flavor = (typeof FLAVORS)[number];

export type RecipeProfile = {
  ratio: number;
  temp: number;
  grind: string;
  minTime: number;
  maxTime: number;
  description: string;
};

export const RECIPES: Record<MethodId, Record<Flavor, RecipeProfile>> = {
  v60: {
    Equilibrada: {
      ratio: 15,
      temp: 94,
      grind: "Medio-fina",
      minTime: 150,
      maxTime: 180,
      description: "Una taza clara, aromática y con el balance justo.",
    },
    "Más dulce": {
      ratio: 16,
      temp: 92,
      grind: "Medio-fina",
      minTime: 165,
      maxTime: 195,
      description: "Vertidos pausados para resaltar dulzor y notas delicadas.",
    },
    "Más intensa": {
      ratio: 13,
      temp: 93,
      grind: "Medio-fina",
      minTime: 155,
      maxTime: 185,
      description: "Menos agua para una taza concentrada, sin forzar la extracción.",
    },
  },
  chemex: {
    Equilibrada: {
      ratio: 16,
      temp: 93,
      grind: "Medio-gruesa",
      minTime: 210,
      maxTime: 270,
      description: "Una taza limpia, suave y de gran claridad aromática.",
    },
    "Más dulce": {
      ratio: 17,
      temp: 92,
      grind: "Medio",
      minTime: 230,
      maxTime: 290,
      description: "Mayor contacto y pulsos suaves para destacar el dulzor.",
    },
    "Más intensa": {
      ratio: 14,
      temp: 93,
      grind: "Medio-gruesa",
      minTime: 220,
      maxTime: 280,
      description: "Más concentración, conservando la limpieza del filtro grueso.",
    },
  },
  aero: {
    Equilibrada: {
      ratio: 12,
      temp: 85,
      grind: "Medio-fina",
      minTime: 75,
      maxTime: 105,
      description: "Inmersión corta y presión suave para una taza redonda.",
    },
    "Más dulce": {
      ratio: 13,
      temp: 85,
      grind: "Medio-fina",
      minTime: 90,
      maxTime: 120,
      description: "Un poco más de inmersión para favorecer dulzor y suavidad.",
    },
    "Más intensa": {
      ratio: 10,
      temp: 87,
      grind: "Medio-fina",
      minTime: 75,
      maxTime: 105,
      description: "Concentrada y con cuerpo, sin aplicar presión excesiva.",
    },
  },
  french: {
    Equilibrada: {
      ratio: 15,
      temp: 94,
      grind: "Grueso",
      minTime: 240,
      maxTime: 240,
      description: "Inmersión completa, cuerpo definido y extracción uniforme.",
    },
    "Más dulce": {
      ratio: 16,
      temp: 92,
      grind: "Grueso",
      minTime: 270,
      maxTime: 270,
      description: "Infusión más pausada para una taza redonda y dulce.",
    },
    "Más intensa": {
      ratio: 13,
      temp: 94,
      grind: "Grueso",
      minTime: 240,
      maxTime: 240,
      description: "Más café por agua para ganar cuerpo sin añadir amargor.",
    },
  },
};

export const GRIND_LEVELS = [
  { name: "Fina", reference: "Similar a sal fina", size: 4, count: 24 },
  { name: "Medio-fina", reference: "Similar a azúcar", size: 6, count: 20 },
  { name: "Media", reference: "Similar a arena seca", size: 8, count: 16 },
  { name: "Medio-gruesa", reference: "Similar a sal marina", size: 11, count: 12 },
  { name: "Gruesa", reference: "Similar a sal gruesa", size: 14, count: 9 },
] as const;

export const ESPRESSO_DRINKS = [
  { id: "espresso", name: "Espresso", icon: "E", subtitle: "Puro y concentrado", milk: 0, water: 0, extra: "", cup: "60–90 ml" },
  { id: "americano", name: "Americano", icon: "A", subtitle: "Largo y aromático", milk: 0, water: 110, extra: "", cup: "150–180 ml" },
  { id: "cappuccino", name: "Cappuccino", icon: "C", subtitle: "Sedoso y equilibrado", milk: 120, water: 0, extra: "Microespuma de 1 cm", cup: "150–180 ml" },
  { id: "latte", name: "Latte", icon: "L", subtitle: "Suave y lechoso", milk: 180, water: 0, extra: "Capa fina de microespuma", cup: "220–250 ml" },
  { id: "flatwhite", name: "Flat white", icon: "F", subtitle: "Café presente y sedoso", milk: 120, water: 0, extra: "Microespuma muy fina", cup: "150–180 ml" },
  { id: "cortado", name: "Cortado", icon: "O", subtitle: "Intenso y balanceado", milk: 45, water: 0, extra: "Muy poca espuma", cup: "80–120 ml" },
  { id: "macchiato", name: "Macchiato", icon: "M", subtitle: "Marcado con espuma", milk: 15, water: 0, extra: "Una cucharada de espuma", cup: "60–90 ml" },
  { id: "mocha", name: "Mocha", icon: "◎", subtitle: "Chocolate y café", milk: 150, water: 0, extra: "20 g de chocolate", cup: "200–240 ml" },
] as const;

export type EspressoDrink = (typeof ESPRESSO_DRINKS)[number];
export type EspressoDrinkId = EspressoDrink["id"];

export const SHOT_STYLES = [
  { id: "ristretto", name: "Ristretto", ratio: 1.5, time: "22–28 s", description: "Corto y concentrado" },
  { id: "espresso", name: "Espresso", ratio: 2, time: "25–30 s", description: "Balance clásico" },
  { id: "lungo", name: "Lungo", ratio: 3, time: "28–35 s", description: "Más largo y ligero" },
] as const;

export type ShotStyle = (typeof SHOT_STYLES)[number];
export type ShotStyleId = ShotStyle["id"];
