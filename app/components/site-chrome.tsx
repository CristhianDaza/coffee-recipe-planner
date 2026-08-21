type SiteHeaderProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onSave: () => void;
};

export function SiteHeader({ theme, onToggleTheme, onSave }: SiteHeaderProps) {
  const nextTheme = theme === "light" ? "oscuro" : "claro";

  return (
    <header className="site-header">
      <a className="brand" href="#top">
        <span className="brand-mark"><i /></span>
        <span>Coffee Recipe Planner</span>
      </a>
      <nav>
        <a className="active" href="#planner">Planificador</a>
        <a href="#guide">Guía</a>
        <a href="#espresso">Espresso</a>
        <button
          className="theme-button"
          onClick={onToggleTheme}
          aria-label={`Activar modo ${nextTheme}`}
          title={`Activar modo ${nextTheme}`}
        >
          <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
        </button>
        <button className="saved-button" onClick={onSave}>
          <span>♡</span> Mis recetas
        </button>
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

export function SavedToast() {
  return <div className="toast" role="status">Tu receta quedó guardada <span>✓</span></div>;
}
