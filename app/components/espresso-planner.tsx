"use client";

import { Icon } from "./icons";
import { useState } from "react";
import {
  ESPRESSO_DRINKS,
  SHOT_STYLES,
  type EspressoDrinkId,
  type ShotStyleId,
} from "@/app/data/coffee";
import { buildEspressoRecipe } from "@/app/lib/recipes";

import { RecipeSources } from "./recipe-sources";
import { ESPRESSO_EVIDENCE } from "@/app/data/recipe-sources";

export function EspressoPlanner() {
  const [drinkId, setDrinkId] = useState<EspressoDrinkId>("espresso");
  const [dose, setDose] = useState(18);
  const [shotStyleId, setShotStyleId] = useState<ShotStyleId>("espresso");

  const { drink, shotStyle, espressoYield, milk, water, chocolate, ice, iceCream, cupCapacity, steps } = buildEspressoRecipe(drinkId, dose, shotStyleId);

  function chooseDrink(id: EspressoDrinkId) {
    const selected = ESPRESSO_DRINKS.find((item) => item.id === id) ?? ESPRESSO_DRINKS[0];
    setDrinkId(id);
    setDose(selected.defaultDose);
    setShotStyleId(selected.defaultShot);
  }

  return (
    <section className="espresso-section" id="espresso">
      <EspressoHeading />
      <DrinkPicker selectedId={drinkId} onSelect={chooseDrink} />
      <p className="field-hint">Elegir una bebida carga su dosis y extracción de referencia. Después puedes ajustar ambas; las cantidades de los ingredientes se adaptan.</p>
      <div className="espresso-workbench">
        <EspressoControls
          dose={dose}
          shotStyleId={shotStyleId}
          espressoYield={espressoYield}
          onDoseChange={setDose}
          onShotStyleChange={setShotStyleId}
        />
        <aside className="espresso-recipe" aria-live="polite">
          <div className="espresso-recipe-top"><span>RECETA RESULTANTE</span><span><Icon name="cup" /></span></div>
          <h2>{drink.name}</h2>
          <p>Base {shotStyle.name.toLowerCase()} · {drink.subtitle}.</p>
          <p className="field-hint">Recipiente sugerido: unos {cupCapacity} ml, con margen. La crema, la espuma y el hielo cambian el volumen real.</p>
          <div className="drink-composition">
            <div><i className="coffee-layer" /><span>Espresso</span><strong>{espressoYield} g</strong></div>
            {water > 0 && <div><i className="water-layer" /><span>Agua</span><strong>{water} ml</strong></div>}
            {milk > 0 && <div><i className="milk-layer" /><span>{drink.milkMode === "foam" ? "Microespuma a servir" : drink.milkMode === "cold" ? "Leche fría" : drink.id === "cortado" ? "Leche orientativa" : "Leche"}</span><strong>{milk} ml</strong></div>}
            {chocolate > 0 && <div><i className="foam-layer" /><span>Salsa de chocolate</span><strong>{chocolate} g</strong></div>}
            {ice > 0 && <div><i className="water-layer" /><span>Hielo</span><strong>{ice} g</strong></div>}
            {iceCream > 0 && <div><i className="milk-layer" /><span>Helado de vainilla</span><strong>{iceCream} g</strong></div>}
            {drink.extra && <div><i className="foam-layer" /><span>Acabado</span><strong>{drink.extra}</strong></div>}
          </div>
          <div className="espresso-steps">
            {steps.map((step, index) => (
              <div key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p><b>{step.title}</b>{step.text}</p>
              </div>
            ))}
          </div>
          <p className="milk-safety">
            {drink.milkMode === "cold"
              ? "Esta preparación usa leche fría sin texturizar. El hielo se añade aparte y no reemplaza el agua del espresso."
              : drink.milkMode === "foam"
                ? "La cantidad indicada es solo la microespuma a servir; necesitas más leche en la jarra para texturizar correctamente."
                : drink.milkMode === "steamed"
                  ? "Leche medida en frío, salvo el cortado: al texturizar aumenta de volumen. Usa termómetro y busca unos 60–65 °C; para bebidas vegetales sigue las indicaciones del fabricante."
                  : drink.id === "affogato"
                    ? "Mantén el helado frío hasta el momento de servir y añade el espresso al final."
                    : "Usa agua fresca y precalienta la taza. El peso del espresso se mide en gramos, sin convertirlo en mililitros por la crema."}
          </p>
          <RecipeSources evidence={ESPRESSO_EVIDENCE[drink.id]} />
        </aside>
      </div>
      <div className="espresso-footnote">
        <b>Nota para canastas presurizadas</b>
        <span>El tiempo puede ser más corto y ofrece menos control de molienda. Conserva la proporción de salida y corrige principalmente según el sabor y las indicaciones de tu máquina.</span>
      </div>
    </section>
  );
}

