import { useState, useEffect, useRef, useMemo, memo } from "react";
import { motion } from "motion/react";

interface GalleryItem {
  type?: "image" | "video";
  src: string;
  videoSrc?: string;
  highResSrc?: string;
  alt: string;
  photographer?: string;
  client?: string;
  location?: string;
  details?: string;
  span?: number;
  width?: number;
  height?: number;
}

interface MasonryGalleryProps {
  images: GalleryItem[];
  onImageClick: (index: number) => void;
}

const MasonryGallery = memo(({ images, onImageClick }: MasonryGalleryProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const imageRefs = useRef<Array<HTMLElement | null>>([]);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  const handleImageHover = useMemo(() => {
    return (index: number) => {
      setHoveredIndex(index);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setHoveredIndex(null);
      }, 2800);
    };
  }, []);

  const handleImageLeave = () => {
    // Don't reset hoveredIndex on mouse leave, let the timer handle it
  };

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Intersection Observer for lazy loading and video autoplay
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = parseInt(entry.target.getAttribute('data-index') || '0');
        
        if (entry.isIntersecting) {
          setVisibleImages(prev => new Set(prev).add(index));
          const video = videoRefs.current[index];
          if (video) {
            video.play().catch(() => undefined);
          }
        } else {
          const video = videoRefs.current[index];
          if (video) {
            video.pause();
          }
        }
      });
    }, observerOptions);

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [images.length]);

  return (
    <div className="max-w-[1600px] mx-auto md:px-5 pb-16">
      <div className="gallery-hover-container text-center">
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            ref={(el) => { imageRefs.current[index] = el; }}
            data-index={index}
            onClick={() => onImageClick(index)}
            onMouseEnter={() => handleImageHover(index)}
            onMouseLeave={handleImageLeave}
            className="relative cursor-zoom-in gallery-image inline-block align-top will-change-transform"
          >
            <div className="relative w-full overflow-hidden">
              {(() => {
                if (image.type === "video") {
                  const poster = image.src && image.src !== "" ? image.src : undefined;
                  return (
                    <div className="relative w-full">
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        poster={poster}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        disablePictureInPicture
                        onLoadedMetadata={() => handleImageLoad(index)}
                        onCanPlayThrough={() => handleImageLoad(index)}
                        className={`block w-full h-auto object-contain transition-all duration-400 ${
                          hoveredIndex !== null && hoveredIndex !== index
                            ? "grayscale"
                            : ""
                        }`}
                      >
                        <source src={image.videoSrc} type="video/mp4" />
                      </video>
                    </div>
                  );
                }

                return (
                  <picture
                    className={`block w-full h-auto ${
                      loadedImages.has(index) ? "show" : ""
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      onLoad={() => handleImageLoad(index)}
                      className={`block h-auto w-full object-contain transition-all duration-400 ${
                        hoveredIndex !== null && hoveredIndex !== index
                          ? "grayscale"
                          : ""
                      }`}
                      style={{
                        opacity: loadedImages.has(index) ? 1 : 0,
                        transition: "opacity 0.4s ease-out",
                      }}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                );
              })()}
              {image.photographer && image.client && (
                <motion.div
                  className="absolute bottom-0 left-0 w-full pointer-events-none"
                  animate={hoveredIndex === index ? "visible" : "hidden"}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="flex flex-col items-center gap-0 px-4 py-3 text-center">
                    <p className="text-base font-medium text-white">
                      For {image.client}
                    </p>
                    <span className="text-xs text-white/90">
                      Shot in {image.location}. {image.details}.
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});

MasonryGallery.displayName = 'MasonryGallery';

export default MasonryGallery;
