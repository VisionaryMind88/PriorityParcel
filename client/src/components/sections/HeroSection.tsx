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
    <section id="home" className="relative text-white h-[60vh] flex flex-col justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${deliveryVanImage})` }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Betrouwbare en professionele transportdiensten
          </h1>
          <p className="text-lg md:text-xl mb-6 text-gray-100">
            Waar een auto of bestelbus pakketten, goederen snel en zorgvuldig kan afleveren.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="#contact"
              className="bg-primary hover:bg-opacity-90 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition duration-150 text-center"
              onClick={(e) => handleNavClick(e, "#contact")}
            >
              Vraag direct een offerte aan
            </a>
            <a
              href="#diensten"
              className="bg-white text-primary hover:bg-gray-100 font-medium py-3 px-6 rounded-lg shadow-lg transition duration-150 text-center"
              onClick={(e) => handleNavClick(e, "#diensten")}
            >
              Bekijk onze diensten
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center animate-bounce">
        <a 
          href="#diensten"
          onClick={(e) => handleNavClick(e, "#diensten")}
          className="text-white opacity-80 hover:opacity-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </a>
      </div>
    </section>
  );
}
