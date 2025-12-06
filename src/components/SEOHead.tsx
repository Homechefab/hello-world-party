import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  // For product/dish structured data
  productData?: {
    name: string;
    description: string;
    price: number;
    currency?: string;
    image?: string;
    rating?: number;
    reviewCount?: number;
    availability?: "InStock" | "OutOfStock";
  };
  // For local business (chef) structured data
  localBusinessData?: {
    name: string;
    description: string;
    address?: string;
    image?: string;
    rating?: number;
    reviewCount?: number;
  };
}

const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  productData,
  localBusinessData,
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Homechef`;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Basic meta tags
    updateMeta("description", description);
    if (keywords) updateMeta("keywords", keywords);

    // Open Graph tags
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta("og:type", type, true);
    if (url) updateMeta("og:url", url || window.location.href, true);
    if (image) updateMeta("og:image", image, true);

    // Twitter Card tags
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    if (image) updateMeta("twitter:image", image);

    // Remove existing structured data
    const existingScript = document.querySelector('script[data-seo="structured-data"]');
    if (existingScript) existingScript.remove();

    // Add structured data
    const structuredData: any[] = [];

    // Organization data (always include)
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Homechef",
      description: "Sveriges första marknadsplats för hemlagad mat",
      url: "https://homechef.se",
      logo: "https://homechef.se/app-icon.png",
      sameAs: [
        "https://instagram.com/homechef.se",
        "https://facebook.com/homechef.se",
      ],
    });

    // Product structured data
    if (productData) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "Product",
        name: productData.name,
        description: productData.description,
        image: productData.image,
        offers: {
          "@type": "Offer",
          price: productData.price,
          priceCurrency: productData.currency || "SEK",
          availability: `https://schema.org/${productData.availability || "InStock"}`,
        },
        ...(productData.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: productData.rating,
            reviewCount: productData.reviewCount || 0,
          },
        }),
      });
    }

    // Local business (chef) structured data
    if (localBusinessData) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "FoodService",
        name: localBusinessData.name,
        description: localBusinessData.description,
        image: localBusinessData.image,
        ...(localBusinessData.address && {
          address: {
            "@type": "PostalAddress",
            streetAddress: localBusinessData.address,
          },
        }),
        ...(localBusinessData.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: localBusinessData.rating,
            reviewCount: localBusinessData.reviewCount || 0,
          },
        }),
      });
    }

    // Add structured data script
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "structured-data");
    script.textContent = JSON.stringify(
      structuredData.length === 1 ? structuredData[0] : structuredData
    );
    document.head.appendChild(script);

    // Cleanup
    return () => {
      const cleanupScript = document.querySelector('script[data-seo="structured-data"]');
      if (cleanupScript) cleanupScript.remove();
    };
  }, [title, description, keywords, image, url, type, productData, localBusinessData]);

  return null;
};

export default SEOHead;
