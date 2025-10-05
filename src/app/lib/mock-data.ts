import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Post } from "./types";

export const posts: Post[] = [
  {
    id: "1",
    system: "Exoplanet Announcements",
    author: "StarGazer88",
    avatar: PlaceHolderImages.find(p => p.id === 'avatar1')?.imageUrl || '',
    time: "3 hours ago",
    title: "Discovered a new Super-Earth in the Kepler-186 system!",
    content: "Just processed the latest data from the transit survey and it's confirmed! A new planet, approximately 1.5 times the radius of Earth, is orbiting within the habitable zone of Kepler-186. We've provisionally named it Kepler-186g. The implications are huge, as this could be a prime candidate for atmospheric analysis with JWST. The team is buzzing with excitement. We'll be publishing the full paper next week, but wanted to share the initial findings with the community here first. What are your thoughts on potential atmospheric composition?",
    thrust: 1337,
    commentCount: 256,
  },
  {
    id: "2",
    system: "Space Talk",
    author: "CosmicPainter",
    avatar: PlaceHolderImages.find(p => p.id === 'avatar2')?.imageUrl || '',
    time: "8 hours ago",
    title: "What if we could travel at the speed of light?",
    content: "A classic sci-fi trope, but let's seriously discuss the physics and philosophical implications. From time dilation to the immense energy required, what are the biggest hurdles? And if we overcame them, how would it change humanity's place in the universe? Let's brainstorm and debate!",
    thrust: 842,
    commentCount: 98,
  },
    {
    id: "3",
    system: "NASA News",
    author: "GalaxyMapper",
    avatar: PlaceHolderImages.find(p => p.id === 'avatar3')?.imageUrl || '',
    time: "1 day ago",
    title: "Feedback: Can we get post flairs?",
    content: "It would be super helpful to have flairs for posts, especially in the Exoplanet Announcements. We could have flairs like 'New Discovery', 'Data Analysis', 'Question', etc. This would make it much easier to filter and find specific types of content. What does everyone think?",
    thrust: 451,
    commentCount: 150,
  }
];

export type System = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  members: number;
  membersDisplay: string;
};

export const systems: System[] = [
  { name: "Space Talk", slug: "spacetalk", description: "General discussions about the cosmos, from astrophysics to science fiction.", members: 1200000, membersDisplay: "1.2M" },
  { name: "Exoplanet Announcements", slug: "exoplanet-announcements", description: "The latest official discoveries and data from the frontiers of space.", members: 876000, membersDisplay: "876k" },
  { name: "NASA News", slug: "nasa-news", description: "The latest news and announcements directly from NASA.", members: 53000, membersDisplay: "53k" },
];
