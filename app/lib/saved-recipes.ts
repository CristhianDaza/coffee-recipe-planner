import {
  FLAVORS,
  METHODS,
  type Flavor,
  type MethodId,
} from "@/app/data/coffee";

const STORAGE_KEY = "coffee-saved-recipes";

export type SavedRecipe = {
  id: string;
  methodId: MethodId;
  flavor: Flavor;
  coffee: number;
  ratio: number;
  temperature: number;
  createdAt: number;
};

export type RecipeToSave = Omit<SavedRecipe, "id" | "createdAt">;

export function readSavedRecipes(): SavedRecipe[] {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return [];
    const parsedValue: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) return [];
    return parsedValue.filter(isSavedRecipe);
  } catch {
    return [];
  }
}

export function writeSavedRecipes(recipes: SavedRecipe[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function addOrUpdateRecipe(
  recipes: SavedRecipe[],
  recipe: RecipeToSave,
): SavedRecipe[] {
  const duplicate = recipes.find((item) => hasSameConfiguration(item, recipe));
  const savedRecipe: SavedRecipe = {
    ...recipe,
    id: duplicate?.id ?? createRecipeId(),
    createdAt: Date.now(),
  };

  return [savedRecipe, ...recipes.filter((item) => item.id !== savedRecipe.id)];
}

function hasSameConfiguration(saved: SavedRecipe, recipe: RecipeToSave) {
  return (
    saved.methodId === recipe.methodId
    && saved.flavor === recipe.flavor
    && saved.coffee === recipe.coffee
    && saved.ratio === recipe.ratio
    && saved.temperature === recipe.temperature
  );
}

function createRecipeId() {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isSavedRecipe(value: unknown): value is SavedRecipe {
  if (!value || typeof value !== "object") return false;
  const recipe = value as Partial<SavedRecipe>;
  return (
    typeof recipe.id === "string"
    && METHODS.some((method) => method.id === recipe.methodId)
    && FLAVORS.some((flavor) => flavor === recipe.flavor)
    && isFiniteNumber(recipe.coffee)
    && isFiniteNumber(recipe.ratio)
    && isFiniteNumber(recipe.temperature)
    && isFiniteNumber(recipe.createdAt)
    && recipe.createdAt >= 0 && recipe.createdAt <= 8640000000000000
    && recipe.coffee >= 8 && recipe.coffee <= (recipe.methodId === "aero" ? 20 : 60)
    && recipe.ratio >= 10 && recipe.ratio <= 18
    && recipe.temperature >= 80 && recipe.temperature <= 98
  );
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
