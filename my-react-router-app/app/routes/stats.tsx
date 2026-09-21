import type { Route } from "./+types/stats";
import { Form, useLoaderData } from "react-router";
import { Header } from "../components/Header";
import { sql } from "../server/server";

const smileys = {
  1: "🤩",
  2: "🫡",
  3: "😐",
  4: "🙁",
  5: "💩",
};

type RatingStats = {
  average: number | null;
  median: number | null;
  modes: number[];
  total: number;
  histogram: Array<{ value: number; count: number }>;
};

type RatingRow = {
  rating_value: number | string | null;
  created_at: string | null;
};

type StatsLoaderData = RatingStats & {
  selectedWeek: string;
  weeks: Array<{ value: string; label: string }>;
};

export async function loader({
  request,
}: Route.LoaderArgs): Promise<StatsLoaderData> {
  const rows = (await sql(
    "SELECT rating_value, created_at FROM smajlici_rating",
  )) as RatingRow[];
  const weekValues = [
    ...new Set(
      rows
        .map((row) => getWeekStart(row.created_at))
        .filter((week): week is string => week !== null),
    ),
  ].sort((left, right) => right.localeCompare(left));
  const weeks = weekValues.map((value) => ({
    value,
    label: `Týden od ${formatWeekLabel(value)}`,
  }));
  const requestedWeek = new URL(request.url).searchParams.get("week") ?? "all";
  const selectedWeek =
    requestedWeek === "all" || weekValues.includes(requestedWeek)
      ? requestedWeek
      : "all";
  const filteredRows =
    selectedWeek === "all"
      ? rows
      : rows.filter((row) => getWeekStart(row.created_at) === selectedWeek);
  const values = filteredRows
    .map((row) => Number(row.rating_value))
    .filter((value) => Number.isInteger(value) && value >= 1 && value <= 5)
    .sort((left, right) => left - right);
  const histogram = [1, 2, 3, 4, 5].map((value) => ({ value, count: 0 }));

  if (values.length === 0) {
    return {
      average: null,
      median: null,
      modes: [],
      total: 0,
      histogram,
      selectedWeek,
      weeks,
    };
  }

  const counts = new Map<number, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  histogram.forEach((bin) => {
    bin.count = counts.get(bin.value) ?? 0;
  });
  const highestCount = Math.max(...counts.values());
  const modes = [...counts.entries()]
    .filter(([, count]) => count === highestCount)
    .map(([value]) => value);
  const middle = Math.floor(values.length / 2);
  const median =
    values.length % 2 === 0
      ? (values[middle - 1] + values[middle]) / 2
      : values[middle];

  return {
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    median,
    modes,
    total: values.length,
    histogram,
    selectedWeek,
    weeks,
  };
}

function getWeekStart(dateValue: string | null) {
  if (!dateValue) return null;

  const date = new Date(dateValue.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return null;

  const day = date.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  date.setDate(date.getDate() - daysSinceMonday);
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part) => String(part).padStart(2, "0"))
    .join("-");
}

function formatWeekLabel(weekStart: string) {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${weekStart}T00:00:00`));
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Statistiky | Smajlíci" },
    { name: "description", content: "Přehled statistik hodnocení" },
  ];
}

export default function Stats() {
  const stats = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#eaf3fb] bg-[image:linear-gradient(rgba(37,99,235,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.1)_1px,transparent_1px),radial-gradient(circle_at_12%_18%,rgba(59,130,246,0.14)_0_3px,transparent_4px),radial-gradient(circle_at_88%_76%,rgba(14,165,233,0.12)_0_4px,transparent_5px)] bg-[size:32px_32px,32px_32px,190px_190px,240px_240px] text-slate-800">
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-88px)] max-w-5xl items-center justify-center px-5 py-6 sm:px-8 sm:py-16">
        <section className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-lg shadow-slate-900/5 sm:px-10 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
            Přehled odpovědí
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            Statistiky
          </h1>
          <Form method="get" className="mt-6 flex flex-wrap items-center gap-3">
            <label
              htmlFor="week"
              className="text-sm font-semibold text-slate-500"
            >
              Období
            </label>
            <select
              id="week"
              name="week"
              defaultValue={stats.selectedWeek}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              onChange={(event) => event.currentTarget.form?.requestSubmit()}
            >
              <option value="all">Všechny týdny</option>
              {stats.weeks.map((week) => (
                <option key={week.value} value={week.value}>
                  {week.label}
                </option>
              ))}
            </select>
          </Form>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Průměr" value={stats.average} />
            <StatCard label="Medián" value={stats.median} />
            <StatCard label="Modus" value={stats.modes} />
          </div>
          <Histogram data={stats.histogram} />
          <p className="mt-6 text-center text-sm text-slate-400">
            Celkem hodnocení: {stats.total}
          </p>
        </section>
      </main>
    </div>
  );
}

function Histogram({
  data,
}: {
  data: Array<{ value: number; count: number }>;
}) {
  const highestCount = Math.max(...data.map((bin) => bin.count), 0);

  return (
    <figure className="mt-10" aria-label="Histogram hodnocení">
      <figcaption className="text-left text-sm font-semibold text-slate-500">
        Rozložení hodnocení
      </figcaption>
      <div className="mt-5 flex h-48 items-end justify-between gap-3 border-b border-slate-200 px-2 sm:gap-6">
        {data.map((bin) => {
          const height = highestCount
            ? Math.max((bin.count / highestCount) * 100, bin.count ? 8 : 2)
            : 2;

          return (
            <div
              key={bin.value}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              title={`${bin.count} ${bin.count === 1 ? "hodnocení" : "hodnocení"}`}
            >
              <span className="text-xs font-semibold text-slate-500">
                {bin.count}
              </span>
              <div
                className="w-full max-w-14 rounded-t-md bg-blue-500 transition-all"
                style={{ height: `${height}%` }}
                aria-hidden="true"
              />
              <span className="text-2xl" aria-label={`Hodnota ${bin.value}`}>
                {smileys[bin.value as keyof typeof smileys]}
              </span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | number[] | null;
}) {
  const values = value === null ? [] : Array.isArray(value) ? value : [value];

  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
      <h2 className="text-sm font-semibold text-slate-500">{label}</h2>
      {values.length > 0 ? (
        <div className="mt-3 flex items-center justify-center gap-2">
          {values.map((item) => (
            <span key={item} className="text-3xl" title={`Hodnota ${item}`}>
              {
                smileys[
                  (label === "Průměr"
                    ? Math.round(item)
                    : item) as keyof typeof smileys
                ]
              }
            </span>
          ))}
          <span className="text-xl font-bold text-slate-700">
            {values
              .map((item) =>
                label === "Průměr" ? Number(item.toFixed(3)) : item,
              )
              .join(", ")}
          </span>
        </div>
      ) : (
        <p className="mt-3 text-2xl font-bold text-slate-300">-</p>
      )}
    </article>
  );
}
