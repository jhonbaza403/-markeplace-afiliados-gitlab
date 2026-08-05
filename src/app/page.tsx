import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header />
        <Navbar />
        <Hero />
        <ProductGrid />
      </div>
      <Footer />
    </div>
  );
}