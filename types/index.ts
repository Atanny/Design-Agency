export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  project_url?: string;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  budget: string;
  status: "new" | "read" | "resolved";
  created_at: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  approved: boolean;
  featured: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  meta_title: string;
  meta_description: string;
  published: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  icon: string;
  features: string[];
  pricing_tiers: PricingTier[];
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export interface DashboardStats {
  portfolioCount: number;
  reviewsCount: number;
  messagesCount: number;
  blogCount: number;
}
