import AboutHero from "@/components/about/AboutHero";
import ValuesList from "@/components/about/ValuesList";
import Timeline from "@/components/about/Timeline";
import TeamGrid from "@/components/about/TeamGrid";
import ContactCTA from "@/components/about/ContactCTA";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <ValuesList />
      <Timeline />
      <TeamGrid />
      <ContactCTA />
    </>
  );
}
