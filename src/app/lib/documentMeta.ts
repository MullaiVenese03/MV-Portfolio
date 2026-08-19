import { absoluteUrl, SITE } from "../config/site";

type MetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

function upsertMeta(
  attribute: "name" | "property",
  key: string,
  content: string,
) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function applyDocumentMeta({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
}: MetaInput) {
  if (typeof document === "undefined") return;

  const canonical = absoluteUrl(path);
  const imageUrl = image
    ? (image.startsWith("http://") || image.startsWith("https://") ? image : absoluteUrl(image))
    : absoluteUrl(SITE.ogImage);

  document.title = title;

  upsertMeta("name", "description", description);
  upsertMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");

  upsertLink("canonical", canonical);

  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:type", type);
  upsertMeta("property", "og:url", canonical);
  upsertMeta("property", "og:site_name", SITE.name);
  upsertMeta("property", "og:locale", SITE.locale);
  if (imageUrl) {
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("property", "og:image:alt", title);
  }

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  if (SITE.twitterHandle) {
    upsertMeta("name", "twitter:site", SITE.twitterHandle);
    upsertMeta("name", "twitter:creator", SITE.twitterHandle);
  }
  if (imageUrl) {
    upsertMeta("name", "twitter:image", imageUrl);
    upsertMeta("name", "twitter:image:alt", title);
  }
}
