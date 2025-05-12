import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { TruckImage } from "@/components/TruckImage";
import { Users, Award, Star, Clock, Truck, ShieldCheck } from "lucide-react";

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  imageSrc?: string;
}

const TeamMember = ({ name, role, bio, imageSrc }: TeamMemberProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex flex-col items-center md:flex-row md:items-start gap-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
          {imageSrc ? (
            <img src={imageSrc} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary text-white text-2xl font-bold">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-primary">{name}</h3>
          <p className="text-accent font-medium mb-2">{role}</p>
          <p className="text-gray-600">{bio}</p>
        </div>
      </div>
    </div>
  );
};

interface ValueCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const ValueCard = ({ icon: Icon, title, description }: ValueCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="text-accent mb-4">
        <Icon size={28} />
      </div>
      <h3 className="text-lg font-bold text-primary mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default function OverOnsPage() {
  const stats = [
    { value: "1200+", label: "Tevreden klanten" },
    { value: "98%", label: "Op tijd geleverd" },
    { value: "10+", label: "Jaar ervaring" },
    { value: "25K+", label: "Succesvolle leveringen" },
  ];

  const values = [
    {
      icon: Clock,
      title: "Stiptheid",
      description: "Wij begrijpen dat tijd kostbaar is. Daarom garanderen wij stipte leveringen conform afspraak."
    },
    {
      icon: ShieldCheck,
      title: "Betrouwbaarheid",
      description: "Op ons kunt u rekenen. We doen wat we beloven en communiceren transparant."
    },
    {
      icon: Truck,
      title: "Vakmanschap",
      description: "Onze chauffeurs en logistieke experts zijn hoogopgeleid en werken met de grootste zorg."
    },
    {
      icon: Star,
      title: "Kwaliteit",
      description: "We streven naar perfectie in elke zending, groot of klein, nationaal of internationaal."
    },
  ];

  const teamMembers = [
    {
      name: "Mert Telli",
      role: "Oprichter & CEO",
      bio: "Mert heeft meer dan 15 jaar ervaring in de transportwereld en richtte PriorityParcel op met een visie om transportdiensten persoonlijker en efficiënter te maken."
    },
    {
      name: "Michael Dizdarevic",
      role: "Operations Manager",
      bio: "Met zijn scherpe logistieke inzicht zorgt Michael ervoor dat elke zending op de meest efficiënte manier wordt gepland en uitgevoerd."
    },
    {
      name: "Martijn Jansen",
      role: "Hoofd Klantenservice",
      bio: "Martijn en zijn team staan klaar om alle vragen te beantwoorden en ervoor te zorgen dat klanten de best mogelijke ervaring hebben."
    },
  ];

  const milestones = [
    { year: "2015", event: "Oprichting PriorityParcel met focus op lokale bezorging" },
    { year: "2017", event: "Uitbreiding naar nationale leveringen in heel Nederland" },
    { year: "2019", event: "Start internationale diensten binnen Europa" },
    { year: "2021", event: "Introductie van Track & Trace systeem voor realtime zendingsinformatie" },
    { year: "2023", event: "Verhuizing naar nieuw, duurzaam hoofdkantoor in Middelburg" },
    { year: "2025", event: "Lancering van vernieuwde website en uitgebreide dienstverlening" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Over PriorityParcel</h1>
              <p className="text-xl mb-8">
                Uw vertrouwde partner in transport en logistiek. Leer ons beter kennen en ontdek
                waarom bedrijven en particulieren kiezen voor onze diensten.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-6">Ons Verhaal</h2>
                <p className="text-gray-600 mb-4">
                  PriorityParcel ontstond in 2015 vanuit een passie voor efficiënte en betrouwbare bezorgdiensten. 
                  Wat begon als een klein lokaal bedrijf, is uitgegroeid tot een toonaangevende speler in de 
                  Nederlandse transportmarkt.
                </p>
                <p className="text-gray-600 mb-4">
                  Onze oprichter, Mert Telli, was gefrustreerd over de onpersoonlijke en vaak onbetrouwbare 
                  dienstverlening in de transportsector. Hij besloot een bedrijf te starten dat zich zou onderscheiden 
                  door betrouwbaarheid, transparantie en persoonlijke service.
                </p>
                <p className="text-gray-600">
                  Vandaag de dag is PriorityParcel een hecht team van logistieke experts die zich elke dag inzetten 
                  om uw zendingen veilig en op tijd te bezorgen. We blijven groeien en innoveren, maar onze kernwaarden 
                  blijven onveranderd.
                </p>
              </div>
              <div className="order-first md:order-last">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <TruckImage className="w-full h-auto" alt="PriorityParcel Transport" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-accent mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">Onze Kernwaarden</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <ValueCard
                  key={index}
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">Ons Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {teamMembers.map((member, index) => (
                <TeamMember
                  key={index}
                  name={member.name}
                  role={member.role}
                  bio={member.bio}
                />
              ))}
            </div>
            <div className="text-center mt-12">
              <p className="text-gray-600 max-w-2xl mx-auto">
                Achter PriorityParcel staat een enthousiast team van meer dan 25 professionals, 
                van chauffeurs tot klantenservice en logistieke experts. Samen zorgen 
                wij ervoor dat uw zendingen in goede handen zijn.
              </p>
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">Onze Mijlpalen</h2>
            <div className="max-w-3xl mx-auto">
              <div className="relative border-l-2 border-primary pl-8 ml-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="mb-10 relative">
                    {/* Dot on timeline */}
                    <div className="absolute w-4 h-4 bg-accent rounded-full -left-10 mt-1.5 border-2 border-white"></div>
                    <div className="font-bold text-xl text-accent mb-1">{milestone.year}</div>
                    <div className="text-gray-700">{milestone.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}