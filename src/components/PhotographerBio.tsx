const PhotographerBio = () => {
  return (
    <section className="max-w-[1600px] mx-auto px-3 md:px-5 pt-20 pb-12 md:pt-24 md:pb-16" style={{ contain: 'content' }}>
      <div className="space-y-4 text-center">
        <div className="flex justify-center mb-6">
          <img 
            src="/3rd-arc-logo.png" 
            alt="3rd Arc Productions" 
            className="h-32 md:h-40 w-auto"
            loading="eager"
            decoding="async"
          />
        </div>
        <h2 className="font-playfair text-4xl md:text-5xl text-foreground">
          3rd Arc Productions
        </h2>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-inter">
          PROFESSIONAL VIDEOGRAPHY & CREATIVE PRODUCTION
        </p>
        <p className="text-sm text-foreground/80 max-w-2xl leading-relaxed mx-auto">
          Leading videography and production company specializing in cinematic content creation, brand videos, 
          and commercials. Bringing your vision to life through compelling visual storytelling with exceptional 
          quality and creative direction.
        </p>
      </div>
    </section>
  );
};

export default PhotographerBio;
