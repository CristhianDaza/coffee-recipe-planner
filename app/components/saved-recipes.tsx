import { METHODS } from "@/app/data/coffee";
import type { SavedRecipe } from "@/app/lib/saved-recipes";

type SavedRecipesDialogProps = {
  recipes: SavedRecipe[];
  onClose: () => void;
  onLoad: (recipe: SavedRecipe) => void;
  onDelete: (id: string) => void;
};

export function SavedRecipesDialog({
  recipes,
  onClose,
  onLoad,
  onDelete,
}: SavedRecipesDialogProps) {
  return (
    <div className="saved-recipes-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="saved-recipes-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="saved-recipes-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="saved-recipes-header">
          <div>
            <span>TU COLECCIÓN</span>
            <h2 id="saved-recipes-title">Mis recetas</h2>
          </div>
          <button onClick={onClose} aria-label="Cerrar mis recetas">×</button>
        </header>

        {recipes.length === 0 ? (
          <div className="saved-recipes-empty">
            <span aria-hidden="true">♡</span>
            <h3>Aún no tienes recetas</h3>
            <p>Ajusta una preparación y selecciona “Guardar receta” para añadirla a esta colección.</p>
            <button onClick={onClose}>Crear mi primera receta</button>
          </div>
        ) : (
          <div className="saved-recipes-list">
            {recipes.map((recipe) => (
              <SavedRecipeItem
                key={recipe.id}
                recipe={recipe}
                onLoad={() => onLoad(recipe)}
                onDelete={() => onDelete(recipe.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

type SavedRecipeItemProps = {
  recipe: SavedRecipe;
  onLoad: () => void;
  onDelete: () => void;
};

function SavedRecipeItem({ recipe, onLoad, onDelete }: SavedRecipeItemProps) {
  const method = METHODS.find((item) => item.id === recipe.methodId) ?? METHODS[0];
  const water = Math.round(recipe.coffee * recipe.ratio);

  return (
    <article className="saved-recipe-item">
      <div className="saved-recipe-title">
        <span>{method.icon}</span>
        <div>
          <h3>{method.name} {recipe.flavor}</h3>
          <small>{formatSavedDate(recipe.createdAt)}</small>
        </div>
      </div>
      <div className="saved-recipe-metrics">
        <span><small>Café</small><b>{recipe.coffee} g</b></span>
        <span><small>Agua</small><b>{water} ml</b></span>
        <span><small>Proporción</small><b>1 : {recipe.ratio}</b></span>
        <span><small>Temperatura</small><b>{recipe.temperature} °C</b></span>
      </div>
      <div className="saved-recipe-actions">
        <button className="saved-recipe-load" onClick={onLoad}>Usar receta</button>
        <button className="saved-recipe-delete" onClick={onDelete} aria-label={`Eliminar ${method.name} ${recipe.flavor}`}>
          Eliminar
        </button>
      </div>
    </article>
  );
}

function formatSavedDate(timestamp: number) {
  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestamp);
}
