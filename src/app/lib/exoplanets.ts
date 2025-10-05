
import { PlaceHolderImages } from "@/lib/placeholder-images";

export type Exoplanet = {
  id: string;
  name: string;
  discoveredBy: string;
  imageUrl: string;
  imageHint: string;
  banner?: {
    text: string;
    color: string;
  };
};

export const recentDiscoveries: Exoplanet[] = [
  {
    id: "1",
    name: "Kepler-186g",
    discoveredBy: "StarGazer88",
    imageUrl: PlaceHolderImages.find(p => p.id === 'avatar1')?.imageUrl || '',
    imageHint: "exoplanet",
    banner: {
      text: "Most Recent",
      color: "bg-primary"
    }
  },
  {
    id: "2",
    name: "TRAPPIST-1e",
    discoveredBy: "CosmicPainter",
    imageUrl: PlaceHolderImages.find(p => p.id === 'avatar2')?.imageUrl || '',
    imageHint: "red dwarf"
  },
  {
    id: "3",
    name: "Proxima Centauri b",
    discoveredBy: "GalaxyMapper",
    imageUrl: PlaceHolderImages.find(p => p.id === 'avatar3')?.imageUrl || '',
    imageHint: "star system",
    banner: {
      text: "Biggest Find",
      color: "bg-amber-500"
    }
  },
    {
    id: "4",
    name: "LHS 1140 b",
    discoveredBy: "AstroExplorer",
    imageUrl: "https://picsum.photos/seed/exoplanet4/400/300",
    imageHint: "rocky planet"
  },
  {
    id: "5",
    name: "Gliese 581g",
    discoveredBy: "PlanetHunter",
    imageUrl: "https://picsum.photos/seed/exoplanet5/400/300",
    imageHint: "super earth"
  }
];
