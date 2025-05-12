import { useRef, useEffect } from "react";
import ContactForm from "@/components/ContactForm";

interface ContactInfo {
  icon: string;
  details: string[];
}

const contactInfo: Record<string, ContactInfo> = {
  address: {
    icon: "fas fa-map-marker-alt",
    details: ["Meanderhof 97", "4337 GP Middelburg", "Nederland"],
  },
  phone: {
    icon: "fas fa-phone-alt",
    details: ["<a href='tel:+31854011028' class='hover:text-accent'>+31 (0)85 401 1028</a>", 
              "<a href='tel:+31647156687' class='hover:text-accent'>+31 (0)6 47156687</a> (spoed)"],
  },
  email: {
    icon: "fas fa-envelope",
    details: ["<a href='mailto:info@priorityparcel.nl' class='hover:text-accent'>info@priorityparcel.nl</a>"],
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
                        <p key={idx} className="text-gray-700" dangerouslySetInnerHTML={{ __html: detail }}></p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Google Maps Integration */}
            <GoogleMap address="Meanderhof 97, 4337 GP Middelburg, Nederland" />
          </div>
        </div>
      </div>
    </section>
  );
}
