import type { CSSProperties } from "react";
import {
  FLAVORS,
  GRIND_LEVELS,
  METHODS,
  type Flavor,
  type Method,
  type RecipeProfile,
} from "@/app/data/coffee";
import { parseStepTime, type PreparationStep } from "@/app/lib/recipes";

type RangeControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  output: string;
  scale: string[];
  onChange: (value: number) => void;
};

export function RangeControl({
  label,
  value,
  min,
  max,
  output,
  scale,
  onChange,
}: RangeControlProps) {
  const rangeStyle = {
    "--range": `${((value - min) / (max - min)) * 100}%`,
  } as CSSProperties;

  return (
    <div className="control-block">
      <div className="label-row">
        <label>{label}</label>
        <output>{output}</output>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={rangeStyle}
      />
      <div className="scale">
        {scale.map((item) => <span key={item}>{item}</span>)}
      </div>
    </div>
  );
}

type MethodSelectorProps = {
  selectedMethod: Method;
  onSelect: (method: Method) => void;
};

export function MethodSelector({ selectedMethod, onSelect }: MethodSelectorProps) {
  return (
    <>
      <div className="section-heading">
        <div><h2>Elige tu método</h2></div>
        <p>Cada método tiene su propia personalidad.<br />¿Cuál se ajusta a tu momento?</p>
      </div>
      <div className="method-grid">
        {METHODS.map((method) => {
          const isSelected = selectedMethod.id === method.id;
          return (
            <button
              key={method.id}
              className={`method-card ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(method)}
              aria-pressed={isSelected}
            >
              <span className="method-icon">{method.icon}</span>
              <strong>{method.name}</strong>
              <small>{method.subtitle}</small>
              {isSelected && <span className="check">✓</span>}
            </button>
          );
        })}
      </div>
    </>
  );
}

type BrewControlsProps = {
  coffee: number;
  ratio: number;
  temperature: number;
  flavor: Flavor;
  profile: RecipeProfile;
  doseOptions: number[];
  maxDose: number;
  onCoffeeChange: (value: number) => void;
  onRatioChange: (value: number) => void;
  onTemperatureChange: (value: number) => void;
  onFlavorChange: (flavor: Flavor) => void;
};

export function BrewControls(props: BrewControlsProps) {
  const {
    coffee,
    ratio,
    temperature,
    flavor,
    profile,
    doseOptions,
    maxDose,
    onCoffeeChange,
    onRatioChange,
    onTemperatureChange,
    onFlavorChange,
  } = props;

  return (
    <div className="controls-panel">
      <div className="panel-title">
        <div><h2>Ajusta las variables</h2><p>Pequeños cambios, grandes diferencias.</p></div>
      </div>
      <div className="control-block dose-control">
        <label>Cantidad de café</label>
        <div className="stepper">
          <button onClick={() => onCoffeeChange(Math.max(8, coffee - 1))} aria-label="Reducir un gramo">−</button>
          <div><strong>{coffee}</strong><span>g</span></div>
          <button onClick={() => onCoffeeChange(Math.min(maxDose, coffee + 1))} aria-label="Aumentar un gramo">+</button>
        </div>
        <div className="quick-values">
          {doseOptions.map((value) => (
            <button key={value} className={coffee === value ? "on" : ""} onClick={() => onCoffeeChange(value)}>
              {value}g
            </button>
          ))}
        </div>
      </div>
      <RangeControl label="Proporción" value={ratio} min={10} max={18} output={`1 : ${ratio}`} onChange={onRatioChange} scale={["Concentrado", "Equilibrado", "Suave"]} />
      <RangeControl label="Temperatura" value={temperature} min={80} max={98} output={`${temperature}°C`} onChange={onTemperatureChange} scale={["80°C", "90°C", "98°C"]} />
      <div className="control-block flavor-control">
        <label>Perfil que buscas</label>
        <div>
          <div className="segmented">
            {FLAVORS.map((item) => (
              <button key={item} className={flavor === item ? "on" : ""} onClick={() => onFlavorChange(item)}>
                {item}
              </button>
            ))}
          </div>
          <p style={{ margin: "8px 0 0", color: "var(--coral)", fontSize: 9, lineHeight: 1.35, fontWeight: 700 }}>
            Ajusta proporción, temperatura, molienda, tiempo y técnica.
          </p>
        </div>
      </div>
      <GrindGuide recommendedGrind={profile.grind} />
    </div>
  );
}

function GrindGuide({ recommendedGrind }: { recommendedGrind: string }) {
  const normalizeGrind = (grind: string) =>
    grind
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es")
      .split("-")
      .map((part) => (part.endsWith("a") ? `${part.slice(0, -1)}o` : part))
      .join("-");
  const recommendedGrindKey = normalizeGrind(recommendedGrind);

  return (
    <details className="grind-guide">
      <summary>
        <span><b>Guía visual de molienda</b><small>Recomendada ahora: {recommendedGrind}</small></span>
        <i>+</i>
      </summary>
      <p>La referencia es visual y táctil; cada molino usa números diferentes.</p>
      <div className="grind-direction"><span>← Más fino</span><span>Más grueso →</span></div>
      <div className="grind-scale">
        {GRIND_LEVELS.map((level) => {
          const isRecommended = recommendedGrindKey === normalizeGrind(level.name);
          const grainStyle = { "--grain": `${level.size}px` } as CSSProperties;
          return (
            <div key={level.name} className={isRecommended ? "active" : ""}>
              <span className="grain-tray" style={grainStyle}>
                {Array.from({ length: level.count }, (_, index) => <i key={index} />)}
              </span>
              <span className="grind-copy"><b>{level.name}</b><small>{level.reference}</small></span>
              {isRecommended && <em>Recomendada</em>}
            </div>
          );
        })}
      </div>
    </details>
  );
}

type RecipeCardProps = {
  method: Method;
  flavor: Flavor;
  profile: RecipeProfile;
  coffee: number;
  water: number;
  temperature: number;
  recipeTime: string;
  timeLabel: string;
  seconds: number;
  running: boolean;
  saved: boolean;
  onOpenTimer: () => void;
  onResetTimer: () => void;
  onSave: () => void;
};

export function RecipeCard(props: RecipeCardProps) {
  const { method, flavor, profile, coffee, water, temperature, recipeTime, timeLabel, seconds, running, saved, onOpenTimer, onResetTimer, onSave } = props;
  const timerAction = running ? "Ver preparación" : seconds ? "Continuar receta" : "Iniciar receta";

  return (
    <aside className="recipe-card" aria-live="polite">
      <div className="recipe-top"><span>MI RECETA</span><span className="recipe-icon">{method.icon}</span></div>
      <h2>{method.name} {flavor}</h2>
      <p className="recipe-subtitle">{profile.description}</p>
      <div className="recipe-metrics">
        <div><span>Café</span><strong>{coffee}<small>g</small></strong></div>
        <div><span>Agua</span><strong>{water}<small>ml</small></strong></div>
        <div><span>Temp.</span><strong>{temperature}<small>°C</small></strong></div>
      </div>
      <div className="recipe-details">
        <div><span>Molienda</span><b>{profile.grind}</b></div>
        <div><span>Tiempo total</span><b>{recipeTime}</b></div>
      </div>
      <div className="timer">
        <span>Temporizador</span>
        <strong>{timeLabel}</strong>
        <div>
          <button className="timer-main" onClick={onOpenTimer}>{timerAction}</button>
          {(running || seconds > 0) && (
            <button className="timer-reset" onClick={onResetTimer} aria-label="Reiniciar">↺</button>
          )}
        </div>
      </div>
      <button className="save-recipe" onClick={onSave}>
        {saved ? "✓ Receta guardada" : "Guardar receta"}<span>♡</span>
      </button>
    </aside>
  );
}

export function PreparationGuide({ method, steps }: { method: Method; steps: PreparationStep[] }) {
  return (
    <section className="guide" id="guide">
      <div className="guide-title">
        <div><p>PASO A PASO · {method.name.toUpperCase()}</p><h2>Es hora de preparar</h2></div>
      </div>
      <div className="timeline">
        {steps.map((step) => (
          <article key={`${step.time}-${step.title}`}>
            <span>{step.time}</span><div className="dot" />
            <div><strong>{step.title}</strong><p>{step.text}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

type BrewFocusProps = {
  method: Method;
  flavor: Flavor;
  profile: RecipeProfile;
  steps: PreparationStep[];
  focusStep: number;
  coffee: number;
  water: number;
  temperature: number;
  timeLabel: string;
  seconds: number;
  running: boolean;
  onClose: () => void;
  onFinish: () => void;
  onStepChange: (step: number) => void;
  onRunningChange: (running: boolean) => void;
};

export function BrewFocus(props: BrewFocusProps) {
  const { method, flavor, profile, steps, focusStep, coffee, water, temperature, timeLabel, seconds, running, onClose, onFinish, onStepChange, onRunningChange } = props;
  const activeStep = steps[focusStep];
  const primaryLabel = !running && seconds === 0 ? "Comenzar extracción" : running ? "Pausar temporizador" : "Continuar temporizador";
  const progress = getTimelineProgress(steps, seconds, running || seconds > 0);
  const progressStyle = {
    "--focus-progress": `${progress}%`,
  } as CSSProperties;

  function handlePrimaryAction() {
    if (!running && seconds === 0) {
      onStepChange(1);
      onRunningChange(true);
      return;
    }
    onRunningChange(!running);
  }

  return (
    <div className="brew-focus" role="dialog" aria-modal="true" aria-label={`Preparación de ${method.name}`}>
      <div className="focus-top">
        <div><span>PREPARANDO</span><h2>{method.name} · {flavor}</h2></div>
        <button onClick={onClose} aria-label="Cerrar preparación">×</button>
      </div>
      <div className="focus-body">
        <div className="focus-timer">
          <span>{running ? "TIEMPO TRANSCURRIDO" : "TODO LISTO"}</span>
          <strong>{timeLabel}</strong>
          <div className="focus-metrics">
            <span>{coffee} g café</span><span>{water} ml agua</span>
            <span>{temperature} °C</span><span>{profile.grind}</span>
          </div>
        </div>
        <div className="focus-step">
          <span className="focus-step-count">PASO {focusStep + 1} DE {steps.length}</span>
          <p className="focus-step-time">{activeStep.time}</p>
          <h3>{activeStep.title}</h3><p>{activeStep.text}</p>
        </div>
        <aside className="focus-upcoming" aria-label="Paso actual y próximos pasos">
          <div className="focus-upcoming-title">
            <span>PASO A PASO</span>
            <small>{focusStep + 1} / {steps.length}</small>
          </div>
          <ol>
            {steps.map((step, index) => (
              <li
                key={`${step.time}-${step.title}`}
                className={index === focusStep ? "current" : index < focusStep ? "done" : "upcoming"}
              >
                <span>{step.time}</span>
                <i aria-hidden="true" />
                <div>
                  <b>{step.title}</b>
                  <small>{step.text}</small>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
      <div className="focus-progress" style={progressStyle} aria-label={`Progreso de la receta: ${timeLabel}`}>
        {steps.map((step, index) => (
          <button
            key={`${step.time}-${step.title}`}
            className={index === focusStep ? "active" : index < focusStep ? "done" : ""}
            onClick={() => onStepChange(index)}
            aria-label={`Ir al paso ${index + 1}`}
          >
            <i />{step.title}
          </button>
        ))}
      </div>
      <div className="focus-actions">
        <button className="focus-secondary" onClick={() => onStepChange(Math.max(0, focusStep - 1))} disabled={focusStep === 0}>← Anterior</button>
        <button className="focus-primary" onClick={handlePrimaryAction}>{primaryLabel}</button>
        {(running || seconds > 0) && <button className="focus-finish" onClick={onFinish}>Terminar receta</button>}
        <button className="focus-secondary" onClick={() => onStepChange(Math.min(steps.length - 1, focusStep + 1))} disabled={focusStep === steps.length - 1}>Siguiente →</button>
      </div>
    </div>
  );
}

function getTimelineProgress(
  steps: PreparationStep[],
  seconds: number,
  hasStarted: boolean,
) {
  if (steps.length === 0) return 0;

  const circlePosition = (index: number) => ((index + 0.5) / steps.length) * 100;
  if (!hasStarted) return circlePosition(0);

  const timedSteps = steps.flatMap((step, index) => {
    const time = parseStepTime(step.time);
    return time === null ? [] : [{ index, time }];
  });
  if (timedSteps.length === 0) return circlePosition(0);

  const first = timedSteps[0];
  if (seconds <= first.time) return circlePosition(first.index);

  for (let index = 1; index < timedSteps.length; index += 1) {
    const previous = timedSteps[index - 1];
    const next = timedSteps[index];
    if (seconds <= next.time) {
      const interval = Math.max(next.time - previous.time, 1);
      const elapsed = (seconds - previous.time) / interval;
      const start = circlePosition(previous.index);
      const end = circlePosition(next.index);
      return start + (end - start) * elapsed;
    }
  }

  return circlePosition(timedSteps[timedSteps.length - 1].index);
}
