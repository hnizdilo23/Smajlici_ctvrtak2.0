import type { Route } from "./+types/home";
import { Header } from "../components/Header";
import { Rating } from "../components/Rating";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hodnotící systém" },
    { name: "description", content: " projekt hodnocení" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#eaf3fb] bg-[image:linear-gradient(rgba(37,99,235,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.1)_1px,transparent_1px),radial-gradient(circle_at_12%_18%,rgba(59,130,246,0.14)_0_3px,transparent_4px),radial-gradient(circle_at_88%_76%,rgba(14,165,233,0.12)_0_4px,transparent_5px)] bg-[size:32px_32px,32px_32px,190px_190px,240px_240px] text-slate-800">
      <Header />
      <main className="mx-auto grid min-h-[calc(100vh-88px)] max-w-5xl place-items-center px-5 py-6 sm:px-8 sm:py-16">
        <Rating />
      </main>
    </div>
  );
}
