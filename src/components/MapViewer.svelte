<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import Map from "ol/Map.js";
	import View from "ol/View.js";
	import VectorLayer from "ol/layer/Vector.js";
	import VectorSource from "ol/source/Vector.js";
	import Feature from "ol/Feature.js";
	import Point from "ol/geom/Point.js";
	import { fromLonLat } from "ol/proj.js";
	import { boundingExtent, getCenter } from "ol/extent.js";
	import Style from "ol/style/Style.js";
	import Icon from "ol/style/Icon.js";
	import { apply } from "ol-mapbox-style";
	import "ol/ol.css";

	const key = "xzHYzv10Mfc1eJ8Vbizl";
	const styleJson = `https://api.maptiler.com/maps/streets-v4/style.json?key=${key}`;

	// Editable array of location pins (name, lon, lat)
	const locations = [
		{ name: "Boston Public Library", lon: -71.078369, lat: 42.349396 },
		{ name: "Boston Athenaeum", lon: -71.062158, lat: 42.358044 },
		{ name: "Massachusetts Historical Society", lon: -71.0982, lat: 42.3462 },
		{ name: "Harvard Houghton Library", lon: -71.115944, lat: 42.373194 },
	];

	const coords = locations.map((loc) => fromLonLat([loc.lon, loc.lat]));
	const extent = boundingExtent(coords);

	// Pin icon as inline SVG (teardrop marker)
	const pinSvg =
		'data:image/svg+xml,' +
		encodeURIComponent(
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36"><path fill="%231a1a2e" stroke="%23fff" stroke-width="2" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0zm0 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/></svg>'
		);

	let mapContainer: HTMLDivElement;
	let map: Map | null = null;

	onMount(async () => {
		if (!mapContainer) return;
		map = new Map({
			target: mapContainer,
			view: new View({
				constrainResolution: true,
				center: getCenter(extent),
				zoom: 16,
			}),
		});
		map.getView().fit(extent, { duration: 0 });
		await apply(map, styleJson);

		// Build point features from locations
		const features = locations.map(
			(loc) =>
				new Feature({
					geometry: new Point(fromLonLat([loc.lon, loc.lat])),
					name: loc.name,
				})
		);

		const pinsSource = new VectorSource({ features });
		const pinsLayer = new VectorLayer({
			source: pinsSource,
			style: new Style({
				image: new Icon({
					src: pinSvg,
					anchor: [0.5, 1],
					scale: 0.8,
				}),
			}),
			zIndex: 100,
		});
		map.addLayer(pinsLayer);


	});

	onDestroy(() => {
		if (map) {
			map.setTarget(undefined);
			map = null;
		}
	});
</script>

<div bind:this={mapContainer} class="map-viewer"></div>

<style>
	.map-viewer {
		width: 100%;
		height: 100%;
	}
</style>
