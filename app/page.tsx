import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Pillars } from "@/components/home/Pillars";
import { Services } from "@/components/home/Services";
import { Founder } from "@/components/home/Founder";
import { Summit } from "@/components/home/Summit";
import { Courses } from "@/components/home/Courses";
import { Bestsellers } from "@/components/home/Bestsellers";
import { Results } from "@/components/home/Results";
import { Reviews } from "@/components/home/Reviews";
import { Journal } from "@/components/home/Journal";
import { Visit } from "@/components/home/Visit";
import { JsonLd } from "@/components/seo/JsonLd";
import { productRepository } from "@/data/repository";
import { clientReviews } from "@/data/reviews";
import { localBusinessJsonLd } from "@/lib/seo";

export default async function Home() {
  const [bestsellers, spotlight] = await Promise.all([
    productRepository.bestsellers(8),
    productRepository.get("neo-lash-tweezers"),
  ]);

  return (
    <>
      <Hero />
      <Manifesto />
      <Pillars />
      <Services />
      <Founder />
      <Summit />
      <Courses />
      <Bestsellers products={bestsellers} spotlight={spotlight} />
      <Results />
      <Reviews />
      <Journal />
      <Visit />
      <JsonLd data={localBusinessJsonLd(clientReviews)} />
    </>
  );
}
