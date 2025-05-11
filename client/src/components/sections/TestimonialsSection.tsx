interface Testimonial {
  stars: number;
  quote: string;
  name: string;
  title: string;
}

const testimonials: Testimonial[] = [
  {
    stars: 5,
    quote: "Uitstekende service van begin tot eind. Onze pakketten zijn altijd op tijd geleverd en in perfecte staat.",
    name: "Jan de Vries",
    title: "Online Retailer",
  },
  {
    stars: 5,
    quote: "PriorityParcel heeft ons geholpen onze internationale zendingen efficiënt te verzenden. Uitstekende klantenservice!",
    name: "Marie Jansen",
    title: "Export Manager",
  },
  {
    stars: 4.5,
    quote: "Betrouwbare partner voor al onze transportbehoeften. Hun spoedbezorging heeft ons meerdere keren uit de brand geholpen.",
    name: "Thomas Bakker",
    title: "Logistiek Manager",
  },
];

export default function TestimonialsSection() {
  const renderStars = (count: number) => {
    const fullStars = Math.floor(count);
    const hasHalfStar = count % 1 !== 0;
    
    return (
      <div className="text-accent">
        {[...Array(fullStars)].map((_, i) => (
          <i key={i} className="fas fa-star"></i>
        ))}
        {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
      </div>
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Wat onze klanten zeggen</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Onze klanten vertrouwen op ons voor hun transportbehoeften.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {renderStars(testimonial.stars)}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "{testimonial.quote}"
              </p>
              <div className="font-medium">
                <p className="text-primary">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