function EspressoHeading() {
  return (
    <div className="espresso-heading">
      <div>
        <div><p>RECETAS CON ESPRESSO</p><h1>Tu café favorito.<br /><em>Empieza con un buen shot.</em></h1></div>
      </div>
      <p>Base moderna de especialidad: proporción 1:2,<br />unos 25–30 segundos como referencia. Ajusta por sabor y equipo.</p>
    </div>
  );
}

type DrinkPickerProps = {
  selectedId: EspressoDrinkId;
  onSelect: (id: EspressoDrinkId) => void;
};

function DrinkPicker({ selectedId, onSelect }: DrinkPickerProps) {
  return (
    <div className="drink-picker">
      <span className="picker-label">ELIGE LA BEBIDA</span>
      <div className="drink-tabs" role="group" aria-label="Bebidas con espresso">
        {ESPRESSO_DRINKS.map((drink) => (
          <button
            key={drink.id}
            className={selectedId === drink.id ? "selected" : ""}
            onClick={() => onSelect(drink.id)}
            aria-pressed={selectedId === drink.id}
          >
            <span><Icon name="cup" /></span><strong>{drink.name}</strong><small>{drink.subtitle}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

type EspressoControlsProps = {
  dose: number;
  shotStyleId: ShotStyleId;
  espressoYield: number;
  onDoseChange: (dose: number) => void;
  onShotStyleChange: (id: ShotStyleId) => void;
};

function EspressoControls(props: EspressoControlsProps) {
  const { dose, shotStyleId, espressoYield, onDoseChange, onShotStyleChange } = props;
  const shotStyle = SHOT_STYLES.find((item) => item.id === shotStyleId) ?? SHOT_STYLES[1];

  return (
    <div className="espresso-controls">
      <p className="eyebrow">CONFIGURA EL SHOT</p>
      <h2>La base de toda buena receta</h2>
      <div className="espresso-dose">
        <span className="control-label">Dosis de café<small>Respeta la capacidad nominal de tu canasta.</small></span>
        <div className="stepper">
          <button disabled={dose <= 9} onClick={() => onDoseChange(Math.max(9, dose - 1))} aria-label="Reducir dosis">−</button>
          <div><strong>{dose}</strong><span>g</span></div>
          <button disabled={dose >= 22} onClick={() => onDoseChange(Math.min(22, dose + 1))} aria-label="Aumentar dosis">+</button>
        </div>
        <div className="quick-values">
          {[9, 18, 20].map((value) => (
            <button key={value} aria-pressed={dose === value} className={dose === value ? "on" : ""} onClick={() => onDoseChange(value)}>{value}g</button>
          ))}
        </div>
      </div>
      <div className="shot-style-control">
        <span className="control-label">Estilo de extracción</span>
        <div>
          {SHOT_STYLES.map((style) => (
            <button key={style.id} aria-pressed={shotStyleId === style.id} className={shotStyleId === style.id ? "on" : ""} onClick={() => onShotStyleChange(style.id)}>
              <strong>{style.name}</strong><small>1:{style.ratio} · {style.description}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="espresso-baseline">
        <div><span>Salida objetivo</span><strong>{espressoYield} g</strong></div>
        <div><span>Proporción</span><strong>1 : {shotStyle.ratio}</strong></div>
        <div><span>Tiempo</span><strong>{shotStyle.time}</strong></div>
        <div><span>Temperatura</span><strong>92–94 °C</strong></div>
      </div>
      <div className="dial-note">
        <b>Cómo calibrarlo</b>
        <p>Busca primero {espressoYield} g en {shotStyle.time}. Si sale demasiado rápido, muele más fino; si tarda demasiado, más grueso. El sabor siempre tiene la última palabra. No detengas la extracción solo para cumplir el reloj: ajusta la molienda para alcanzar el rendimiento previsto.</p>
      </div>
    </div>
  );
}
