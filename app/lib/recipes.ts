import {
  ESPRESSO_DRINKS,
  RECIPES,
  SHOT_STYLES,
  type EspressoDrinkId,
  type Flavor,
  type MethodId,
  type ShotStyleId,
} from "@/app/data/coffee";

export type PreparationStep = { time: string; title: string; text: string };
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
  return min === max ? formatClock(min) : `${formatClock(min)}–${formatClock(max)}`;
}

export function parseStepTime(value: string) {
  if (!/^\d+:[0-5]\d$/.test(value)) return null;
  const [minutes, seconds] = value.split(":").map(Number);
  return minutes * 60 + seconds;
}

export function getBrewWater(methodId: MethodId, totalWater: number) {
  // Conservative working volume for an Original-size AeroPress, leaving room for grounds.
  const brewWater = methodId === "aero" ? Math.min(totalWater, 240) : totalWater;
  return { brewWater, dilutionWater: totalWater - brewWater };
}

export function buildSteps(methodId: MethodId, flavor: Flavor, coffee: number, water: number): PreparationStep[] {
  const profile = getProfile(methodId, flavor);
  const finish = formatClock(profile.minTime);
  const range = formatTimeRange(profile.minTime, profile.maxTime);

  if (methodId === "aero") {
    const { brewWater, dilutionWater } = getBrewWater(methodId, water);
    const pressAt = profile.minTime - 30;
    return [
      { time: "ANTES", title: "Prepara la AeroPress", text: `Usa la posición normal: filtro y tapa bien sujetos, sobre una taza resistente. Añade ${coffee} g de café. Reserva aparte el agua de dilución indicada; no llenes por encima de la capacidad del equipo.` },
      { time: "00:00", title: "Añade el agua de infusión", text: `Añade ${brewWater} g de agua, remueve suavemente unos 3 segundos e inserta el émbolo apenas para frenar el goteo.` },
      { time: "00:05", title: "Deja infusionar", text: `Mantén el equipo estable y espera hasta ${formatClock(pressAt)}. No inviertas la cafetera.` },
      { time: formatClock(pressAt), title: "Presiona suavemente", text: "Apoya la taza sobre una superficie firme. Baja el émbolo lentamente durante unos 30 segundos; si ofrece mucha resistencia, detente y reduce la fuerza." },
      { time: finish, title: "Mezcla y sirve", text: dilutionWater > 0 ? `Cuando acabes de presionar, añade los ${dilutionWater} g de agua reservados a la taza. En total usas ${water} g de agua: ${brewWater} g de infusión y ${dilutionWater} g de dilución. Remueve y sirve.` : "Cuando termine la presión, retira la cafetera y remueve la bebida. Deja enfriar un poco antes de probar." },
    ];
  }

  if (methodId === "french") {
    const first = Math.round(water / 2);
    return [
      { time: "ANTES", title: "Precalienta y pesa", text: `Precalienta la prensa, descarta esa agua y añade ${coffee} g de café grueso. Comprueba que el recipiente admite ${water} g de agua más el café, con espacio libre.` },
      { time: "00:00", title: "Moja todo el café", text: `Añade ${first} g de agua y cubre sin bajar el émbolo.` },
      { time: "01:00", title: "Remueve y completa", text: `Remueve suavemente y añade ${water - first} g más de agua, hasta ${water} g acumulados. Vuelve a tapar sin presionar.` },
      { time: "04:00", title: "Baja el émbolo", text: "Retira la prensa de la báscula. Sostén el asa y baja el émbolo lentamente, sin forzarlo." },
      { time: finish, title: "Sirve toda la bebida", text: "Sirve o decanta el café que quede en la prensa para separarlo de los posos. El tiempo total incluye el descenso del émbolo y el servicio." },
    ];
  }

  if (methodId === "clever") {
    return [
      { time: "ANTES", title: "Prepara el Clever grande", text: "Usa un Clever tamaño grande con filtro n.º 4. Enjuaga el filtro y descarta el agua. Deja el dispositivo fuera de la taza para mantener cerrada la válvula." },
      { time: "00:00", title: "Primero agua, después café", text: `Añade ${water} g de agua y después ${coffee} g de café. Remueve suavemente para mojarlo todo y tapa.` },
      { time: "01:30", title: "Rompe la costra", text: "Da una vuelta suave con una cuchara para que los posos de la superficie se hundan." },
      { time: "02:00", title: "Abre el drenaje", text: "Coloca el Clever sobre una jarra estable y de capacidad suficiente. La válvula se abre al apoyarlo. Deja drenar entre 60 y 90 segundos." },
      { time: finish, title: "Comprueba y sirve", text: `El final orientativo es ${range}. Si todavía queda agua, deja que termine sin presionar el lecho. Retira el dispositivo y mezcla la bebida.` },
    ];
  }

  const bloom = Math.round(coffee * (methodId === "kalita" ? 3 : 2.5));
  const first = Math.round(water * .6);
  if (methodId === "chemex") {
    return [
      { time: "ANTES", title: "Prepara el filtro", text: "Coloca las tres capas del filtro hacia el pico vertedor, conservando libre el canal de aire. Enjuaga con agua caliente y descarta esa agua." },
      { time: "00:00", title: "Preinfusión", text: `Vierte ${bloom} g de agua sobre todo el café y espera 45 segundos.` },
      { time: "00:45", title: "Primer vertido", text: `Añade ${first - bloom} g de agua, hasta ${first} g acumulados. Vierte en círculos, sin llenar hasta el borde.` },
      { time: "01:45", title: "Completa el agua", text: `Añade los ${water - first} g restantes hasta ${water} g acumulados, en pulsos si el nivel sube demasiado.` },
      { time: finish, title: "Comprueba el drenaje", text: `Para dosis habituales, termina alrededor de ${range}. Espera al drenaje, retira el filtro y mezcla antes de servir. Los lotes grandes tardan más; no fuerces el drenaje para cumplir el reloj.` },
    ];
  }

  const kalita = methodId === "kalita";
  return [
    { time: "ANTES", title: kalita ? "Prepara la Kalita Wave" : "Prepara el V60", text: kalita ? "Usa una Wave 185 con su filtro ondulado correspondiente. Enjuaga sin aplastar las ondas y nivela el café sobre el fondo plano." : "Coloca el filtro adecuado, enjuaga con agua caliente, precalienta la jarra y descarta el agua. Añade el café y nivela el lecho." },
    { time: "00:00", title: "Preinfusión", text: `Vierte ${bloom} g de agua y comprueba que todo el café quede mojado. Espera 30 segundos.` },
    { time: "00:30", title: "Primer vertido", text: `Añade ${first - bloom} g en círculos controlados, hasta ${first} g acumulados. Evita verter directamente sobre el papel.` },
    { time: kalita ? "01:15" : "01:30", title: "Vertido final", text: `Añade ${water - first} g más hasta ${water} g acumulados. ${kalita ? "Haz pulsos pequeños, sin desbordar el filtro ni dejar secar por completo el lecho." : "Mantén un flujo suave y deja que el agua atraviese el café."}` },
    { time: finish, title: "Comprueba y sirve", text: `El drenaje orientativo termina entre ${range}. Retira el filtro cuando acabe, mezcla la bebida y prueba. Ajusta la molienda en la siguiente preparación si drena demasiado rápido o lento.` },
  ];
}

