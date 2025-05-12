import { useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail, Clock, Truck, MessageSquare, HelpCircle } from "lucide-react";

interface ContactInfoItemProps {
  icon: React.ElementType;
  title: string;
  details: string[];
}

const ContactInfoItem = ({ icon: Icon, title, details }: ContactInfoItemProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <div className="text-accent mr-3">
          <Icon size={24} />
        </div>
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
      </div>
      <div className="pl-9">
        {details.map((detail, index) => (
          <p key={index} className="text-gray-700 mb-1">{detail}</p>
        ))}
      </div>
    </div>
  );
};

interface GoogleMapsProps {
  address: string;
}

// Google Maps component
const GoogleMap = ({ address }: GoogleMapsProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Real Google Maps integration using iframe
    if (mapRef.current) {
      const mapDiv = mapRef.current;
      
      // Embedded Google Maps iframe with the specific address
      const encodedAddress = encodeURIComponent(address);
      mapDiv.innerHTML = `
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2486.0839958918696!2d3.6062611!3d51.4567899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c490d15d9d9573%3A0xfafe20bf18cc0f9d!2sMeanderhof%2097%2C%204337%20GP%20Middelburg!5e0!3m2!1snl!2snl!4v1652343452368!5m2!1snl!2snl"
          width="100%" 
          height="100%" 
          style="border:0;" 
          allowfullscreen="" 
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      `;
    }
  }, [address]);

  return (
    <div ref={mapRef} className="rounded-lg shadow-md overflow-hidden h-96 relative">
      {/* Google Maps will be rendered here */}
    </div>
  );
};

export default function ContactPage() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Adres",
      details: ["Meanderhof 97", "4337 GP Middelburg", "Nederland"]
    },
    {
      icon: Phone,
      title: "Telefoon",
      details: ["+31 (0)20 123 4567", "+31 (0)6 12345678 (spoed)"]
    },
    {
      icon: Mail,
      title: "E-mail",
      details: ["info@priorityparcel.nl", "service@priorityparcel.nl"]
    },
    {
      icon: Clock,
      title: "Openingstijden",
      details: [
        "Maandag - Vrijdag: 08:00 - 18:00",
        "Zaterdag: 09:00 - 14:00",
        "Zondag: Gesloten"
      ]
    }
  ];

  const faqItems = [
    {
      question: "Hoe kan ik een prijsopgave krijgen voor een zending?",
      answer: "U kunt een prijsopgave krijgen door ons contactformulier in te vullen, telefonisch contact op te nemen of door gebruik te maken van onze online offerte-tool op de prijzen pagina."
    },
    {
      question: "Hoe kan ik mijn zending volgen?",
      answer: "Zodra uw zending is opgehaald, ontvangt u een tracking code. Met deze code kunt u via onze Track & Trace pagina de actuele status van uw zending volgen."
    },
    {
      question: "Welke betalingsmethoden accepteren jullie?",
      answer: "Wij accepteren verschillende betalingsmethoden, waaronder bankoverschrijving, iDEAL, creditcard en PayPal. Voor zakelijke klanten bieden we ook de mogelijkheid om op rekening te betalen."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Neem Contact Met Ons Op</h1>
              <p className="text-xl mb-8">
                Heeft u vragen of wilt u een offerte aanvragen? Wij staan voor u klaar en 
                zorgen ervoor dat u zo snel mogelijk een antwoord krijgt.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form and Info Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-6">Stuur Ons Een Bericht</h2>
                <p className="text-gray-600 mb-8">
                  Vul het formulier in en wij nemen zo snel mogelijk contact met u op. Meestal reageren 
                  wij binnen één werkdag op alle verzoeken.
                </p>
                <ContactForm />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-primary mb-6">Contactgegevens</h2>
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm mb-8">
                  {contactInfo.map((item, index) => (
                    <ContactInfoItem
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      details={item.details}
                    />
                  ))}
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <a
                    href="/offerte"
                    className="bg-accent hover:bg-accent/90 text-white font-medium px-4 py-2 rounded-md transition-colors flex-1 flex items-center justify-center"
                  >
                    <MessageSquare className="mr-2" size={18} />
                    Offerte aanvragen
                  </a>
                  <a
                    href="/track-and-trace"
                    className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-md transition-colors flex-1 flex items-center justify-center"
                  >
                    <Truck className="mr-2" size={18} />
                    Zending volgen
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">Ons Kantoor Vinden</h2>
            <div className="max-w-5xl mx-auto">
              <GoogleMap address="Meanderhof 97, 4337 GP Middelburg, Nederland" />
              <div className="bg-white p-4 rounded-b-lg shadow-sm text-center">
                <p className="text-gray-600">
                  Meanderhof 97, 4337 GP Middelburg, Nederland
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <HelpCircle className="text-accent mr-3" size={24} />
                <h2 className="text-2xl font-bold text-primary">Veelgestelde Vragen</h2>
              </div>
              
              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-primary mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Heeft u een andere vraag? Neem gerust contact met ons op via 
                  <a href="mailto:info@priorityparcel.nl" className="text-accent hover:underline mx-1">info@priorityparcel.nl</a>
                  of bel
                  <a href="tel:+31201234567" className="text-accent hover:underline mx-1">+31 (0)20 123 4567</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}