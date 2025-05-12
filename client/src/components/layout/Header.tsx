import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { User, LogIn } from "lucide-react";
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
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

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
    <header className={`bg-primary text-white shadow-md sticky top-0 z-50 transition-all ${scrolled ? "py-2" : "py-4"}`}>
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
                className="text-white hover:text-gray-200 font-medium transition duration-150"
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
                  className={`${link.label === "Offerte" ? "bg-accent" : "bg-white"} ${link.label === "Offerte" ? "text-white" : "text-primary"} px-4 py-2 rounded-md hover:opacity-90 transition-opacity`}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-white text-primary px-3 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center space-x-1"
                  >
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => logout()}
                    className="text-white px-3 py-2 rounded-md hover:bg-blue-400 transition-colors"
                  >
                    Uitloggen
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-white text-primary px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center space-x-1"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Inloggen</span>
                </button>
              )}
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-white hover:text-gray-200 focus:outline-none"
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
                  className="text-white hover:text-gray-200 font-medium px-2 py-1 rounded"
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
                    className={`${link.label === "Offerte" ? "bg-accent" : "bg-white"} ${link.label === "Offerte" ? "text-white" : "text-primary"} px-4 py-2 rounded-md block my-3 text-center`}
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                ))}
                
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2 mt-4">
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setIsMenuOpen(false);
                      }}
                      className="bg-white text-primary px-3 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center space-x-1"
                    >
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-white border border-white px-3 py-2 rounded-md hover:bg-blue-400 transition-colors"
                    >
                      Uitloggen
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="bg-white text-primary px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center space-x-1 w-full my-3"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Inloggen</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
