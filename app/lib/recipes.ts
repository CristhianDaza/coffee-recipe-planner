import { RECIPES, type EspressoDrinkId, type Flavor, type MethodId } from "@/app/data/coffee";

export type PreparationStep = {
  time: string;
  title: string;
  text: string;
};

export type EspressoStep = Omit<PreparationStep, "time">;

export function getProfile(methodId: MethodId, flavor: Flavor) {
  return RECIPES[methodId][flavor];
}

export function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function formatTimeRange(min: number, max: number) {
  const first = formatClock(min);
  return min === max ? first : `${first}–${formatClock(max)}`;
}

export function parseStepTime(value: string) {
  if (value === "ANTES") return null;
  const [minutes, seconds] = value.split(":").map(Number);
  return minutes * 60 + seconds;
}

export function buildSteps(
  methodId: MethodId,
  flavor: Flavor,
  coffee: number,
  water: number,
): PreparationStep[] {
  const sweet = flavor === "Más dulce";
  const intense = flavor === "Más intensa";

  if (methodId === "aero") {
    const wait = sweet ? 60 : intense ? 40 : 45;
    return [
      { time: "ANTES", title: "Prepara el equipo", text: "Enjuaga el filtro, ensambla la AeroPress sobre una taza resistente y añade el café nivelado." },
      { time: "00:00", title: "Agua y agitación", text: `Añade los ${water} ml de agua y remueve suavemente durante 3 segundos.` },
      { time: "00:05", title: "Inmersión", text: `Inserta el émbolo apenas para crear vacío y espera ${wait} segundos.` },
      { time: formatClock(wait + 5), title: "Presiona", text: "Presiona con fuerza suave y constante durante 25–30 segundos; detente al escuchar el siseo." },
    ];
  }

  if (methodId === "french") {
    const steep = sweet ? 270 : 240;
    return [
      { time: "ANTES", title: "Precalienta", text: "Calienta la prensa con agua, descártala y añade el café de molienda gruesa." },
      { time: "00:00", title: "Vertido completo", text: `Añade los ${water} ml de agua, moja todo el café y remueve suavemente una vez.` },
      { time: "00:15", title: "Infusión", text: `Coloca la tapa sin bajar el émbolo y deja infusionar hasta ${formatClock(steep)}.` },
      { time: formatClock(steep), title: "Baja y sirve", text: "Baja el émbolo lentamente, sin forzarlo, y sirve de inmediato para detener la extracción." },
    ];
  }

  const bloom = Math.round(coffee * (sweet ? 3 : 2.5));

  if (methodId === "chemex") {
    const bloomTime = sweet ? 45 : 40;
    const first = Math.round(water * (sweet ? 0.5 : 0.55));
    return [
      { time: "ANTES", title: "Prepara el filtro", text: "Enjuaga el filtro con agua caliente, precalienta la Chemex y deja el lado de tres capas sobre el pico vertedor." },
      { time: "00:00", title: "Preinfusión", text: `Vierte ${bloom} ml, cubre todo el café y espera ${bloomTime} segundos.` },
      { time: formatClock(bloomTime), title: "Primer vertido", text: `Vierte en círculos lentos hasta ${first} ml, evitando tocar directamente el filtro.` },
      { time: formatClock(bloomTime + 65), title: "Pulsos finales", text: `Completa hasta ${water} ml en dos pulsos, dejando bajar un poco el nivel entre ambos.` },
    ];
  }

  const bloomTime = sweet ? 40 : 30;
  const first = Math.round(water * (sweet ? 0.5 : intense ? 0.65 : 0.6));
  return [
    { time: "ANTES", title: "Prepara el V60", text: "Enjuaga el filtro con agua caliente, precalienta el recipiente y añade el café nivelado." },
    { time: "00:00", title: "Preinfusión", text: `Vierte ${bloom} ml, cubre todo el café y espera ${bloomTime} segundos.` },
    { time: formatClock(bloomTime), title: "Primer vertido", text: `Vierte en círculos controlados hasta alcanzar ${first} ml.` },
      { time: formatClock(bloomTime + 60), title: "Vertido final", text: `Completa hasta ${water} ml con un flujo constante y deja escurrir sin agitar el lecho.` },
  ];
}

export function buildEspressoSteps(
  id: EspressoDrinkId,
  dose: number,
  yieldWeight: number,
  milk: number,
  water: number,
  time: string,
): EspressoStep[] {
  const shot = {
    title: "Extrae el café",
    text: `Distribuye y prensa ${dose} g uniformemente. Obtén ${yieldWeight} g en ${time}.`,
  };

  const recipes: Record<EspressoDrinkId, EspressoStep[]> = {
    espresso: [
      { title: "Precalienta", text: "Calienta y seca la taza antes de comenzar." },
      shot,
      { title: "Sirve", text: "Remueve suavemente la crema y disfruta de inmediato." },
    ],
    americano: [
      { title: "Añade el agua", text: `Sirve ${water} ml de agua caliente, sin llevarla a ebullición, en la taza.` },
      shot,
      { title: "Integra", text: "Vierte el espresso sobre el agua para conservar mejor la crema." },
    ],
    cappuccino: [
      shot,
      { title: "Texturiza la leche", text: `Texturiza ${milk} ml creando microespuma elástica y uniforme.` },
      { title: "Monta la bebida", text: "Integra leche y microespuma, dejando aproximadamente 1 cm de espuma sedosa." },
    ],
    latte: [
      shot,
      { title: "Texturiza la leche", text: `Texturiza ${milk} ml incorporando poco aire para obtener una microespuma fina.` },
      { title: "Vierte", text: "Integra primero la leche y termina con una capa fina de microespuma." },
    ],
    flatwhite: [
      shot,
      { title: "Crea microespuma fina", text: `Texturiza ${milk} ml con muy poco aire: textura brillante y fluida.` },
      { title: "Integra", text: "Vierte desde poca altura para conservar una capa de espuma muy delgada." },
    ],
    cortado: [
      shot,
      { title: "Calienta la leche", text: `Texturiza ${milk} ml con mínima espuma.` },
      { title: "Combina", text: "Añade la leche al espresso en una proporción cercana a 1:1 por volumen." },
    ],
    macchiato: [
      shot,
      { title: "Texturiza una pequeña cantidad", text: `Prepara al menos ${Math.max(30, milk)} ml para poder texturizar correctamente.` },
      { title: "Marca el espresso", text: "Añade solamente una cucharada de espuma sobre el centro del espresso." },
    ],
    mocha: [
      { title: "Prepara el chocolate", text: "Disuelve 20 g de chocolate en la taza caliente." },
      shot,
      { title: "Termina con leche", text: `Mezcla el espresso con el chocolate y añade ${milk} ml de leche texturizada.` },
    ],
  };

  return recipes[id];
}
