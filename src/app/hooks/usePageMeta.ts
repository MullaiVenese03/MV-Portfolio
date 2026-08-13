import { useEffect } from "react";
import { applyDocumentMeta } from "../lib/documentMeta";

type PageMetaOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function usePageMeta(options: PageMetaOptions) {
  const { title, description, path, image, type, noIndex } = options;

  useEffect(() => {
    applyDocumentMeta({ title, description, path, image, type, noIndex });
  }, [title, description, path, image, type, noIndex]);
}
