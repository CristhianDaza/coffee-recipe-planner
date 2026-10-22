/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation avoids unavailable RSC segment URLs on the static cPanel export. */
import { Icon } from "./icons";

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
    <>
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Coffee Recipe Planner, inicio">
          <span className="brand-mark"><Icon name="cup" /></span>
          <span>Coffee<span className="brand-caption">RECIPE PLANNER</span></span>
        </a>
        <nav aria-label="Navegación principal">
          <a className={activePage === "planner" ? "active" : ""} aria-current={activePage === "planner" ? "page" : undefined} href="/#planner">Filtrados</a>
          <a className={activePage === "espresso" ? "active" : ""} aria-current={activePage === "espresso" ? "page" : undefined} href="/espresso/">Espresso</a>
        </nav>
        <div className="header-actions">
          {onOpenRecipes && <button className="saved-button" onClick={onOpenRecipes} aria-label={`Mis recetas${savedRecipesCount ? `, ${savedRecipesCount} guardadas` : ""}`} title="Mis recetas"><Icon name="bookmark" /><span>Mis recetas</span>{savedRecipesCount > 0 && <b>{savedRecipesCount}</b>}</button>}
          <button className="theme-button" onClick={onToggleTheme} aria-label={`Activar modo ${nextTheme}`} title={`Activar modo ${nextTheme}`}><Icon name={theme === "light" ? "moon" : "sun"} /></button>
        </div>
      </header>
    </>
  );
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <div className="hero-kicker"><span /> EL RITUAL EMPIEZA AQUÍ</div>
        <h1>Una mejor taza.<br /><em>A tu manera.</em></h1>
        <p>Encuentra tu equilibrio entre café, agua y tiempo.<br className="desktop-break" /> Nosotros te acompañamos, paso a paso.</p>
        <a className="hero-link" href="#planner">Diseña tu receta <Icon name="arrow" /></a>
      </div>
      <div className="hero-ritual" aria-hidden="true">
        <div className="ritual-orbit" />
        <svg className="ritual-brewer" viewBox="0 0 240 220" fill="none">
          <path d="M94 20c-12 12 13 13 0 27m25-33c-12 12 13 13 0 27m25-21c-12 12 13 13 0 27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="m56 59 58 74h12l58-74H56Z" fill="var(--paper)" stroke="currentColor" strokeWidth="2" />
          <path d="m76 61 38 70m48-70-36 70m-6-70v70M51 137h138" stroke="currentColor" strokeWidth="2" />
          <path d="M99 139v10l-24 43c-5 9 1 14 11 14h68c10 0 16-5 11-14l-24-43v-10" fill="var(--paper)" stroke="currentColor" strokeWidth="2" />
          <path d="m86 181-8 15c-2 4 3 6 8 6h68c5 0 10-2 8-6l-8-15H86Z" fill="currentColor" />
          <path d="M143 151h16c20 0 20 28 0 28h-2" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="ritual-note">Pequeños ajustes.<br /><em>Grandes mañanas.</em></span>
        <span className="ritual-label">CAFÉ + AGUA + UN MOMENTO PARA TI</span>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <span className="footer-brand"><Icon name="cup" /> Coffee Recipe Planner</span>
      <p>Mejores variables. Mejores mañanas.</p>
      <a href="#top">Volver arriba ↑</a>
    </footer>
  );
}

export function SavedToast({ message, onUndo }: { message: string; onUndo?: () => void }) {
  return <div className="toast" role="status"><Icon name="check" /><span>{message}</span>{onUndo && <button onClick={onUndo}>Deshacer</button>}</div>;
}
