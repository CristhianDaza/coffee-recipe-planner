export const METHODS = [
  { id: "v60", name: "V60", subtitle: "Limpio y brillante", icon: "V" },
  { id: "chemex", name: "Chemex", subtitle: "Suave y delicado", icon: "◇" },
  { id: "aero", name: "AeroPress", subtitle: "Dulce y versátil", icon: "A" },
  { id: "french", name: "Prensa", subtitle: "Cuerpo intenso", icon: "P" },
  { id: "kalita", name: "Kalita Wave", subtitle: "Filtrado uniforme", icon: "K" },
  { id: "clever", name: "Clever Dripper", subtitle: "Inmersión y claridad", icon: "C" },
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

// References and the distinction between published recipes and adaptations live in recipe-sources.ts.
export const RECIPES: Record<MethodId, Record<Flavor, RecipeProfile>> = {
  v60: {
    Equilibrada: { ratio: 16, temp: 94, grind: "Medio-fina", minTime: 150, maxTime: 210, description: "Punto de partida para un filtrado claro y aromático." },
    "Más dulce": { ratio: 17, temp: 94, grind: "Medio-fina", minTime: 150, maxTime: 210, description: "Menor concentración para explorar el dulzor de tu café; ajusta según el sabor." },
    "Más intensa": { ratio: 14, temp: 94, grind: "Medio-fina", minTime: 150, maxTime: 210, description: "Menos agua por gramo de café para una taza más concentrada." },
  },
  chemex: {
    Equilibrada: { ratio: 16, temp: 94, grind: "Medio-gruesa", minTime: 210, maxTime: 300, description: "Filtrado limpio con molienda que permite un drenaje fluido." },
    "Más dulce": { ratio: 17, temp: 94, grind: "Medio-gruesa", minTime: 210, maxTime: 300, description: "Una dilución más ligera para explorar notas delicadas, sin cerrar la molienda." },
    "Más intensa": { ratio: 14, temp: 94, grind: "Medio-gruesa", minTime: 210, maxTime: 300, description: "Mayor concentración conservando una molienda apropiada para el filtro grueso." },
  },
  aero: {
    Equilibrada: { ratio: 15, temp: 85, grind: "Medio-fina", minTime: 95, maxTime: 110, description: "Inmersión breve en posición normal y presión suave, con dilución si hace falta." },
    "Más dulce": { ratio: 16, temp: 90, grind: "Medio-fina", minTime: 125, maxTime: 140, description: "Variante de mayor contacto para explorar el sabor; el dulzor depende del café." },
    "Más intensa": { ratio: 12, temp: 85, grind: "Medio-fina", minTime: 95, maxTime: 110, description: "Una taza más concentrada, sin aumentar la fuerza sobre el émbolo." },
  },
  french: {
    Equilibrada: { ratio: 15, temp: 94, grind: "Gruesa", minTime: 270, maxTime: 270, description: "Cuatro minutos de infusión y unos treinta segundos para bajar el émbolo y servir." },
    "Más dulce": { ratio: 16, temp: 94, grind: "Gruesa", minTime: 270, maxTime: 270, description: "Más agua para una taza menos concentrada; conserva la infusión de cuatro minutos." },
    "Más intensa": { ratio: 13, temp: 94, grind: "Gruesa", minTime: 270, maxTime: 270, description: "Más cuerpo por proporción, sin alargar innecesariamente la infusión." },
  },
  kalita: {
    Equilibrada: { ratio: 16, temp: 94, grind: "Medio-gruesa", minTime: 150, maxTime: 180, description: "Base de 20 g y 320 g de agua, con preinfusión y vertidos por pulsos." },
    "Más dulce": { ratio: 17, temp: 94, grind: "Medio-gruesa", minTime: 150, maxTime: 180, description: "Un filtrado algo más ligero para explorar notas dulces y claridad." },
    "Más intensa": { ratio: 14, temp: 94, grind: "Medio-gruesa", minTime: 150, maxTime: 180, description: "Variante más concentrada de la base, manteniendo el lecho plano." },
  },
  clever: {
    Equilibrada: { ratio: 15, temp: 96, grind: "Medio-fina", minTime: 180, maxTime: 210, description: "Agua primero, dos minutos de inmersión y drenaje de uno a un minuto y medio." },
    "Más dulce": { ratio: 16, temp: 96, grind: "Medio-fina", minTime: 180, maxTime: 210, description: "Una taza menos concentrada, manteniendo la técnica de agua primero." },
    "Más intensa": { ratio: 13, temp: 96, grind: "Medio-fina", minTime: 180, maxTime: 210, description: "Más concentración con la misma infusión y filtración por gravedad." },
  },
};

// New brewers have explicit dose limits. Existing methods retain their saved-recipe range.
export function getMaxDose(methodId: MethodId) {
  return methodId === "aero" ? 20 : methodId === "clever" ? 25 : methodId === "kalita" ? 30 : 60;
}

export function getDoseOptions(methodId: MethodId) {
  return methodId === "aero" ? [15, 18, 20] : methodId === "clever" ? [15, 20, 25] : [15, 20, 30];
}

export const GRIND_LEVELS = [
  { name: "Fina", reference: "Similar a sal fina", size: 4, count: 24 },
  { name: "Medio-fina", reference: "Similar a azúcar", size: 6, count: 20 },
  { name: "Media", reference: "Similar a arena seca", size: 8, count: 16 },
  { name: "Medio-gruesa", reference: "Similar a sal marina", size: 11, count: 12 },
  { name: "Gruesa", reference: "Similar a sal gruesa", size: 14, count: 9 },
] as const;

export type ShotStyleId = "ristretto" | "espresso" | "lungo";
export type EspressoDrinkId = "espresso" | "americano" | "cappuccino" | "latte" | "flatwhite" | "cortado" | "macchiato" | "mocha" | "longblack" | "piccolo" | "icedlatte" | "affogato";
export type EspressoDrink = {
  id: EspressoDrinkId;
  name: string;
  subtitle: string;
  milk: number;
  water: number;
  chocolate: number;
  ice: number;
  iceCream: number;
  milkMode: "none" | "steamed" | "foam" | "cold";
  extra: string;
  defaultDose: number;
  defaultShot: ShotStyleId;
};

const drinkDefaults = { milk: 0, water: 0, chocolate: 0, ice: 0, iceCream: 0, milkMode: "none" as const, extra: "", defaultDose: 18, defaultShot: "espresso" as const };

// Added ingredients are reference quantities for an 18 g dose, not universal drink standards.
export const ESPRESSO_DRINKS: readonly EspressoDrink[] = [
  { ...drinkDefaults, id: "espresso", name: "Espresso", subtitle: "Puro y concentrado" },
  { ...drinkDefaults, id: "americano", name: "Americano", subtitle: "Espresso, después agua", water: 110 },
  { ...drinkDefaults, id: "cappuccino", name: "Cappuccino", subtitle: "Sedoso y equilibrado", milk: 120, milkMode: "steamed", extra: "Microespuma de unos 1–2 cm" },
  { ...drinkDefaults, id: "latte", name: "Latte", subtitle: "Suave y lechoso", milk: 180, milkMode: "steamed", extra: "Capa fina de microespuma" },
  { ...drinkDefaults, id: "flatwhite", name: "Flat white", subtitle: "Café presente y sedoso", milk: 100, milkMode: "steamed", extra: "Microespuma muy fina" },
  { ...drinkDefaults, id: "cortado", name: "Cortado", subtitle: "Café y leche en equilibrio", milkMode: "steamed", extra: "Aproxima volúmenes iguales al servir" },
  { ...drinkDefaults, id: "macchiato", name: "Macchiato", subtitle: "Marcado con microespuma", milk: 10, milkMode: "foam", extra: "Una pequeña porción de microespuma" },
  { ...drinkDefaults, id: "mocha", name: "Mocha", subtitle: "Chocolate y café", milk: 150, chocolate: 20, milkMode: "steamed", extra: "Salsa de chocolate; ajusta al gusto" },
  { ...drinkDefaults, id: "longblack", name: "Long black", subtitle: "Agua, después espresso", water: 72 },
  { ...drinkDefaults, id: "piccolo", name: "Piccolo", subtitle: "Pequeño e intenso", milk: 120, milkMode: "steamed", extra: "Microespuma fina", defaultDose: 9, defaultShot: "ristretto" },
  { ...drinkDefaults, id: "icedlatte", name: "Latte frío", subtitle: "Leche fría y hielo", milk: 150, ice: 100, milkMode: "cold" },
  { ...drinkDefaults, id: "affogato", name: "Affogato", subtitle: "Espresso y helado", iceCream: 60, extra: "Helado de vainilla, aprox. una bola" },
];

export const SHOT_STYLES = [
  { id: "ristretto", name: "Ristretto", ratio: 1.5, time: "25–30 s", description: "Corto y concentrado" },
  { id: "espresso", name: "Espresso", ratio: 2, time: "25–30 s", description: "Balance clásico" },
  { id: "lungo", name: "Lungo", ratio: 3, time: "25–35 s", description: "Más largo y ligero" },
] as const;

export type ShotStyle = (typeof SHOT_STYLES)[number];
