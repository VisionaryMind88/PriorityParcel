import { Link } from "wouter";

interface Service {
  icon: string;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: "fas fa-box-open",
    title: "Pakketbezorging",
    description: "Snelle en betrouwbare bezorging van pakketten voor particulieren en bedrijven.",
  },
  {
    icon: "fas fa-globe-europe",
    title: "Internationale Bezorging",
    description: "Wereldwijde bezorgdiensten met tracking en betrouwbare aflevering.",
  },
  {
    icon: "fas fa-truck",
    title: "Spoedbezorging",
    description: "Spoedlevering voor dringende zendingen met garantie op snelle aflevering.",
  },
];

export default function ServicesSection() {
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
    <section id="diensten" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Onze Diensten</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Wij bieden flexibele en betrouwbare transportoplossingen aangepast aan uw specifieke behoeften.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg"
            >
              <div className="text-secondary mb-4">
                <i className={`${service.icon} text-4xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              <a
                href="#contact"
                className="text-secondary hover:text-accent font-medium inline-flex items-center"
                onClick={(e) => handleNavClick(e, "#contact")}
              >
                Meer informatie <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
