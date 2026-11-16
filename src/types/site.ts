// CARRYFORM — Site settings and navigation types

export interface LandingPageConfig {
  showroomSlugs: string[];      // Chapter 4 — up to 4+ products for showroom carousel
  selectedPiecesSlugs: string[]; // "Selected Pieces" section — max 6
  artGallerySlugs: string[];    // Chapter 5 "Art Gallery" (Ready for New Beginning) — max 3
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  pinterest?: string;
  whatsapp?: string;
}

export interface FooterCredit {
  text: string;
  url: string;
}

export interface ContactInfo {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string;
  openingHours: string | null;
  socials: SocialLinks;
  footerCredit: FooterCredit;
}

export interface SiteSettings {
  brand: string;
  descriptor: string;
  tagline: string;
  defaultCurrency: string;
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    ogImage?: string;
  };
  landingPage?: LandingPageConfig;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

