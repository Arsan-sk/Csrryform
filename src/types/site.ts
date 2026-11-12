// CARRYFORM — Site settings and navigation types

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
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

