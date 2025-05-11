

import { TruckImage } from "../TruckImage";

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: "100%", label: "Klanttevredenheid" },
  { value: "24/7", label: "Tracking mogelijkheden" },
  { value: "15+", label: "Jaren ervaring" },
  { value: "95%", label: "Snelle levering" },
];

export default function AboutSection() {
  return (
    <section id="over-ons" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <TruckImage
              alt="Professionele transportdienst"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">Over PriorityParcel</h2>
            <p className="text-gray-600 mb-4">
              Met jarenlange ervaring in de transportbranche bieden wij betrouwbare en professionele diensten voor al uw bezorgingsbehoeften.
            </p>
            <p className="text-gray-600 mb-6">
              Ons team staat klaar om uw goederen veilig en tijdig te bezorgen, of het nu gaat om een klein pakket of grote zending.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                  <div className="text-accent font-bold text-2xl mb-1">{stat.value}</div>
                  <div className="text-gray-700">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
