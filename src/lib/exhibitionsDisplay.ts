import type { ImageMetadata } from "astro";

const LOCAL_EXHIBITION_IMAGES = import.meta.glob<{ default: ImageMetadata }>(
	"../assets/*.{jpg,jpeg,png,webp,avif,gif,svg}",
	{ eager: true },
);

export function resolveExhibitionImage(imagePath: string): string | ImageMetadata {
	if (!imagePath.startsWith("/assets/")) return imagePath;

	const assetKey = `../assets/${imagePath.replace("/assets/", "")}`;
	const localImage = LOCAL_EXHIBITION_IMAGES[assetKey];

	return localImage?.default ?? imagePath;
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "long",
	day: "numeric",
});

export function formatDateRange(startDate: string, endDate: string): string {
	const start = new Date(startDate + "T00:00:00");
	const end = new Date(endDate + "T00:00:00");
	return `${dateFormat.format(start)} – ${dateFormat.format(end)}`;
}
