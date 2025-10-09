import type { SinglePage } from "@halo-dev/api-client";
import { ArticlePage } from "./ArticlePage";
import { GalleryPage } from "./GalleryPage";
import { getPageMetadata } from "@/lib/halo/pages";

interface PageRendererProps {
  page: SinglePage;
  content: string;
}

/**
 * Page renderer - selects the appropriate component based on page type
 */
export function PageRenderer({ page, content }: PageRendererProps) {
  const metadata = getPageMetadata(page);

  switch (metadata.pageType) {
    case "gallery":
      return <GalleryPage page={page} content={content} />;

    case "article":
    default:
      return <ArticlePage page={page} content={content} />;
  }
}
