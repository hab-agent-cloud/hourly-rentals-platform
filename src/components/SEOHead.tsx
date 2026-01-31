import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  ogImage,
  ogType = 'website',
  canonicalUrl,
  structuredData 
}: SEOHeadProps) => {
  useEffect(() => {
    if (title) {
      document.title = title;
      const ogTitleMeta = document.querySelector('meta[property="og:title"]');
      if (ogTitleMeta) ogTitleMeta.setAttribute('content', title);
      
      const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitleMeta) twitterTitleMeta.setAttribute('content', title);
    }

    if (description) {
      let descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute('content', description);
      } else {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        descMeta.setAttribute('content', description);
        document.head.appendChild(descMeta);
      }

      const ogDescMeta = document.querySelector('meta[property="og:description"]');
      if (ogDescMeta) ogDescMeta.setAttribute('content', description);

      const twitterDescMeta = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescMeta) twitterDescMeta.setAttribute('content', description);
    }

    if (keywords) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (keywordsMeta) {
        keywordsMeta.setAttribute('content', keywords);
      } else {
        keywordsMeta = document.createElement('meta');
        keywordsMeta.setAttribute('name', 'keywords');
        keywordsMeta.setAttribute('content', keywords);
        document.head.appendChild(keywordsMeta);
      }
    }

    if (ogImage) {
      const ogImageMeta = document.querySelector('meta[property="og:image"]');
      if (ogImageMeta) ogImageMeta.setAttribute('content', ogImage);

      const twitterImageMeta = document.querySelector('meta[name="twitter:image"]');
      if (twitterImageMeta) twitterImageMeta.setAttribute('content', ogImage);
    }

    if (ogType) {
      const ogTypeMeta = document.querySelector('meta[property="og:type"]');
      if (ogTypeMeta) ogTypeMeta.setAttribute('content', ogType);
    }

    if (canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonicalLink) {
        canonicalLink.href = canonicalUrl;
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        canonicalLink.href = canonicalUrl;
        document.head.appendChild(canonicalLink);
      }

      const ogUrlMeta = document.querySelector('meta[property="og:url"]');
      if (ogUrlMeta) ogUrlMeta.setAttribute('content', canonicalUrl);
    }

    if (structuredData) {
      const existingScript = document.querySelector('script#dynamic-structured-data');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'dynamic-structured-data';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      if (structuredData) {
        const script = document.querySelector('script#dynamic-structured-data');
        if (script) script.remove();
      }
    };
  }, [title, description, keywords, ogImage, ogType, canonicalUrl, structuredData]);

  return null;
};

export default SEOHead;
