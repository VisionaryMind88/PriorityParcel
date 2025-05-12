import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Truck, Box, Globe, Clock, CheckCircle, Key } from "lucide-react";

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const ServiceCard = ({ icon: Icon, title, description }: ServiceCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-gray-100">
      <div className="text-accent mb-4">
        <Icon size={36} />
      </div>
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default function DienstenPage() {
  const services = [
    {
      icon: Truck,
      title: "Nationaal Transport",
      description: "Betrouwbaar en snel transport binnen heel Nederland. Van kleine pakketten tot grote zendingen, wij zorgen voor een tijdige levering op elke locatie in Nederland."
    },
    {
      icon: Globe,
      title: "Internationaal Transport",
      description: "Zendingen naar het buitenland met nauwkeurige tracking en flexibele opties. Wij verzorgen leveringen binnen Europa met snelle doorlooptijden en concurrerende tarieven."
    },
    {
      icon: Clock,
      title: "Express Leveringen",
      description: "Spoedzendingen die dezelfde dag of de volgende dag moeten worden afgeleverd. Onze express dienst staat garant voor levering binnen de afgesproken tijdspanne, wanneer elke minuut telt."
    },
    {
      icon: Box,
      title: "Speciale Goederen",
      description: "Transport van gevoelige of buitenmaatse goederen die speciale zorg vereisen. Ons gespecialiseerde team heeft ervaring met het vervoeren van fragiele, waardevolle of ongewone items."
    },
    {
      icon: CheckCircle,
      title: "Logistieke Oplossingen",
      description: "Complete logistieke ondersteuning voor bedrijven, inclusief opslag en voorraadbeheer. Wij bieden op maat gemaakte logistieke diensten die naadloos aansluiten bij uw bedrijfsprocessen."
    },
    {
      icon: Key,
      title: "Beveiligde Transporten",
      description: "Veilig transport van waardevolle of gevoelige zendingen met extra beveiligingsmaatregelen. Voor documenten, elektronica of andere items die discretie en beveiliging vereisen."
    }
  ];

  const benefits = [
    "Betrouwbare en tijdige levering",
    "Real-time track & trace mogelijkheden",
    "Professionele en vriendelijke chauffeurs",
    "Milieubewuste transportoplossingen",
    "Flexibele opties voor elk budget",
    "Klanttevredenheid staat centraal"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Onze Transportdiensten</h1>
              <p className="text-xl mb-8">
                PriorityParcel biedt hoogwaardige transport- en logistieke diensten voor bedrijven en particulieren. 
                Ontdek onze veelzijdige dienstverlening op maat gemaakt voor uw specifieke behoeften.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">Onze Diensten</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">Hoe Wij Werken</h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-xl font-semibold mb-2">Aanvraag</h3>
                <p className="text-gray-600">Vul ons formulier in of neem telefonisch contact op</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-xl font-semibold mb-2">Offerte</h3>
                <p className="text-gray-600">Ontvang een scherpe, transparante prijsopgave</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-xl font-semibold mb-2">Planning</h3>
                <p className="text-gray-600">Wij plannen de ophaling en bezorging</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                <h3 className="text-xl font-semibold mb-2">Levering</h3>
                <p className="text-gray-600">Uw zending wordt veilig en op tijd bezorgd</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-6">Waarom kiezen voor PriorityParcel?</h2>
                  <p className="text-gray-600 mb-8">
                    Bij PriorityParcel streven we naar uitmuntendheid in elke zending die we verzorgen. 
                    Onze toewijding aan kwaliteit, betrouwbaarheid en klanttevredenheid maakt ons tot de 
                    ideale partner voor al uw transportbehoeften.
                  </p>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <div className="text-accent mr-3 mt-1">
                          <CheckCircle size={18} />
                        </div>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-bold text-primary mb-4">Vraag direct een offerte aan</h3>
                  <p className="text-gray-600 mb-6">
                    Wilt u weten wat PriorityParcel voor u kan betekenen? Vraag vrijblijvend een offerte aan 
                    en ontdek onze concurrerende tarieven en uitmuntende service.
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="/offerte"
                      className="bg-accent hover:bg-accent/90 text-white font-medium px-6 py-2 rounded-md transition-colors"
                    >
                      Offerte aanvragen
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}