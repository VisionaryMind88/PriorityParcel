import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

// Type voor de functies in de prijspakketten
interface PriceFeature {
  text: string;
  included: boolean;
}

// Type voor de prijspakketten
interface PricePackage {
  name: string;
  description: string;
  price: string;
  priceDetail: string;
  features: PriceFeature[];
  isPopular?: boolean;
  buttonText: string;
}

// Prijspakketten data
const pricingPackages: PricePackage[] = [
  {
    name: "Standaard",
    description: "Voor incidentele zendingen",
    price: "€9,95",
    priceDetail: "per zending",
    features: [
      { text: "Levering binnen 2-3 werkdagen", included: true },
      { text: "Online tracking", included: true },
      { text: "Maximaal gewicht 10kg", included: true },
      { text: "Verzekering tot €100", included: true },
      { text: "24/7 klantenservice", included: false },
      { text: "Doorsturen mogelijk", included: false },
    ],
    buttonText: "Offerte aanvragen",
  },
  {
    name: "Premium",
    description: "Voor regelmatige verzenders",
    price: "€14,95",
    priceDetail: "per zending",
    isPopular: true,
    features: [
      { text: "Levering volgende werkdag", included: true },
      { text: "Online tracking", included: true },
      { text: "Maximaal gewicht 25kg", included: true },
      { text: "Verzekering tot €500", included: true },
      { text: "24/7 klantenservice", included: true },
      { text: "Doorsturen mogelijk", included: false },
    ],
    buttonText: "Offerte aanvragen",
  },
  {
    name: "Zakelijk",
    description: "Voor zakelijke klanten",
    price: "Op maat",
    priceDetail: "vanaf €12,50 per zending",
    features: [
      { text: "Spoedlevering mogelijk", included: true },
      { text: "Geavanceerde tracking", included: true },
      { text: "Onbeperkt gewicht", included: true },
      { text: "Uitgebreide verzekering", included: true },
      { text: "24/7 klantenservice", included: true },
      { text: "Doorsturen mogelijk", included: true },
    ],
    buttonText: "Persoonlijke offerte",
  },
];

export default function PrijzenPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Onze prijzen
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Transparante prijzen voor al uw transportbehoeften. Kies het pakket dat bij uw situatie past of vraag een persoonlijke offerte aan voor maatwerk.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPackages.map((pkg, index) => (
                <Card 
                  key={index} 
                  className={`border ${pkg.isPopular ? 'border-accent shadow-lg relative' : 'border-gray-200'}`}
                >
                  {pkg.isPopular && (
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                      <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        Populair
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-primary">{pkg.price}</span>
                      <span className="text-gray-500 ml-2">{pkg.priceDetail}</span>
                    </div>
                    <ul className="space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className={`flex-shrink-0 h-5 w-5 ${feature.included ? 'text-accent' : 'text-gray-300'}`}>
                            <Check size={20} />
                          </div>
                          <span className={`ml-3 ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Link href="/offerte">
                      <Button 
                        className={`w-full ${pkg.isPopular ? 'bg-accent hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'}`}
                      >
                        {pkg.buttonText}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-16 bg-gray-50 rounded-lg p-8 max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Heeft u specifieke wensen?</h2>
                <p className="text-gray-600 mt-2">
                  We bieden ook op maat gemaakte oplossingen voor speciale transportbehoeften.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <Link href="/offerte">
                  <Button className="bg-accent hover:bg-accent/90 w-full md:w-auto">
                    Vrijblijvende offerte aanvragen
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="bg-white text-primary border border-primary hover:bg-gray-50 w-full md:w-auto">
                    Neem contact op
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-primary mb-6 text-center">
                Veelgestelde vragen
              </h2>
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg text-primary">Wat is er inbegrepen bij de prijs?</h3>
                  <p className="text-gray-600 mt-2">
                    Onze prijzen zijn inclusief ophalen, transport en afleveren van uw zending. Afhankelijk van het gekozen pakket is ook tracking, verzekering en spoedlevering inbegrepen.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg text-primary">Hoe werkt de verzekering?</h3>
                  <p className="text-gray-600 mt-2">
                    Elke zending is standaard verzekerd tot een bepaald bedrag, afhankelijk van het gekozen pakket. Extra verzekering kan worden aangevraagd tegen een meerprijs.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg text-primary">Zijn er extra kosten?</h3>
                  <p className="text-gray-600 mt-2">
                    Voor bijzondere diensten zoals zaterdaglevering, leveringen naar afgelegen gebieden of extra grote of zware pakketten kunnen aanvullende kosten worden berekend. Dit wordt altijd vooraf duidelijk gecommuniceerd.
                  </p>
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