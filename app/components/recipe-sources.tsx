import { RECIPE_REVIEW_DATE, RECIPE_SOURCES, type RecipeEvidence } from "@/app/data/recipe-sources";

export function RecipeSources({ evidence }: { evidence: RecipeEvidence }) {
  return (
    <details className="recipe-sources">
      <summary>Fuentes y criterio de esta receta</summary>
      <div>
        <p>{evidence.note}</p>
        <ul>
          {evidence.sourceIds.map((id) => (
            <li key={id}><a href={RECIPE_SOURCES[id].url} target="_blank" rel="noopener noreferrer">{RECIPE_SOURCES[id].title}<span className="source-new-window"> (abre en otra pestaña)</span></a></li>
          ))}
        </ul>
        <p className="source-review">Fuentes revisadas el <time dateTime={RECIPE_REVIEW_DATE}>22 de octubre de 2026</time>. Son puntos de partida: ajusta por café, tueste, agua y equipo.</p>
      </div>
    </details>
  );
}
