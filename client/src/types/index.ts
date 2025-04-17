export interface Simulation {
  id: number;
  title: string;
  description: string;
  slug: string;
  category: string;
  imageUrl: string;
  duration: string;
  difficulty: string;
  isFeatured: boolean;
  isNew: boolean;
  isPopular: boolean;
  path: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  slug: string;
  description: string;
}
