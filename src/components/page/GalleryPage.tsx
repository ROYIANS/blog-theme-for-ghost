import { Column, Heading, Text, Grid, Media } from "@once-ui-system/core";
import type { SinglePage } from "@halo-dev/api-client";

interface GalleryPageProps {
  page: SinglePage;
  content: string;
}

/**
 * Gallery page type - displays images in a grid
 * Content should contain image URLs, one per line or in markdown format
 */
export function GalleryPage({ page, content }: GalleryPageProps) {
  if (!page.spec) return null;

  // Extract image URLs from content
  // Simple extraction: look for img tags or markdown images
  const imgRegex = /<img[^>]+src="([^">]+)"|!\[([^\]]*)\]\(([^)]+)\)/g;
  const images: string[] = [];
  let match;

  while ((match = imgRegex.exec(content)) !== null) {
    const url = match[1] || match[3];
    if (url) images.push(url);
  }

  return (
    <Column as="section" maxWidth="l" horizontal="center" gap="l" paddingTop="24">
      <Column maxWidth="m" gap="16" horizontal="center" align="center">
        <Heading variant="display-strong-l">{page.spec.title}</Heading>
        {page.spec.excerpt?.raw && (
          <Text variant="body-default-l" onBackground="neutral-weak" wrap="balance">
            {page.spec.excerpt.raw}
          </Text>
        )}
      </Column>

      {images.length > 0 ? (
        <Grid columns="3" s={{ columns: 1 }} m={{ columns: 2 }} gap="16" paddingTop="32">
          {images.map((src, index) => (
            <Media
              key={index}
              src={src}
              alt={`${page.spec!.title} - Image ${index + 1}`}
              aspectRatio="4/3"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              border="neutral-alpha-weak"
              radius="l"
              cursor="zoom-in"
            />
          ))}
        </Grid>
      ) : (
        <Column
          as="article"
          maxWidth="m"
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </Column>
  );
}
