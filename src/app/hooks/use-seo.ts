import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description?: string;
  ogImage?: string;
  keywords?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_NAME = "IPPOO KRAAFT";
const DEFAULT_DESCRIPTION =
  "IPPOO KRAAFT - Plateforme dédiée à l'artisanat africain ancestral : oeuvres certifiées, traçabilité QR, formations et groupements d'artisans.";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const JSONLD_ID = "ipk-jsonld";

export function useSeo({ title, description, ogImage, keywords, noIndex, jsonLd }: SeoOptions) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} - ${SITE_NAME}`;
    const desc = description ?? DEFAULT_DESCRIPTION;
    const previousTitle = document.title;

    document.title = fullTitle;
    setMeta("name", "description", desc);
    if (keywords) setMeta("name", "keywords", keywords);
    setMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");

    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", window.location.href);
    if (ogImage) setMeta("property", "og:image", ogImage);

    setMeta("name", "twitter:card", ogImage ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    if (ogImage) setMeta("name", "twitter:image", ogImage);

    setLink("canonical", window.location.origin + window.location.pathname);

    // JSON-LD structured data
    let jsonLdEl: HTMLScriptElement | null = null;
    if (jsonLd) {
      jsonLdEl = document.createElement("script");
      jsonLdEl.type = "application/ld+json";
      jsonLdEl.id = JSONLD_ID;
      jsonLdEl.text = JSON.stringify(jsonLd);
      document.head.querySelector(`#${JSONLD_ID}`)?.remove();
      document.head.appendChild(jsonLdEl);
    }

    return () => {
      document.title = previousTitle;
      if (jsonLdEl && jsonLdEl.parentNode) jsonLdEl.parentNode.removeChild(jsonLdEl);
    };
  }, [title, description, ogImage, keywords, noIndex, jsonLd]);
}
