<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { Map, MapStyle, Marker, Popup, config, LngLatBounds } from "@maptiler/sdk";
	import "@maptiler/sdk/dist/maptiler-sdk.css";
	import type { Exhibition } from "../data/exhibitions";
	import { WarpedMapLayer } from '@allmaps/maplibre'

	export let exhibitions: Exhibition[] = [];

	const apiKey = "xzHYzv10Mfc1eJ8Vbizl";

	const annotationUrl = 'https://annotations.allmaps.org/manifests/acd37b143c84dc34'
	const warpedMapLayer = new WarpedMapLayer()

	// Default center (Boston) and zoom when no exhibitions
	const defaultCenter: [number, number] = [-71.08, 42.36];
	const defaultZoom = 16;

	const dateFormat = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	function formatDateRange(start: string, end: string): string {
		const startD = new Date(start + "T00:00:00");
		const endD = new Date(end + "T00:00:00");
		return `${dateFormat.format(startD)} – ${dateFormat.format(endD)}`;
	}

	function appleMapsUrl(lat: number, lng: number): string {
		return `https://maps.apple.com/?daddr=${lat},${lng}`;
	}

	function googleMapsUrl(lat: number, lng: number): string {
		return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
	}

	function buildPopupContent(ex: Exhibition): string {
		const dates = formatDateRange(ex.startDate, ex.endDate);
		const apple = appleMapsUrl(ex.lat, ex.lng);
		const google = googleMapsUrl(ex.lat, ex.lng);
		return `
			<div class="map-popup">
				${ex.institution ? `<div class="map-popup-institution">${escapeHtml(ex.institution)}</div>` : ""}
				<div class="map-popup-title">${escapeHtml(ex.title)}</div>
				<div class="map-popup-dates">${escapeHtml(dates)}</div>
				<div class="map-popup-actions">
					<a href="${apple}" target="_blank" rel="noopener noreferrer" class="map-popup-btn">Apple Maps</a>
					<a href="${google}" target="_blank" rel="noopener noreferrer" class="map-popup-btn">Google Maps</a>
				</div>
			</div>
		`;
	}

	function escapeHtml(text: string): string {
		const div = document.createElement("div");
		div.textContent = text;
		return div.innerHTML;
	}

	let mapContainer: HTMLDivElement;
	let map: Map | null = null;
	let markers: Marker[] = [];
	let popup: Popup | null = null;

	let show1776Map = true;


	function toggle1776Map(): void {
		show1776Map = !show1776Map;
		if (!map) return;
		try {
			if (show1776Map) {
				warpedMapLayer.setLayerOptions({visible: true})
			} else {
				warpedMapLayer.setLayerOptions({visible: false})

			}
		} catch (_) {}
	}

	onMount(() => {
		if (!mapContainer) return;

		config.apiKey = apiKey;

		const hasExhibitions = exhibitions.length > 0;

		// Build initial map options
		const mapOptions: ConstructorParameters<typeof Map>[0] = {
			container: mapContainer,
			style: MapStyle.STREETS,
			center: defaultCenter,
			zoom: defaultZoom,
		};

		// If we have multiple exhibitions, fit bounds to show all pins
		if (hasExhibitions && exhibitions.length > 1) {
			const lngs = exhibitions.map((ex) => ex.lng);
			const lats = exhibitions.map((ex) => ex.lat);
			const sw: [number, number] = [Math.min(...lngs), Math.min(...lats)];
			const ne: [number, number] = [Math.max(...lngs), Math.max(...lats)];
			const bounds = new LngLatBounds(sw, ne);
			mapOptions.bounds = bounds;
			mapOptions.fitBoundsOptions = { padding: 100, duration: 0 };
		} else if (hasExhibitions && exhibitions.length === 1) {
			mapOptions.center = [exhibitions[0].lng, exhibitions[0].lat];
			mapOptions.zoom = defaultZoom;
		}

		map = new Map(mapOptions);
		map.on("load", () => {
			map.addLayer(warpedMapLayer);
			warpedMapLayer.addGeoreferenceAnnotationByUrl(annotationUrl);
			
		});

		popup = new Popup({ closeButton: true, closeOnClick: false });

		// Add a marker for each exhibition (MapTiler uses [lng, lat])
		markers = exhibitions.map((ex, i) => {
			const marker = new Marker({
				color: "#1a1a2e",
			})
				.setLngLat([ex.lng, ex.lat])
				.addTo(map!);

			const el = marker.getElement();
			el.style.cursor = "pointer";
			el.addEventListener("click", () => {
				popup!.setLngLat([ex.lng, ex.lat]).setHTML(buildPopupContent(ex)).addTo(map!);
			});

			return marker;
		});
	});

	onDestroy(() => {
		markers.forEach((m) => m.remove());
		markers = [];
		if (popup) {
			popup.remove();
			popup = null;
		}
		if (map) {
			map.remove();
			map = null;
		}
	});
</script>

<div class="map-viewer-wrapper">
	<div class="map-controls">
		<label class="map-controls-toggle">
			<input type="checkbox" checked={show1776Map} on:change={toggle1776Map} />
			<span>Show 1776 map</span>
		</label>
	</div>
	<div bind:this={mapContainer} class="map-viewer"></div>
</div>

<style>
	.map-viewer-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.map-viewer {
		width: 100%;
		height: 100%;
	}

	.map-controls {
		position: absolute;
		top: 12px;
		left: 12px;
		z-index: 10;
		background: rgba(255, 255, 255, 0.95);
		padding: 10px 14px;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
	}

	.map-controls-toggle {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		color: #18181b;
		user-select: none;
	}

	.map-controls-toggle input[type="checkbox"] {
		width: 18px;
		height: 18px;
		cursor: pointer;
		accent-color: #1a1a2e;
	}

	:global(.maplibregl-popup-content) {
		padding: 0;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		min-width: 220px;
		max-width: 280px;
	}

	:global(.map-popup) {
		padding: 12px 14px;
		font-family: system-ui, -apple-system, sans-serif;
	}

	:global(.map-popup-institution) {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: #71717a;
		margin-bottom: 4px;
	}

	:global(.map-popup-title) {
		font-size: 0.95rem;
		font-weight: 600;
		color: #18181b;
		line-height: 1.3;
		margin-bottom: 6px;
	}

	:global(.map-popup-dates) {
		font-size: 0.8rem;
		color: #52525b;
		margin-bottom: 10px;
	}

	:global(.map-popup-actions) {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	:global(.map-popup-btn) {
		display: inline-block;
		padding: 6px 12px;
		font-size: 0.8rem;
		font-weight: 500;
		text-decoration: none;
		border-radius: 6px;
		transition: background-color 0.15s;
		background: #e4e4e7;
		color: #18181b;
	}

</style>
