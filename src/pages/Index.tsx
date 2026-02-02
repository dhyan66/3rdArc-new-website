import { useState, useEffect } from "react";
import PortfolioHeader from "@/components/PortfolioHeader";
import PhotographerBio from "@/components/PhotographerBio";
import PortfolioFooter from "@/components/PortfolioFooter";
import MasonryGallery from "@/components/MasonryGallery";
import Lightbox from "@/components/Lightbox";
import SEO from "@/components/SEO";
import { fetchMixedMedia } from "@/services/pexels";

const Index = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [displayImages, setDisplayImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Homepage always shows SELECTED category
  const activeCategory = "SELECTED";

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMixedMedia(activeCategory, 1, 20);
        setDisplayImages(data.items);
      } catch (err) {
        console.error('Error fetching Pexels media:', err);
        setError('Failed to load images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []); // Remove activeCategory dependency - it's now constant

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "3rd Arc Productions",
    "description": "Professional production company specializing in photography, videography, and creative content. Bringing your vision to life with exceptional quality and attention to detail.",
    "url": "https://3rdarcproductions.com",
    "image": "https://3rdarcproductions.com/og-image.jpg",
    "sameAs": [
      "https://instagram.com/3rdarcproductions"
    ],
    "knowsAbout": [
      "Photography",
      "Videography",
      "Creative Production",
      "Commercial Content",
      "Brand Content"
    ]
  };

  return (
    <>
      <SEO
        title="3rd Arc Productions - Creative Production & Photography"
        description="Professional production company specializing in photography, videography, and creative content. Bringing your vision to life with exceptional quality and attention to detail."
        canonicalUrl="/"
        ogType="website"
        jsonLd={jsonLd}
      />

      <PortfolioHeader
        activeCategory={activeCategory}
      />
      
      <main>
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
    </>
  );
};

export default Index;
