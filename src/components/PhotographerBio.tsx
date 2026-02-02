const PhotographerBio = () => {
  return (
    <section className="max-w-[1600px] mx-auto px-3 md:px-5 pt-20 pb-12 md:pt-24 md:pb-16">
      <div className="space-y-4 text-center">
        <div className="flex justify-center mb-6">
          <img 
            src="/3rd-arc-logo.png" 
            alt="3rd Arc Productions" 
            className="h-24 md:h-32 w-auto"
          />
        </div>
        <h2 className="font-playfair text-4xl md:text-5xl text-foreground">
          3rd Arc Productions
        </h2>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-inter">
          CREATIVE PRODUCTION & PHOTOGRAPHY
        </p>
        <p className="text-sm text-foreground/80 max-w-2xl leading-relaxed mx-auto">
          Professional production company specializing in photography, videography, and creative content.
          Bringing your vision to life with exceptional quality and attention to detail.
        </p>
      </div>
    </section>
  );
};

export default PhotographerBio;