export function buildEspressoRecipe(id: EspressoDrinkId, dose: number, shotStyleId: ShotStyleId) {
  const drink = ESPRESSO_DRINKS.find((item) => item.id === id) ?? ESPRESSO_DRINKS[0];
  const shotStyle = SHOT_STYLES.find((item) => item.id === shotStyleId) ?? SHOT_STYLES[1];
  const espressoYield = Math.round(dose * shotStyle.ratio);
  const scale = dose / 18;
  // This is a practical milk reference, not a conversion of espresso grams into millilitres.
  const milk = id === "cortado" ? espressoYield : Math.round(drink.milk * scale);
  const water = id === "longblack" ? espressoYield * 2 : Math.round(drink.water * scale);
  const chocolate = Math.round(drink.chocolate * scale);
  const ice = Math.round(drink.ice * scale);
  const iceCream = Math.round(drink.iceCream * scale);
  const foamFactor = id === "cappuccino" ? 1.3 : drink.milkMode === "steamed" ? 1.15 : 1;
  // Headroom for foam, crema and additions. Vessel capacity is not the beverage's measured volume.
  const cupCapacity = Math.max(60, Math.ceil((espressoYield + water + milk * foamFactor + chocolate + ice + iceCream * 2) * 1.15 / 10) * 10);
  const steps = buildEspressoSteps(id, dose, espressoYield, milk, water, shotStyle.time, chocolate, ice, iceCream);
  return { drink, shotStyle, espressoYield, milk, water, chocolate, ice, iceCream, cupCapacity, steps };
}

