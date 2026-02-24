<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import {
		Map,
		MapStyle,
		Marker,
		Popup,
		config,
		LngLatBounds,
	} from "@maptiler/sdk";
	import "@maptiler/sdk/dist/maptiler-sdk.css";
	import type { Exhibition } from "../data/exhibitions";
	import { WarpedMapLayer } from "@allmaps/maplibre";
	import mbtaRoutesUrl from "../assets/mbta_routes.geojson?url";
	import mbtaStationsUrl from "../assets/mbta_stations.geojson?url";

	export let exhibitions: Exhibition[] = [];

	const apiKey = "xzHYzv10Mfc1eJ8Vbizl";

	const annotationUrl =
		"https://annotations.allmaps.org/manifests/acd37b143c84dc34";
	const warpedMapLayer = new WarpedMapLayer();
	const mbtaRoutesSourceId = "mbta-routes";
	const mbtaRoutesLayerId = "mbta-routes-line";
	const mbtaStationsSourceId = "mbta-stations";
	const mbtaStationsIconId = "mbta-station-icon";
	const mbtaStationsLayerId = "mbta-stations-symbol";
	const mbtaStationsLabelLayerId = "mbta-stations-label";
	const mbtaStationIconSizePx = 32;
	const mbtaLogoSvg =
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" style="enable-background:new 0 0 1000 1000" xml:space="preserve"><path d="M500 44.3c-251.7 0-455.7 204-455.7 455.7s204 455.7 455.7 455.7 455.7-204 455.7-455.7S751.7 44.3 500 44.3zm315.7 390.8H579.1v389.2H420.9V435.1H184.3V276.9h631.3v158.2z" style="fill:#fff"/><path d="M500 0C223.9 0 0 223.9 0 500s223.9 500 500 500 500-223.9 500-500S776.1 0 500 0zm0 955.7c-251.7 0-455.7-204-455.7-455.7S248.3 44.3 500 44.3s455.7 204 455.7 455.7-204 455.7-455.7 455.7z"/><path d="M184.3 435.1h236.6v389.3h158.2V435.1h236.6V276.9H184.3z"/></svg>';

	const mbtaRouteColors = {
		green: "#00843D",
		red: "#DA291C",
		bus: "#FFC72C",
	} as const;

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

	function rasterizeSvgToImageData(
		svg: string,
		width: number,
		height: number,
	): Promise<ImageData> {
		return new Promise((resolve, reject) => {
			const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
			const url = URL.createObjectURL(blob);
			const image = new Image();

			image.onload = () => {
				URL.revokeObjectURL(url);
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const context = canvas.getContext("2d");
				if (!context) {
					reject(new Error("Could not create canvas context for SVG rasterization"));
					return;
				}
				context.drawImage(image, 0, 0, width, height);
				resolve(context.getImageData(0, 0, width, height));
			};

			image.onerror = () => {
				URL.revokeObjectURL(url);
				reject(new Error("Could not decode inline SVG image"));
			};

			image.src = url;
		});
	}

	let mapContainer: HTMLDivElement;
	let map: Map | null = null;
	let markers: Marker[] = [];
	let popup: Popup | null = null;

	let show1776Map = false;

	function toggle1776Map(): void {
		show1776Map = !show1776Map;
		if (!map) return;
		try {
			if (show1776Map) {
				warpedMapLayer.setLayerOptions({ visible: true });
			} else {
				warpedMapLayer.setLayerOptions({ visible: false });
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
		const mapInstance = map;
		mapInstance.on("load", async () => {
			mapInstance.addLayer(warpedMapLayer);
			warpedMapLayer.setLayerOptions({ visible: false });
			warpedMapLayer.addGeoreferenceAnnotationByUrl(annotationUrl);

			mapInstance.addSource(mbtaRoutesSourceId, {
				type: "geojson",
				data: mbtaRoutesUrl,
			});

			mapInstance.addLayer({
				id: mbtaRoutesLayerId,
				type: "line",
				source: mbtaRoutesSourceId,
				paint: {
					"line-width": 6,
					"line-color": [
						"match",
						["get", "route"],
						"green",
						mbtaRouteColors.green,
						"red",
						mbtaRouteColors.red,
						"bus",
						mbtaRouteColors.bus,
						"#6b7280",
					],
				},
			});

			mapInstance.addSource(mbtaStationsSourceId, {
				type: "geojson",
				data: mbtaStationsUrl,
			});

			try {
				const mbtaIcon = await rasterizeSvgToImageData(
					mbtaLogoSvg,
					mbtaStationIconSizePx,
					mbtaStationIconSizePx,
				);
				if (!mapInstance.hasImage(mbtaStationsIconId)) {
					mapInstance.addImage(mbtaStationsIconId, mbtaIcon);
				}
			} catch (error) {
				console.error("Failed to load MBTA station icon", error);
			}

			mapInstance.addLayer({
				id: mbtaStationsLayerId,
				type: "symbol",
				source: mbtaStationsSourceId,
				layout: {
					"icon-image": mbtaStationsIconId,
					"icon-size": 1,
					"icon-allow-overlap": true,
				},
			});

			mapInstance.addLayer({
				id: mbtaStationsLabelLayerId,
				type: "symbol",
				source: mbtaStationsSourceId,
				layout: {
					"text-field": ["coalesce", ["get", "name"], ""],
					"text-size": 13,
					"text-offset": [0, 1.8],
					"text-anchor": "top",
					"text-allow-overlap": false,
				},
				paint: {
					"text-color": "#000000",
					"text-halo-color": "#ffffff",
					"text-halo-width": 2,
					"text-halo-blur": 1,
				},
			});
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
				popup!
					.setLngLat([ex.lng, ex.lat])
					.setHTML(buildPopupContent(ex))
					.addTo(map!);
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
			<input
				type="checkbox"
				checked={show1776Map}
				on:change={toggle1776Map}
			/>
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
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
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
