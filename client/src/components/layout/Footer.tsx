import { Link } from "wouter";

interface FooterLink {
  label: string;
  href: string;
}

const quickLinks: FooterLink[] = [
  { label: "Home", href: "#home" },
  { label: "Diensten", href: "#diensten" },
  { label: "Over Ons", href: "#over-ons" },
  { label: "Contact", href: "#contact" },
];

const serviceLinks: FooterLink[] = [
  { label: "Pakketbezorging", href: "#diensten" },
  { label: "Internationale Bezorging", href: "#diensten" },
  { label: "Spoedbezorging", href: "#diensten" },
  { label: "Zakelijke diensten", href: "#diensten" },
];

const socialLinks = [
  { icon: "fab fa-facebook-f", href: "#", label: "Facebook" },
  { icon: "fab fa-twitter", href: "#", label: "Twitter" },
  { icon: "fab fa-linkedin-in", href: "#", label: "LinkedIn" },
  { icon: "fab fa-instagram", href: "#", label: "Instagram" },
];

export default function Footer() {
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the email to the server
    alert("Bedankt voor uw inschrijving voor de nieuwsbrief!");
  };

  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PriorityParcel</h3>
            <p className="text-gray-300 mb-4">
              Professionele en betrouwbare transportdiensten voor al uw bezorgingsbehoeften.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition duration-150"
                  aria-label={link.label}
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Snelle links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition duration-150"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Diensten</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition duration-150"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Nieuwsbrief</h3>
            <p className="text-gray-300 mb-4">
              Schrijf u in voor onze nieuwsbrief om op de hoogte te blijven van onze diensten.
            </p>
            <form className="flex" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Uw e-mailadres"
                className="px-4 py-2 w-full rounded-l-md focus:outline-none text-gray-900"
                required
              />
              <button
                type="submit"
                className="bg-accent hover:bg-opacity-90 text-white px-4 rounded-r-md transition duration-150"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} PriorityParcel. Alle rechten voorbehouden.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-white text-sm transition duration-150">
              Privacybeleid
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition duration-150">
              Algemene voorwaarden
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition duration-150">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
