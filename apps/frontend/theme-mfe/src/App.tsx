import { useEffect, useState } from "react";
import { THEMES, getCurrentTheme, setTheme } from "./themeManager";
import type { ThemeName } from "@/utils/themeTypes";

function App() {
  const [theme, setThemeState] = useState<ThemeName>(() => getCurrentTheme());

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-10">
      <section
        className="w-full rounded-2xl border p-8 shadow-lg"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--ring)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--muted)" }}
        >
          Platform Theme Runtime
        </p>
        <h1 className="mt-2 text-4xl font-bold">Theme MFE</h1>
        <p className="mt-3 text-base" style={{ color: "var(--muted)" }}>
          This app owns theme state and exposes imperative APIs for any host or
          remote. A provider is also available for automatic style and theme
          bootstrapping.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <label className="text-sm font-semibold" htmlFor="theme-select">
            Active theme
          </label>
          <select
            id="theme-select"
            value={theme}
            onChange={(event) => setThemeState(event.target.value as ThemeName)}
            className="w-full max-w-sm rounded-xl border px-3 py-2 text-base"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--ring)",
              color: "var(--text)",
            }}
          >
            {THEMES.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 text-sm" style={{ color: "var(--muted)" }}>
          Current theme:{" "}
          <span className="font-semibold" style={{ color: "var(--text)" }}>
            {theme}
          </span>
        </div>
      </section>
    </main>
  );
}

export default App;
