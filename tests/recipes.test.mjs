import assert from 'node:assert/strict';
import { test } from 'node:test';
import { METHODS, FLAVORS, SHOT_STYLES, ESPRESSO_DRINKS, getMaxDose } from '../app/data/coffee.ts';
import { BREW_EVIDENCE, ESPRESSO_EVIDENCE, RECIPE_SOURCES } from '../app/data/recipe-sources.ts';
import { buildSteps, buildEspressoRecipe, getProfile, getBrewWater, parseStepTime } from '../app/lib/recipes.ts';
import { addOrUpdateRecipe, readSavedRecipes, writeSavedRecipes } from '../app/lib/saved-recipes.ts';

test('all methods and flavor profiles have complete, ordered timelines through the stated finish', () => {
  for (const method of METHODS) for (const flavor of FLAVORS) {
    const profile = getProfile(method.id, flavor);
    assert.ok(profile.minTime <= profile.maxTime);
    for (const coffee of [8, 15, getMaxDose(method.id)]) for (const ratio of [10, profile.ratio, 18]) {
      const water = coffee * ratio;
      const steps = buildSteps(method.id, flavor, coffee, water);
      assert.equal(steps[0].time, 'ANTES');
      assert.ok(steps.length >= 5);
      const times = steps.slice(1).map(step => parseStepTime(step.time));
      assert.equal(times[0], 0);
      assert.equal(times.at(-1), profile.minTime);
      times.forEach((time, i) => {
        assert.ok(Number.isFinite(time), `${method.id}: valid step time`);
        if (i) assert.ok(time > times[i - 1], `${method.id}: strictly ordered steps`);
      });
      assert.ok(steps.every(step => !/NaN|undefined|\b-\d+ g/.test(step.text)));
      assert.ok(steps.every(step => step.title && step.text));
    }
  }
});

test('AeroPress splits total water into chamber and explicit dilution without overflowing at extremes', () => {
  for (let coffee = 8; coffee <= 20; coffee++) for (let ratio = 10; ratio <= 18; ratio++) {
    const water = coffee * ratio;
    const { brewWater, dilutionWater } = getBrewWater('aero', water);
    assert.ok(brewWater <= 240);
    assert.ok(dilutionWater >= 0);
    assert.equal(brewWater + dilutionWater, water);
    if (dilutionWater) assert.ok(buildSteps('aero', 'Equilibrada', coffee, water).at(-1).text.includes(`${dilutionWater} g`));
  }
  assert.deepEqual(getBrewWater('aero', 360), { brewWater: 240, dilutionWater: 120 });
  assert.deepEqual(getBrewWater('v60', 360), { brewWater: 360, dilutionWater: 0 });
});

test('Clever uses the verified water-first technique and drains after two minutes', () => {
  const steps = buildSteps('clever', 'Equilibrada', 16, 240);
  assert.match(steps[1].title, /Primero agua/);
  assert.equal(steps.find(step => step.title === 'Abre el drenaje').time, '02:00');
  assert.equal(getMaxDose('clever') * 18, 450);
});

test('French press includes pressing and serving after the four-minute infusion', () => {
  const steps = buildSteps('french', 'Equilibrada', 20, 300);
  assert.equal(steps.find(step => step.title === 'Baja el émbolo').time, '04:00');
  assert.equal(steps.at(-1).time, '04:30');
});

test('all twelve espresso drinks produce valid quantities and directions at every supported dose and shot style', () => {
  for (const drink of ESPRESSO_DRINKS) for (const style of SHOT_STYLES) for (let dose = 9; dose <= 22; dose++) {
    const recipe = buildEspressoRecipe(drink.id, dose, style.id);
    for (const key of ['espressoYield', 'milk', 'water', 'chocolate', 'ice', 'iceCream', 'cupCapacity']) {
      assert.ok(Number.isFinite(recipe[key]) && recipe[key] >= 0, `${drink.id}: ${key}`);
    }
    assert.ok(recipe.steps.length >= 3);
    assert.ok(recipe.steps.every(step => step.title && step.text && !/NaN|undefined/.test(step.text)));
    assert.ok(recipe.steps.some(step => step.text.includes(`${recipe.espressoYield} g`)));
  }
});

