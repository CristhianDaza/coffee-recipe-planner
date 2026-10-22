"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BrewControls,
  BrewFocus,
  MethodSelector,
  PreparationGuide,
  RecipeCard,
} from "@/app/components/brew-planner";
import { SavedRecipesDialog } from "@/app/components/saved-recipes";
import { Hero, SavedToast, SiteFooter, SiteHeader } from "@/app/components/site-chrome";
import {
  METHODS,
  RECIPES,
  getMaxDose,
  getDoseOptions,
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
import {
  addOrUpdateRecipe,
  readSavedRecipes,
  writeSavedRecipes,
  type SavedRecipe,
} from "@/app/lib/saved-recipes";

import { useModalBehavior } from "@/app/lib/use-modal-behavior";

type Theme = "light" | "dark";

export default function Home() {
  const [methodId, setMethodId] = useState<MethodId>("v60");
  const [coffee, setCoffee] = useState(20);
  const [ratio, setRatio] = useState(RECIPES.v60.Equilibrada.ratio);
  const [temperature, setTemperature] = useState(94);
  const [flavor, setFlavor] = useState<Flavor>("Equilibrada");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [focusOpen, setFocusOpen] = useState(false);
  const [focusStep, setFocusStep] = useState(0);
  const [deletedRecipe, setDeletedRecipe] = useState<SavedRecipe | null>(null);
  const savedTimeoutRef = useRef<number | null>(null);

  const method = METHODS.find((item) => item.id === methodId) ?? METHODS[0];
  const profile = getProfile(methodId, flavor);
  const water = Math.round(coffee * ratio);
  const recipeTime = formatTimeRange(profile.minTime, profile.maxTime);
  const timeLabel = formatClock(seconds);
  const doseOptions = getDoseOptions(methodId);
  const maxDose = getMaxDose(methodId);
  const steps = useMemo(
    () => buildSteps(methodId, flavor, coffee, water),
    [methodId, flavor, coffee, water],
  );
  const closeFocus = useCallback(() => {
    setFocusOpen(false);
  }, []);
  const closeRecipes = useCallback(() => setRecipesOpen(false), []);

  useThemeInitialization(setTheme);
  useSavedRecipesInitialization(setSavedRecipes);
  useBrewTimer(running, setSeconds);
  useActivePreparationStep({ running, focusOpen, seconds, steps, setFocusStep });
  useModalBehavior({ isOpen: focusOpen, onClose: closeFocus });
  useModalBehavior({ isOpen: recipesOpen, onClose: closeRecipes });

  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) window.clearTimeout(savedTimeoutRef.current);
    };
  }, []);

  function chooseMethod(nextMethod: Method) {
    const nextProfile = getProfile(nextMethod.id, flavor);
    setMethodId(nextMethod.id);
    setCoffee((value) => Math.min(value, getMaxDose(nextMethod.id)));
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

  function finishRecipe() {
    resetTimer();
    setFocusOpen(false);
    showToast("Receta terminada");
  }

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    try { window.localStorage.setItem("coffee-theme", nextTheme); } catch { /* Keep the selected theme for this visit if storage is unavailable. */ }
  }

  function showToast(message: string) {
    setDeletedRecipe(null);
    setToastMessage(message);
    if (savedTimeoutRef.current) window.clearTimeout(savedTimeoutRef.current);
    savedTimeoutRef.current = window.setTimeout(() => setToastMessage(null), 5000);
  }

  function saveCurrentRecipe() {
    const nextRecipes = addOrUpdateRecipe(savedRecipes, {
      methodId,
      flavor,
      coffee,
      ratio,
      temperature,
    });
    if (!persistRecipes(nextRecipes)) return;
    showToast("Receta guardada");
  }

  function loadSavedRecipe(recipe: SavedRecipe) {
    setMethodId(recipe.methodId);
    setFlavor(recipe.flavor);
    setCoffee(recipe.coffee);
    setRatio(recipe.ratio);
    setTemperature(recipe.temperature);
    resetTimer();
    setRecipesOpen(false);
    showToast("Receta cargada");
    window.requestAnimationFrame(() => {
      document.getElementById("planner")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
  }

  function persistRecipes(nextRecipes: SavedRecipe[]) {
    try {
      writeSavedRecipes(nextRecipes);
      setSavedRecipes(nextRecipes);
      return true;
    } catch {
      showToast("No se pudo guardar. Revisa el almacenamiento de tu navegador e inténtalo de nuevo.");
      return false;
    }
  }

  function deleteSavedRecipe(id: string) {
    const recipe = savedRecipes.find((item) => item.id === id);
    const nextRecipes = savedRecipes.filter((item) => item.id !== id);
    if (!persistRecipes(nextRecipes)) return;
    showToast("Receta eliminada");
    setDeletedRecipe(recipe ?? null);
    window.requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(".saved-undo button")?.focus());
  }

  function undoDelete() {
    if (!deletedRecipe) return;
    const nextRecipes = [...savedRecipes, deletedRecipe].sort((a, b) => b.createdAt - a.createdAt);
    if (persistRecipes(nextRecipes)) {
      showToast("Receta restaurada");
      window.requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(".saved-recipe-load")?.focus());
    }
  }

  return (
    <main>
      <SiteHeader
        theme={theme}
        savedRecipesCount={savedRecipes.length}
        onToggleTheme={toggleTheme}
        onOpenRecipes={() => setRecipesOpen(true)}
      />
      <div id="main-content" tabIndex={-1}>
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
              onCoffeeChange={(value) => { setCoffee(value); resetTimer(); }}
              onRatioChange={(value) => { setRatio(value); resetTimer(); }}
              onTemperatureChange={(value) => { setTemperature(value); resetTimer(); }}
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
              saved={toastMessage === "Receta guardada"}
              onOpenTimer={openTimer}
              onResetTimer={resetTimer}
              onSave={saveCurrentRecipe}
            />
          </div>
        </section>
        <PreparationGuide method={method} steps={steps} />
      </div>
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
          recipeTime={recipeTime}
          timeLabel={timeLabel}
          seconds={seconds}
          running={running}
          onClose={closeFocus}
          onFinish={finishRecipe}
          onStepChange={(step) => { setRunning(false); setFocusStep(step); }}
          onRunningChange={setRunning}
        />
      )}
      {recipesOpen && (
        <SavedRecipesDialog
          recipes={savedRecipes}
          onClose={closeRecipes}
          onLoad={loadSavedRecipe}
          onDelete={deleteSavedRecipe}
          onUndo={deletedRecipe ? undoDelete : undefined}
        />
      )}
      {toastMessage && !focusOpen && <SavedToast message={toastMessage} onUndo={!recipesOpen && deletedRecipe && toastMessage === "Receta eliminada" ? undoDelete : undefined} />}
      <SiteFooter />
    </main>
  );
}

function useThemeInitialization(setTheme: (theme: Theme) => void) {
  useEffect(() => {
    let storedTheme: string | null = null;
    try { storedTheme = window.localStorage.getItem("coffee-theme"); } catch { /* Fall back to the system preference. */ }
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme: Theme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : preferredTheme;
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, [setTheme]);
}

function useSavedRecipesInitialization(
  setSavedRecipes: (recipes: SavedRecipe[]) => void,
) {
  useEffect(() => {
    setSavedRecipes(readSavedRecipes());
  }, [setSavedRecipes]);
}

function useBrewTimer(running: boolean, setSeconds: (updater: (value: number) => number) => void) {
  useEffect(() => {
    if (!running) return;
    let lastTick = Date.now();
    const interval = window.setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastTick) / 1000);
      if (elapsed > 0) {
        setSeconds((value) => value + elapsed);
        lastTick += elapsed * 1000;
      }
    }, 250);
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
