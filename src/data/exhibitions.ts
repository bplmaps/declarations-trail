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
		description: "See eight different printings of the Declaration of Independence, and take a journey that explores how the news of independence spread out from Philadelphia in the summer of 1776 when the ink was not yet dry on the founding documents of a new nation.",
		startDate: "2026-04-11",
		endDate: "2026-09-13",
		link: "https://www.leventhalmap.org/exhibitions/",
		image: "https://iiif.digitalcommonwealth.org/iiif/2/commonwealth:47429c756/22,6,5529,2874/,1200/0/default.jpg",
		lat: 42.349396,
		lng: -71.078369,
	},
	{
		title: "Imagined Nation: America at 250",
		institution: "Boston Athenaeum",
		description: "Explore how the nation has been continuously envisioned in art and print culture since its founding. View multiple early printings of the Declaration of Independence alongside George Washington's library, paintings, sculpture, prints, and more.",
		startDate: "2026-02-12",
		endDate: "2026-11-14",
		link: "https://bostonathenaeum.org/whats-on/exhibitions/imagined-nation/",
		image: "/assets/202602_ImaginedNationCases_Rotation1_013.jpg",
		lat: 42.358044,
		lng: -71.062158,
	},
	{
		title: "1776: Declaring Independence",
		institution: "Massachusetts Historical Society",
		description: "In 1776, news of the Declaration of Independence echoed across the colonies and around the world. Discover how Americans drafted a path to liberty and explore the Declaration’s legacy as a national beacon of celebration and protest.",
		startDate: "2026-03-06",
		endDate: "2026-12-19",
		link: "https://www.masshist.org/exhibitions",
		image: "/assets/mhs_goddard.jpg",
		lat: 42.3465,
		lng: -71.0899,
	},
	{
		title: "War of Words: A Citizen's-Eye View of the Revolution ",
		institution: "Harvard Library, Houghton Library",
		description: "From the first protests against British taxation to the treaty that ended the war, War of Words brings together the posters, pamphlets, newspapers, and images that brought news of the American Revolution to those who lived through it.",
		startDate: "2026-05-18",
		endDate: "2026-08-07",
		link: "https://library.harvard.edu/exhibits/war-words",
		image: "/assets/houghton_dunlap.jpg",
		lat: 42.373194,
		lng: -71.115944,
	},
	{
		title: "Harvard and the American Revolution",
		institution: "Harvard Library, Harvard University Archives",
		description: "This exhibition explores Harvard’s many roles in that struggle—as a Continental Army headquarters and as a community where bold ideas and dissent flourished—through objects, documents, and stories from the collections of the Harvard University Archives.",
		startDate: "2026-05-30",
		endDate: "2026-12-18",
		link: "https://library.harvard.edu/exhibits/harvard-and-american-revolution",
		image: "/assets/hu_archives_cambridge_common.jpeg",
		lat: 42.37341,
		lng: -71.1156
	},
];
