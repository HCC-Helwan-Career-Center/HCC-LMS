import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import TracksSection from "@/components/landing/TracksSection";
import ProjectLearning from "@/components/landing/ProjectLearning";
import GitHubSection from "@/components/landing/GitHubSection";
import StatsBar from "@/components/landing/StatsBar";
import EventsSection from "@/components/landing/EventsSection";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TracksSection />
        <ProjectLearning />
        <GitHubSection />
        <StatsBar />
        <EventsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
