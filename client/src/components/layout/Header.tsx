import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Logo } from "../Logo";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Diensten", href: "/diensten" },
  { label: "Over Ons", href: "/over-ons" },
  { label: "Prijzen", href: "/prijzen" },
  { label: "Contact", href: "/contact" },
];

const actionLinks: NavLink[] = [
  { label: "Track & Trace", href: "/track-and-trace" },
  { label: "Offerte", href: "/offerte" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Als het een interne link met hash is (naar een sectie op de pagina)
    if (href.startsWith('/#')) {
      e.preventDefault();
      
      if (window.location.pathname !== '/') {
        // Als we niet op de homepagina zijn, navigeren we eerst daarheen
        window.location.href = href;
        return;
      }
      
      // We zijn op de homepagina, dus scroll naar het element
      const elementId = href.substring(2); // Verwijder '/#'
      const element = document.getElementById(elementId);
      
      if (element) {
        const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
        if (isMenuOpen) setIsMenuOpen(false);
      }
      return;
    }
    
    // Als het een interne paginalink is zonder hash, laat normal navigatie toe
    if (href.startsWith('/') && !href.includes('#')) {
      // Normaal navigeren naar de pagina
      return;
    }
    
    // Voor externe links of andere gevallen
    e.preventDefault();
    window.location.href = href;
  };

  return (
    <header className={`bg-white shadow-md sticky top-0 z-50 transition-all ${scrolled ? "py-2" : "py-4"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-auto">
                <Logo />
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-primary hover:text-secondary font-medium transition duration-150"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            
            <div className="flex space-x-3">
              {actionLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`${link.label === "Offerte" ? "bg-accent" : "bg-primary"} text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity`}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-primary hover:text-secondary focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <i className="fas fa-times text-2xl"></i>
              ) : (
                <i className="fas fa-bars text-2xl"></i>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-primary hover:text-secondary font-medium px-2 py-1 rounded"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-gray-200">
                {actionLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`${link.label === "Offerte" ? "bg-accent" : "bg-primary"} text-white px-4 py-2 rounded-md block my-3 text-center`}
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
