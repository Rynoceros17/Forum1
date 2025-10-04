import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Post } from "./types";

export const posts: Post[] = [
  {
    id: "1",
    system: "Exoplanets",
    author: "StarGazer88",
    avatar: PlaceHolderImages.find(p => p.id === 'avatar1')?.imageUrl || '',
    time: "3 hours ago",
    title: "Discovered a new Super-Earth in the Kepler-186 system!",
    content: "Just processed the latest data from the transit survey and it's confirmed! A new planet, approximately 1.5 times the radius of Earth, is orbiting within the habitable zone of Kepler-186. We've provisionally named it Kepler-186g. The implications are huge, as this could be a prime candidate for atmospheric analysis with JWST. The team is buzzing with excitement. We'll be publishing the full paper next week, but wanted to share the initial findings with the community here first. What are your thoughts on potential atmospheric composition?",
    thrust: 1337,
    comments: 256,
  },
  {
    id: "2",
    system: "SpaceArt",
    author: "CosmicPainter",
    avatar: PlaceHolderImages.find(p => p.id === 'avatar2')?.imageUrl || '',
    time: "8 hours ago",
    title: "My latest piece: 'Nebula's Cradle'",
    content: "Spent the last month working on this digital painting inspired by the Carina Nebula. I tried to capture the vibrant chaos of star formation, with pillars of dust and gas illuminated by young, massive stars. The color palette was a real challenge, balancing the brilliant blues and purples with the deep reds and oranges of the hydrogen clouds. Used a combination of Procreate and Photoshop. Let me know what you think! Prints will be available soon.",
    thrust: 842,
    comments: 98,
  },
    {
    id: "3",
    system: "Andromeda",
    author: "GalaxyMapper",
    avatar: PlaceHolderImages.find(p => p.id === 'avatar3')?.imageUrl || '',
    time: "1 day ago",
    title: "Our Galactic Neighbor - A Deep Dive into M31",
    content: "Andromeda (M31) is our closest major galactic neighbor, and it's on a collision course with the Milky Way. But don't worry, we have a few billion years! This post is a collection of resources, including high-resolution images from Hubble, data on its stellar populations, and simulations of the upcoming merger. It's a fascinating system with a double nucleus and a massive halo of dark matter. Let's discuss its unique features and what we can learn from it about our own galaxy's evolution.",
    thrust: 451,
    comments: 150,
  }
];

export type System = {
  name: string;
  members: string;
};

export const systems: System[] = [
  { name: "s/Exoplanets", members: "1.2M" },
  { name: "s/SpaceArt", members: "876k" },
  { name: "s/Astrophotography", members: "950k" },
  { name: "s/SpaceX", members: "2.1M" },
  { name: "s/Andromeda", members: "453k" },
];
