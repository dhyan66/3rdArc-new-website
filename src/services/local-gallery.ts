export interface LocalGalleryItem {
  type?: "image" | "video";
  src: string;
  alt: string;
  videoSrc?: string;
}

const imageModules = import.meta.glob(
  "../assets/gallery/**/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" }
) as Record<string, string>;

const videoModules = import.meta.glob(
  "../assets/gallery/**/*.{mp4,webm,ogg}",
  { eager: true, import: "default" }
) as Record<string, string>;

const normalizeAlt = (filename: string) =>
  filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();

const getCategoryFromPath = (path: string) => {
  const parts = path.split("/");
  return parts[parts.length - 2]?.toLowerCase() || "";
};

const stripExtension = (filename: string) => filename.replace(/\.[^/.]+$/, "");

const buildItems = () => {
  const imageEntries = Object.entries(imageModules).map(([path, src]) => {
    const filename = path.split("/").pop() || "image";
    return {
      category: getCategoryFromPath(path),
      item: {
        src,
        alt: normalizeAlt(filename),
        type: "image" as const,
      },
      filename,
      baseName: stripExtension(filename),
      path,
    };
  });

  const imageByKey = new Map(
    imageEntries.map((entry) => [
      `${entry.category}/${entry.baseName}`.toLowerCase(),
      entry.item.src,
    ])
  );

  const videoEntries = Object.entries(videoModules).map(([path, src]) => {
    const filename = path.split("/").pop() || "video";
    const category = getCategoryFromPath(path);
    const baseName = stripExtension(filename);
    const poster = imageByKey.get(`${category}/${baseName}`.toLowerCase());
    return {
      category,
      item: {
        src: poster || "",
        videoSrc: src,
        alt: normalizeAlt(filename),
        type: "video" as const,
      },
      filename,
      baseName,
      path,
    };
  });

  const entries = [...imageEntries, ...videoEntries];

  const byCategory: Record<string, LocalGalleryItem[]> = {};

  entries
    .sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }))
    .forEach(({ category, item }) => {
      if (!byCategory[category]) byCategory[category] = [];
      byCategory[category].push(item);
    });

  return byCategory;
};

const galleryByCategory = buildItems();

export const getLocalGalleryImages = (category: string) => {
  const normalized = category.toLowerCase();
  if (normalized === "all") {
    return Object.values(galleryByCategory).flat();
  }
  return galleryByCategory[normalized] || [];
};
