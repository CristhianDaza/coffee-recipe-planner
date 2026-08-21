import Link from "next/link";

type SiteHeaderProps = {
  theme: "light" | "dark";
  savedRecipesCount?: number;
  activePage?: "planner" | "espresso";
  onToggleTheme: () => void;
  onOpenRecipes?: () => void;
};

export function SiteHeader({
  theme,
  savedRecipesCount = 0,
  activePage = "planner",
  onToggleTheme,
  onOpenRecipes,
}: SiteHeaderProps) {
  const nextTheme = theme === "light" ? "oscuro" : "claro";

  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" role="img">
            <path d="M7 12h15v7.5A6.5 6.5 0 0 1 15.5 26h-2A6.5 6.5 0 0 1 7 19.5V12Z" />
            <path d="M22 15h2.5a3.5 3.5 0 0 1 0 7H22M11 8c-1.5-1.5 1.5-2.5 0-4M17 8c-1.5-1.5 1.5-2.5 0-4" />
          </svg>
        </span>
        <span>Coffee Recipe Planner</span>
      </Link>
      <nav>
        <Link className={`${activePage === "planner" ? "active" : ""} ${activePage === "espresso" ? "mobile-view-link" : ""}`.trim()} href="/#planner">Planificador</Link>
        <Link className={`${activePage === "espresso" ? "active" : ""} ${activePage === "planner" ? "mobile-view-link" : ""}`.trim()} href="/espresso">Espresso</Link>
        <button
          className="theme-button"
          onClick={onToggleTheme}
          aria-label={`Activar modo ${nextTheme}`}
          title={`Activar modo ${nextTheme}`}
        >
          <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
        </button>
        {onOpenRecipes && (
          <button className="saved-button" onClick={onOpenRecipes}>
            <span>♡</span> Mis recetas
            {savedRecipesCount > 0 && <b>{savedRecipesCount}</b>}
          </button>
        )}
      </nav>
    </header>
  );
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-kicker"><span /> TU CAFÉ, A TU MANERA</div>
      <h1>Diseña. Prepara.<br /><em>Disfruta.</em></h1>
      <p>
        Ajusta cada variable y crea una receta que se adapte
        <br className="desktop-break" /> perfectamente a tu gusto.
      </p>
      <div className="bean bean-one" />
      <div className="bean bean-two" />
      <div className="blue-spark">✦</div>
      <svg className="hero-line" viewBox="0 0 900 190" fill="none">
        <path d="M12 164C165 154 241 130 342 84C433 43 506 47 540 82C565 108 538 130 512 109C477 80 536 41 613 31C699 20 754 36 888 8" />
      </svg>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <span>Coffee Recipe Planner</span>
      <p>Mejores variables. Mejores mañanas.</p>
      <a href="#top">Volver arriba ↑</a>
    </footer>
  );
}

export function SavedToast({ message }: { message: string }) {
  return <div className="toast" role="status">{message} <span>✓</span></div>;
}