test('mocha chocolate scales in both ingredients and instructions', () => {
  const single = buildEspressoRecipe('mocha', 9, 'espresso');
  const double = buildEspressoRecipe('mocha', 18, 'espresso');
  assert.equal(single.chocolate, 10);
  assert.equal(double.chocolate, 20);
  assert.ok(single.steps.some(step => step.text.includes('10 g de salsa')));
  assert.ok(double.cupCapacity > single.cupCapacity);
});

test('americano and long black have different assembly orders and long black water tracks the shot', () => {
  const americano = buildEspressoRecipe('americano', 18, 'espresso');
  const longblack = buildEspressoRecipe('longblack', 18, 'lungo');
  assert.equal(americano.steps[0].title, 'Extrae el café');
  assert.equal(longblack.steps[0].title, 'Agua primero');
  assert.equal(longblack.water, 108);
});

test('cortado milk follows the selected yield and directions explicitly avoid a mass-to-volume equivalence', () => {
  const short = buildEspressoRecipe('cortado', 18, 'ristretto');
  const long = buildEspressoRecipe('cortado', 18, 'lungo');
  assert.equal(short.milk, 27);
  assert.equal(long.milk, 54);
  assert.match(long.steps.at(-1).text, /no determina su volumen/);
});

test('cold latte and affogato have their own ingredients and never steam the milk', () => {
  const cold = buildEspressoRecipe('icedlatte', 18, 'espresso');
  assert.equal(cold.drink.milkMode, 'cold');
  assert.equal(cold.ice, 100);
  assert.ok(cold.steps.some(step => step.text.includes('100 g de hielo')));
  assert.ok(!cold.steps.some(step => step.title === 'Texturiza la leche'));
  const dessert = buildEspressoRecipe('affogato', 18, 'espresso');
  assert.equal(dessert.iceCream, 60);
  assert.equal(dessert.milk, 0);
  assert.ok(dessert.steps[0].text.includes('60 g de helado'));
});

test('macchiato separates the milk needed for steaming from the amount served', () => {
  const recipe = buildEspressoRecipe('macchiato', 18, 'espresso');
  assert.equal(recipe.milk, 10);
  assert.match(recipe.steps[1].text, /100 ml/);
  assert.match(recipe.steps[2].text, /10 ml/);
});

test('every recipe has verified source identifiers and HTTPS references', () => {
  for (const evidence of [...Object.values(BREW_EVIDENCE), ...Object.values(ESPRESSO_EVIDENCE)]) {
    assert.ok(evidence.note.length > 30);
    assert.ok(evidence.sourceIds.length > 0);
    for (const id of evidence.sourceIds) assert.equal(new URL(RECIPE_SOURCES[id].url).protocol, 'https:');
  }
});

test('old saved recipes remain readable, new methods round-trip, and invalid doses are discarded', () => {
  const storage = new Map();
  const previousWindow = globalThis.window;
  globalThis.window = { localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) } };
  try {
    let recipes = [];
    for (const method of METHODS) {
      recipes = addOrUpdateRecipe(recipes, { methodId: method.id, flavor: 'Equilibrada', coffee: Math.min(20, getMaxDose(method.id)), ratio: 15, temperature: 94 });
    }
    writeSavedRecipes(recipes);
    assert.equal(readSavedRecipes().length, METHODS.length);
    const legacy = { ...recipes[0], id: 'legacy', methodId: 'v60', coffee: 60 };
    const invalid = { ...recipes[0], id: 'invalid', methodId: 'clever', coffee: 60 };
    storage.set('coffee-saved-recipes', JSON.stringify([legacy, invalid]));
    assert.deepEqual(readSavedRecipes().map(item => item.id), ['legacy']);
  } finally { globalThis.window = previousWindow; }
});

test('unrecognized or invalid timestamps do not become NaN in the timer', () => {
  assert.equal(parseStepTime('ANTES'), null);
  assert.equal(parseStepTime('00:75'), null);
  assert.equal(parseStepTime('desconocido'), null);
  assert.equal(parseStepTime('04:30'), 270);
});
