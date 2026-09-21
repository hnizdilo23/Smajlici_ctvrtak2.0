import { useState } from "react";
import { sql } from "../server/server";
import { Emoji } from "./Emoji";

export function Rating() {
  // Stav pro kontrolu, jestli už uživatel hlasoval
  const [submitted, setSubmitted] = useState(false);
  // Stav pro uložení vybrané hodnoty
  const [selectedValue, setSelectedValue] = useState(null);

  // Pole smajlíků pro snadné vykreslení a budoucí úpravy
  const smileys = [
    { id: 5, emoji: "💩", label: "Naštvaný", value: 5 },
    { id: 4, emoji: "🙁", label: "Smutný", value: 4 },
    { id: 3, emoji: "😐", label: "Neutrální", value: 3 },
    { id: 2, emoji: "🫡", label: "Spokojený", value: 2 },
    { id: 1, emoji: "🤩", label: "Nadšený", value: 1 },
  ];

  // Funkce, která se zavolá po kliknutí na smajlíka
  const handleVote = async (value) => {
    // 1. Změníme stav UI, aby uživatel viděl poděkování hned
    setSelectedValue(value);
    setSubmitted(true);

    // 2. Pošleme data do databáze
    try {
      // Sestavíme SQL dotaz (předpokládáme sloupec rating_value, jak jsme řešili)
      const query = `INSERT INTO smajlici_rating (rating_value) VALUES (${value})`;

      // Pošleme to přes vaši školní bránu v server.js
      const result = await sql(query);

      console.log("Úspěšně zapsáno do DB:", result);
    } catch (error) {
      console.error("Něco se pokazilo při zápisu do databáze:", error);
    }
  };

  if (submitted) {
    return (
      <section
        className="w-full max-w-xl rounded-2xl border border-blue-200 bg-blue-50 px-8 py-12 text-center shadow-lg shadow-slate-900/5 sm:px-16"
        aria-live="polite"
      >
        <span className="mb-5 block text-5xl" aria-hidden="true">
          {smileys.find((smiley) => smiley.value === selectedValue)?.emoji}
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-blue-700 sm:text-4xl">
          Děkujeme za hodnocení!
        </h2>
        <p className="mt-3 leading-relaxed text-slate-500">
          Tvoje odpověď byla zaznamenána.
        </p>

        <button
          onClick={() => setSubmitted(false)}
          className="mt-7 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
        >
          Zkusit znovu
        </button>
      </section>
    );
  }

  // Výchozí stav - zobrazení smajlíků
  return (
    <section className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center shadow-lg shadow-slate-900/5 sm:px-16 sm:py-16">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
        Tvůj názor se počítá
      </p>
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-800 sm:text-5xl">
        Jaká byla dnešní hodina?
      </h1>
      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-slate-500">
        Vyber smajlika který nejlépe vystihuje tvůj pocit. Zabere to jen pár
        vteřin.
      </p>
      <div
        className="mt-9 grid grid-cols-5 gap-2 sm:gap-3"
        role="group"
        aria-label="Hodnocení hodiny"
      >
        {smileys.map((smiley) => (
          <Emoji
            key={smiley.id}
            onClick={() => handleVote(smiley.value)}
            aria-label={smiley.label}
            emoji={smiley.emoji}
          />
        ))}
      </div>
      <p className="mt-3 text-[10px] text-slate-400 sm:text-xs">
        Od naštvaného po nadšeného (1-5 jako ve škole)
      </p>
    </section>
  );
}
