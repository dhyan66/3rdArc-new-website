export interface LocalGalleryItem {
  type?: "image";
  src: string;
  alt: string;
}

const galleryModules = import.meta.glob(
  "../assets/gallery/**/*.{jpg,jpeg,png,webp}",
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

const buildItems = () => {
  const entries = Object.entries(galleryModules).map(([path, src]) => {
    const filename = path.split("/").pop() || "image";
    return {
      category: getCategoryFromPath(path),
      item: {
        src,
        alt: normalizeAlt(filename),
        type: "image" as const,
      },
      filename,
    };
  });

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
