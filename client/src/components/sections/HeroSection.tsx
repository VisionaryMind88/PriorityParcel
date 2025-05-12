import { Button } from "@/components/ui/button";
import deliveryVanImage from "../../assets/delivery-van.jpg";

export default function HeroSection() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="home" className="relative bg-primary text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Betrouwbare en professionele transportdiensten
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              Waar een auto of bestelbus pakketten, goederen snel en zorgvuldig kan afleveren.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#contact"
                className="bg-accent hover:bg-opacity-90 text-white font-medium py-3 px-6 rounded-lg shadow transition duration-150 text-center"
                onClick={(e) => handleNavClick(e, "#contact")}
              >
                Vraag direct een offerte aan
              </a>
              <a
                href="#diensten"
                className="bg-white text-primary hover:bg-gray-100 font-medium py-3 px-6 rounded-lg shadow transition duration-150 text-center"
                onClick={(e) => handleNavClick(e, "#diensten")}
              >
                Bekijk onze diensten
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src={deliveryVanImage}
              alt="Bezorgdienst in actie"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
