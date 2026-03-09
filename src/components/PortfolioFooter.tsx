import { Instagram, Linkedin, Facebook } from "lucide-react";
import { openInstagram } from "@/utils/instagram";

const PortfolioFooter = () => {
  return (
    <footer className="max-w-[1600px] mx-auto px-3 md:px-5 pb-16 font-[Times_New_Roman]">
      <div className="text-center text-[10px] uppercase tracking-widest font-inter text-muted-foreground">
        <a
          href="https://www.linkedin.com/company/3rd-arc-productions/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          <Linkedin className="w-3 h-3" />
          Linkedin
        </a>
        <span className="mx-2">/</span>
        <a
          href="https://www.facebook.com/profile.php?id=61584661573395#"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          <Facebook className="w-3 h-3" />
          Facebook
        </a>
        <span className="mx-2">/</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            openInstagram('3rdarcproductions');
          }}
          className="hover:text-foreground transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <Instagram className="w-3 h-3" />
          I: @3rdarcproductions
        </button>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
