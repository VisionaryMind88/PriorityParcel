import { useRef, useEffect } from "react";
import ContactForm from "@/components/ContactForm";

interface ContactInfo {
  icon: string;
  details: string[];
}

const contactInfo: Record<string, ContactInfo> = {
  address: {
    icon: "fas fa-map-marker-alt",
    details: ["Transportweg 123", "1234 AB Amsterdam", "Nederland"],
  },
  phone: {
    icon: "fas fa-phone-alt",
    details: ["+31 (0)20 123 4567"],
  },
  email: {
    icon: "fas fa-envelope",
    details: ["info@priorityparcel.nl"],
  },
  hours: {
    icon: "fas fa-clock",
    details: [
      "Maandag - Vrijdag: 08:00 - 18:00",
      "Zaterdag: 09:00 - 14:00",
      "Zondag: Gesloten",
    ],
  },
};

interface GoogleMapsProps {
  address: string;
}

// Google Maps component
const GoogleMap = ({ address }: GoogleMapsProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This would be replaced with actual Google Maps integration in production
    // The script would be loaded from Google's CDN and initialized with an API key
    if (mapRef.current) {
      const mapDiv = mapRef.current;
      
      // Simple placeholder for the Google Maps
      mapDiv.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full bg-gray-200 text-gray-500">
          <i class="fas fa-map-marked-alt text-4xl mb-2"></i>
          <p>Google Maps integratie: ${address}</p>
        </div>
      `;
    }
  }, [address]);

  return (
    <div ref={mapRef} className="rounded-lg shadow-md overflow-hidden h-64 relative">
      {/* Google Maps will be rendered here */}
    </div>
  );
};

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Neem contact met ons op</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Heeft u vragen of wilt u een offerte aanvragen? Vul het formulier in en we nemen zo snel mogelijk contact met u op.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <ContactForm />
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-primary mb-4">Contactgegevens</h3>
              
              <div className="space-y-4">
                {Object.entries(contactInfo).map(([key, info]) => (
                  <div key={key} className="flex items-start">
                    <div className="text-secondary mt-1 mr-3">
                      <i className={`${info.icon} text-xl`}></i>
                    </div>
                    <div>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-700">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Google Maps Integration */}
            <GoogleMap address="Transportweg 123, 1234 AB Amsterdam, Nederland" />
          </div>
        </div>
      </div>
    </section>
  );
}
