import { openInstagram } from "@/utils/instagram";

const PortfolioFooter = () => {
  return (
    <footer className="max-w-[1600px] mx-auto px-3 md:px-5 pb-16">
      <div className="text-center text-[10px] uppercase tracking-widest font-inter text-muted-foreground">
        <a
          href="mailto:3rdarcproductions@gmail.com"
          className="hover:text-foreground transition-colors"
        >
          E: 3rdarcproductions@gmail.com
        </a>
        <span className="mx-2">/</span>
        <a
          href="tel:+17059705244"
          className="hover:text-foreground transition-colors"
        >
          M: +1 (705) 970-5244
        </a>
        <span className="mx-2">/</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            openInstagram('3rdarcproductions');
          }}
          className="hover:text-foreground transition-colors cursor-pointer"
        >
          I: @3rdarcproductions
        </button>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