export function buildEspressoSteps(
  id: EspressoDrinkId,
  dose: number,
  yieldWeight: number,
  milk: number,
  water: number,
  time: string,
  chocolate = Math.round(20 * dose / 18),
  ice = Math.round(100 * dose / 18),
  iceCream = Math.round(60 * dose / 18),
): EspressoStep[] {
  const shot = {
    title: "Extrae el café",
    text: `Distribuye ${dose} g en una canasta de capacidad adecuada y prensa nivelado. Pesa ${yieldWeight} g de bebida en aproximadamente ${time}, contando desde que activas la bomba. Ajusta por sabor y por las indicaciones del equipo.`,
  };
  const texture = (text: string): EspressoStep => ({ title: "Texturiza la leche", text: `${text} Usa leche fría, purga la lanza y calienta hasta unos 60–65 °C. Limpia y purga la lanza al terminar.` });
  const recipes: Record<EspressoDrinkId, EspressoStep[]> = {
    espresso: [
      { title: "Precalienta", text: "Calienta el grupo, el portafiltro y la taza; seca la canasta antes de dosificar." },
      shot,
      { title: "Mezcla y prueba", text: "Remueve suavemente y prueba cuando haya bajado un poco la temperatura. El rendimiento objetivo manda; el tiempo sirve para calibrar." },
    ],
    americano: [shot,
      { title: "Añade el agua", text: `Vierte ${water} ml de agua caliente sobre el espresso ya preparado; ajusta la dilución si lo prefieres más suave.` },
      { title: "Integra", text: "Mezcla suavemente. En esta versión se añade el agua después del café; en el long black se invierte el orden." },
    ],
    longblack: [
      { title: "Agua primero", text: `Sirve ${water} ml de agua caliente en una taza de capacidad suficiente.` }, shot,
      { title: "Café sobre el agua", text: "Vierte el espresso suavemente sobre el agua. La dilución de dos partes de agua es una referencia ajustable al gusto." },
    ],
    cappuccino: [shot, texture(`Prepara ${milk} ml de leche medida en frío. Incorpora algo más de aire que para un latte y consigue burbujas muy finas.`),
      { title: "Integra la microespuma", text: "Mezcla leche y microespuma al verter; busca una capa de unos 1–2 cm, sin separar leche líquida y espuma seca en tercios exactos." },
    ],
    latte: [shot, texture(`Prepara ${milk} ml de leche medida en frío, incorporando poco aire.`),
      { title: "Vierte", text: "Mezcla la jarra y vierte la leche, terminando con una capa fina de microespuma." },
    ],
    flatwhite: [shot, texture(`Prepara ${milk} ml de leche medida en frío. Introduce muy poco aire para una textura fluida.`),
      { title: "Integra con poca espuma", text: "Sirve con una capa de microespuma más fina que la del cappuccino. La cantidad de leche aquí es una referencia de estilo, no una norma universal." },
    ],
    cortado: [shot, texture(`La referencia es ${milk} ml de leche a servir, con muy poca espuma. Usa en la jarra la cantidad mínima que permita tu lanza.`),
      { title: "Equilibra los volúmenes", text: "Al servir, busca volúmenes parecidos de café y leche. La cifra de leche es aproximada: el peso del espresso no determina su volumen por la crema." },
    ],
    macchiato: [shot,
      texture("Prepara unos 100 ml de leche, o el mínimo que requiera tu jarra. Esta cantidad se usa para poder texturizar; no se añade toda a la taza."),
      { title: "Marca el espresso", text: `Sirve solo unos ${milk} ml de microespuma sobre el café. Reserva el resto de leche: el macchiato sigue siendo principalmente espresso.` },
    ],
    mocha: [shot,
      { title: "Mezcla el chocolate", text: `Incorpora ${chocolate} g de salsa de chocolate al espresso caliente y remueve hasta integrar. La cantidad es una adaptación ajustable al dulzor de la salsa.` },
      texture(`Prepara ${milk} ml de leche medida en frío y viértela sobre la mezcla con microespuma fina.`),
    ],
    piccolo: [shot, texture(`Prepara leche suficiente para tu jarra y sirve aproximadamente ${milk} ml.`),
      { title: "Sirve en pequeño", text: "Añade una capa fina de microespuma. La base recomendada usa una dosis de 9 g en una canasta individual adecuada, no media carga en una canasta doble." },
    ],
    icedlatte: [
      { title: "Prepara el vaso", text: `Sirve ${milk} ml de leche fría y añade ${ice} g de hielo en un vaso grande. No calientes ni texturices esta leche.` }, shot,
      { title: "Combina en frío", text: "Vierte el espresso sobre la leche y el hielo, mezcla y sirve de inmediato. El hielo diluirá la bebida a medida que se derrita." },
    ],
    affogato: [
      { title: "Prepara el helado", text: `Coloca ${iceCream} g de helado de vainilla en un recipiente resistente al contraste térmico. La referencia de 60 g equivale aproximadamente a una bola; depende del helado.` }, shot,
      { title: "Vierte y sirve", text: "Añade el espresso caliente sobre el helado justo antes de servir y acompaña con cuchara. No lleva leche texturizada." },
    ],
  };
  return recipes[id];
}
