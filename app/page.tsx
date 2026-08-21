"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BrewControls,
  BrewFocus,
  MethodSelector,
  PreparationGuide,
  RecipeCard,
} from "@/app/components/brew-planner";
import { EspressoPlanner } from "@/app/components/espresso-planner";
import { Hero, SavedToast, SiteFooter, SiteHeader } from "@/app/components/site-chrome";
import {
  METHODS,
  type Flavor,
  type Method,
  type MethodId,
} from "@/app/data/coffee";
import {
  buildSteps,
  formatClock,
  formatTimeRange,
  getProfile,
  parseStepTime,
} from "@/app/lib/recipes";

type Theme = "light" | "dark";

export default function Home() {
  const [methodId, setMethodId] = useState<MethodId>("v60");
  const [coffee, setCoffee] = useState(20);
  const [ratio, setRatio] = useState(15);
  const [temperature, setTemperature] = useState(94);
  const [flavor, setFlavor] = useState<Flavor>("Equilibrada");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [focusOpen, setFocusOpen] = useState(false);
  const [focusStep, setFocusStep] = useState(0);
  const savedTimeoutRef = useRef<number | null>(null);

  const method = METHODS.find((item) => item.id === methodId) ?? METHODS[0];
  const profile = getProfile(methodId, flavor);
  const water = Math.round(coffee * ratio);
  const recipeTime = formatTimeRange(profile.minTime, profile.maxTime);
  const timeLabel = formatClock(seconds);
  const doseOptions = methodId === "aero" ? [15, 18, 20] : [15, 20, 30];
  const maxDose = methodId === "aero" ? 20 : 60;
  const steps = useMemo(
    () => buildSteps(methodId, flavor, coffee, water),
    [methodId, flavor, coffee, water],
  );
  const closeFocus = useCallback(() => {
    setFocusOpen(false);
    setRunning(false);
  }, []);

  useThemeInitialization(setTheme);
  useBrewTimer(running, setSeconds);
  useActivePreparationStep({ running, focusOpen, seconds, steps, setFocusStep });
  useFocusDialog({ focusOpen, onClose: closeFocus });

  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) window.clearTimeout(savedTimeoutRef.current);
    };
  }, []);

  function chooseMethod(nextMethod: Method) {
    const nextProfile = getProfile(nextMethod.id, flavor);
    setMethodId(nextMethod.id);
    setCoffee((value) => nextMethod.id === "aero" ? Math.min(value, 20) : value);
    setRatio(nextProfile.ratio);
    setTemperature(nextProfile.temp);
    resetTimer();
  }

  function chooseFlavor(nextFlavor: Flavor) {
    const nextProfile = getProfile(methodId, nextFlavor);
    setFlavor(nextFlavor);
    setRatio(nextProfile.ratio);
    setTemperature(nextProfile.temp);
    resetTimer();
  }

  function resetTimer() {
    setRunning(false);
    setSeconds(0);
    setFocusStep(0);
  }

  function openTimer() {
    setFocusOpen(true);
    if (seconds === 0) {
      setRunning(false);
      setFocusStep(0);
    }
  }

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("coffee-theme", nextTheme);
  }

  function flashSaved() {
    setSaved(true);
    if (savedTimeoutRef.current) window.clearTimeout(savedTimeoutRef.current);
    savedTimeoutRef.current = window.setTimeout(() => setSaved(false), 2200);
  }

  return (
    <main>
      <SiteHeader theme={theme} onToggleTheme={toggleTheme} onSave={flashSaved} />
      <Hero />
      <section className="planner-shell" id="planner">
        <MethodSelector selectedMethod={method} onSelect={chooseMethod} />
        <div className="workbench">
          <BrewControls
            coffee={coffee}
            ratio={ratio}
            temperature={temperature}
            flavor={flavor}
            profile={profile}
            doseOptions={doseOptions}
            maxDose={maxDose}
            onCoffeeChange={setCoffee}
            onRatioChange={setRatio}
            onTemperatureChange={setTemperature}
            onFlavorChange={chooseFlavor}
          />
          <RecipeCard
            method={method}
            flavor={flavor}
            profile={profile}
            coffee={coffee}
            water={water}
            temperature={temperature}
            recipeTime={recipeTime}
            timeLabel={timeLabel}
            seconds={seconds}
            running={running}
            saved={saved}
            onOpenTimer={openTimer}
            onResetTimer={resetTimer}
            onSave={flashSaved}
          />
        </div>
      </section>
      <PreparationGuide method={method} steps={steps} />
      <EspressoPlanner />
      {focusOpen && (
        <BrewFocus
          method={method}
          flavor={flavor}
          profile={profile}
          steps={steps}
          focusStep={focusStep}
          coffee={coffee}
          water={water}
          temperature={temperature}
          timeLabel={timeLabel}
          seconds={seconds}
          running={running}
          onClose={closeFocus}
          onStepChange={setFocusStep}
          onRunningChange={setRunning}
        />
      )}
      {saved && <SavedToast />}
      <SiteFooter />
    </main>
  );
}

function useThemeInitialization(setTheme: (theme: Theme) => void) {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem("coffee-theme");
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme: Theme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : preferredTheme;
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, [setTheme]);
}

function useBrewTimer(running: boolean, setSeconds: (updater: (value: number) => number) => void) {
  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [running, setSeconds]);
}

type ActiveStepOptions = {
  running: boolean;
  focusOpen: boolean;
  seconds: number;
  steps: ReturnType<typeof buildSteps>;
  setFocusStep: (step: number) => void;
};

function useActivePreparationStep(options: ActiveStepOptions) {
  const { running, focusOpen, seconds, steps, setFocusStep } = options;

  useEffect(() => {
    if (!running || !focusOpen) return;
    let activeStep = 1;
    steps.forEach((step, index) => {
      const startAt = parseStepTime(step.time);
      if (startAt !== null && seconds >= startAt) activeStep = index;
    });
    setFocusStep(activeStep);
  }, [running, focusOpen, seconds, steps, setFocusStep]);
}

function useFocusDialog({ focusOpen, onClose }: { focusOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!focusOpen) return;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusOpen, onClose]);
}
