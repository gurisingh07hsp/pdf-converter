import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ToolGrid from "@/components/ToolGrid";
import SecuritySection from "@/components/SecuritySection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">
        <Hero />
        <ToolGrid />
        <SecuritySection />
      </main>
      <Footer />
    </div>
  );
}
