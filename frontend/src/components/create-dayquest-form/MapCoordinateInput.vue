<script setup lang="ts">
import { onMounted, watch } from "vue";
import { tileLayer, map as createMap, Marker, Map, icon } from "leaflet";
import {
	nomanatimSearchQuery,
	type NomanatimLocation,
} from "@/services/nomanatim";
import { useQuery } from "@tanstack/vue-query";
import { useThrottleFn } from "@vueuse/core";
import { computed, ref } from "vue";
import {
	ComboboxContent,
	ComboboxItem,
	Combobox,
	ComboboxAnchor,
	ComboboxInput,
	ComboboxEmpty,
	ComboboxTrigger,
} from "@/components/ui/combobox";
import "leaflet/dist/leaflet.css";

const coords = defineModel<{ lat: number; lon: number }>({ required: true });

const searchTerm = ref("");
const setSearchWithThrottle = useThrottleFn(
	(value: string) => {
		searchTerm.value = value;
	},
	250,
	true,
);

const location = ref<NomanatimLocation>();

const { data: searchResults, isFetching } = useQuery(
	computed(() => ({
		...nomanatimSearchQuery({
			limit: 5,
			city: searchTerm.value,
			addressdetails: true,
		}),
		enabled: searchTerm.value !== "",
	})),
);

let map: Map | null = null;
let marker: Marker | null = null;

watch(location, () => {
	if (map === null || marker === null) return;
	if (!location.value) return;
	map.setView([location.value.lat, location.value.lon], 11);
	marker.setLatLng([location.value.lat, location.value.lon]);
	coords.value = { lat: location.value.lat, lon: location.value.lon };
});

onMounted(() => {
	map = createMap("map").setView([coords.value.lat, coords.value.lon], 1);

	tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);

	marker = new Marker([coords.value.lat, coords.value.lon], {
		draggable: true,
		icon: icon({
			iconUrl: "/images/marker.png",
			iconSize: [26, 36],
			iconAnchor: [13, 36],
		}),
	}).addTo(map);

	marker.on("dragend", (event) => {
		const latLng = event.target.getLatLng();
		coords.value = { lat: latLng.lat, lon: latLng.lng };
	});

	map.on("click", (event) => {
		const latLng = event.latlng;
		marker!.setLatLng(latLng);
		coords.value = { lat: latLng.lat, lon: latLng.lng };
	});
});
</script>

<template>
	<div id="map" style="height: 360px; width: 100%">
		<div
			class="leaflet-control-container pointer-events-none absolute right-0 top-0 m-2"
		>
			<Combobox
				v-model="location"
				:search-term="searchTerm"
				@update:search-term="setSearchWithThrottle"
				:filter-function="(values) => values"
				@click.stop
				class="leaflet-control"
			>
				<ComboboxAnchor class="bg-white shadow-md">
					<ComboboxInput placeholder="Search..." />
					<ComboboxTrigger />
				</ComboboxAnchor>
				<ComboboxContent>
					<ComboboxEmpty
						class="py-2 text-center text-xs font-medium text-zinc-500"
					>
						{{
							searchTerm
								? isFetching
									? "Searching.."
									: "Nothing found"
								: "Start typing to search for a city"
						}}
					</ComboboxEmpty>
					<ComboboxItem
						v-for="location of searchResults"
						:key="location.place_id"
						:value="location"
					>
						<img
							height="12"
							class="h-3 shrink-0 object-contain"
							:src="`https://flagcdn.com/h20/${location.address.country_code}.png`"
							:srcset="`
									https://flagcdn.com/h40/${location.address.country_code}.png 2x,
									https://flagcdn.com/h60/${location.address.country_code}.png 3x
								`"
							:alt="location.name"
						/>
						<span class="line-clamp-2">
							{{ location.name
							}}{{
								location.address.state ? ", " + location.address.state : ""
							}}
						</span>
					</ComboboxItem>
				</ComboboxContent>
			</Combobox>
		</div>
	</div>
</template>
