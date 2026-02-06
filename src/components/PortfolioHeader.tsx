import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import FocusTrap from "focus-trap-react";
import { TextRoll } from "@/components/ui/text-roll";

interface PortfolioHeaderProps {
  activeCategory: string;
}

const categories = [
  "SELECTED",
  "COMMISSIONED",
  "PERSONAL",
  "PLACES",
];

const PortfolioHeader = ({ activeCategory }: PortfolioHeaderProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50" style={{ contain: 'layout style paint' }}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between md:justify-center px-3 md:px-5 py-3 gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-foreground/70 hover:text-foreground transition-colors"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={22} />
          </button>

          {/* Mobile Logo */}
          <Link to="/" className="md:hidden flex-1 text-center">
            <span className="text-sm font-inter tracking-widest text-foreground">3RD ARC</span>
          </Link>

          {/* Spacer for mobile layout balance */}
          <div className="md:hidden w-10"></div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/category/${category.toLowerCase()}`}
              onMouseEnter={() => setHoveredItem(category)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`text-[10px] md:text-[11px] uppercase tracking-widest font-inter transition-colors whitespace-nowrap ${
                activeCategory === category
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground/80"
              }`}
            >
              {hoveredItem === category ? (
                <TextRoll duration={0.3} getEnterDelay={(i) => i * 0.02} getExitDelay={(i) => i * 0.02}>
                  {category}
                </TextRoll>
              ) : (
                category
              )}
            </Link>
          ))}
          
          <Link
            to="/about"
            className="text-[10px] md:text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-inter whitespace-nowrap"
            onMouseEnter={() => setHoveredItem('about')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {hoveredItem === 'about' ? (
              <TextRoll duration={0.3} getEnterDelay={(i) => i * 0.02} getExitDelay={(i) => i * 0.02}>
                ABOUT
              </TextRoll>
            ) : (
              "ABOUT"
            )}
          </Link>
        </div>
      </div>
      </header>
      
      {/* Mobile Menu Overlay - Rendered outside header for proper z-index */}
      {mobileMenuOpen && (
        <FocusTrap>
          <div
            className="fixed inset-0 bg-background z-[9999] flex flex-col"
            style={{ display: 'flex' }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Close Button */}
            <div className="flex justify-end p-5 border-b border-border/50 bg-background">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-foreground hover:text-foreground/70 transition-colors"
                aria-label="Close navigation menu"
              >
                <X size={24} strokeWidth={2} />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col items-center gap-6 px-8 pt-16 bg-background overflow-y-auto">
              {/* Categories */}
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg uppercase tracking-widest font-inter transition-colors ${
                    activeCategory === category
                      ? "text-foreground font-semibold"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {category}
                </Link>
              ))}

              {/* Separator */}
              <div className="w-20 h-px bg-foreground/20 my-2"></div>

              {/* Page Links */}
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg uppercase tracking-widest text-foreground/70 hover:text-foreground transition-colors font-inter"
              >
                ABOUT
              </Link>
            </nav>
          </div>
        </FocusTrap>
      )}
    </>
  );
};

export default PortfolioHeader;
