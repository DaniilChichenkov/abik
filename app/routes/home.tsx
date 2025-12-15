import type { Route } from "./+types/home";

import { Header, Services, Gallery, FeedBack, Footer } from "~/components";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Abik" },
    { name: "description", content: "Welcome to Abik!" },
  ];
}

export default function Home() {
  return (
    <main>
      <Header />
      <Services />
      <Gallery />
      <FeedBack />
      <Footer />
    </main>
  );
}
