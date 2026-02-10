export interface Exhibition {
	title: string;
	institution: string;
	description: string;
	startDate: string;
	endDate: string;
	link: string;
	image: string;
	lat: number;
	lng: number;
}

export const exhibitions: Exhibition[] = [
	{
		title: "Declarations: Printing a New Nation",
		institution: "Boston Public Library and Leventhal Center",
		description: "Short description here",
		startDate: "2026-04-11",
		endDate: "2026-09-13",
		link: "https://www.leventhalmap.org/exhibitions/",
		image: "https://iiif.digitalcommonwealth.org/iiif/2/commonwealth:47429c756/22,6,5529,2874/,1200/0/default.jpg",
		lat: 42.349396,
		lng: -71.078369,
	},
	{
		title: "Imagined Nation: America at 250 ",
		institution: "Boston Athenaeum",
		description: "Short description here",
		startDate: "2026-02-12",
		endDate: "2026-11-14",
		link: "https://bostonathenaeum.org/whats-on/exhibitions/imagined-nation/",
		image: "https://ml1bu7iavnet.i.optimole.com/w:970/h:584/q:mauto/f:best/https://bostonathenaeum.org/wp-content/uploads/2026/01/BostonAnthenaeum_0038-1-scaled.jpg",
		lat: 42.358044,
		lng: -71.062158,
	},
	{
		title: "1776: Independence & Ideals",
		institution: "Massachusetts Historical Society",
		description: "Short description here",
		startDate: "2026-03-05",
		endDate: "2026-12-19",
		link: "https://www.masshist.org/exhibitions",
		image: "https://www.masshist.org/admin/uploads/small_6275_drafting_for_web_a718d77091.jpg",
		lat: 42.3465,
		lng: -71.0899,
	},
	{
		title: "War of Words: A Citizen's-Eye View of the Revolution ",
		institution: "Harvard University Libraries, Houghton Library",
		description: "Short description here",
		startDate: "2026-05-18",
		endDate: "2026-08-07",
		link: "https://library.harvard.edu/collections/exhibits",
		image: "https://declaration.fas.harvard.edu/sites/g/files/omnuum10521/files/declaration/files/dunlap_broadside_copy_of_the_united_states_declaration_of_independence_loc-2.jpg",
		lat: 42.373194,
		lng: -71.115944,
	},
];
