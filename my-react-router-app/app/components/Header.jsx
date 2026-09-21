import { NavLink } from "react-router";

export function Header() {
  return (
    <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8 sm:py-6">
      <div className="flex items-center gap-3">
        <span
          className="grid size-11 place-items-center rounded-lg bg-blue-600 text-2xl shadow-md shadow-blue-600/20"
          aria-hidden="true"
        >
          :-)
        </span>
        <div>
          <p className="text-lg font-bold tracking-tight text-slate-800">
            Smajlíci
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Rychlá zpětná vazba</p>
        </div>
      </div>
      <nav
        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-sm shadow-sm"
        aria-label="Hlavní navigace"
      >
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `rounded-md px-3 py-2 font-semibold transition ${
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`
          }
        >
          Hodnocení
        </NavLink>
        <NavLink
          to="/stats"
          className={({ isActive }) =>
            `rounded-md px-3 py-2 font-semibold transition ${
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`
          }
        >
          Statistiky
        </NavLink>
      </nav>
    </header>
  );
}
