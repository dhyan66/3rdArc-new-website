import { useState, useEffect } from "react";
import PortfolioHeader from "@/components/PortfolioHeader";
import PhotographerBio from "@/components/PhotographerBio";
import PortfolioFooter from "@/components/PortfolioFooter";
import MasonryGallery from "@/components/MasonryGallery";
import Lightbox from "@/components/Lightbox";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { getLocalGalleryImages } from "@/services/local-gallery";

const Index = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [displayImages, setDisplayImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Homepage always shows SELECTED category
  const activeCategory = "SELECTED";

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      const items = getLocalGalleryImages(activeCategory);
      setDisplayImages(items);
    } catch (err) {
      console.error('Error loading local gallery images:', err);
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []); // Remove activeCategory dependency - it's now constant

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "3rd Arc Productions",
    "description": "Professional videography and production company specializing in cinematic content creation, brand videos, commercials, and creative storytelling. Bringing your vision to life through exceptional quality and compelling visual narratives.",
    "url": "https://3rdarcproductions.com",
    "image": "https://3rdarcproductions.com/og-image.jpg",
    "sameAs": [
      "https://instagram.com/3rdarcproductions"
    ],
    "knowsAbout": [
      "Videography",
      "Video Production",
      "Cinematography",
      "Brand Videos",
      "Commercial Production",
      "Creative Direction",
      "Content Creation"
    ]
  };

  return (
    <>
      <SEO
        title="3rd Arc Productions - Professional Videography & Creative Production"
        description="Professional videography and production company specializing in cinematic content creation, brand videos, commercials, and creative storytelling. Bringing your vision to life through exceptional quality and compelling visual narratives."
        canonicalUrl="/"
        ogType="website"
        jsonLd={jsonLd}
      />

      <PortfolioHeader
        activeCategory={activeCategory}
      />
      
      <PageTransition>
        <main style={{ contain: 'layout style paint' }}>
          <PhotographerBio />

          {error && (
            <div className="text-center py-20">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {!error && displayImages.length > 0 && (
            <MasonryGallery
              images={displayImages}
              onImageClick={handleImageClick}
            />
          )}

          {!loading && !error && displayImages.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No images found in this category.</p>
            </div>
          )}
        </main>

        {lightboxOpen && displayImages.length > 0 && (
          <Lightbox
            images={displayImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
          />
        )}

        <PortfolioFooter />
      </PageTransition>
    </>
  );
};

export default Index;
