import { Column, Heading, Avatar, Row, Text, Media } from "@once-ui-system/core";
import { formatDate } from "@/utils/formatDate";
import { person } from "@/resources";
import type { SinglePage } from "@halo-dev/api-client";

interface ArticlePageProps {
  page: SinglePage;
  content: string;
}

/**
 * Article page type - similar to blog post
 */
export function ArticlePage({ page, content }: ArticlePageProps) {
  if (!page.spec) return null;

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">
      <Column maxWidth="s" gap="16" horizontal="center" align="center">
        {page.spec.publishTime && (
          <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
            {formatDate(page.spec.publishTime)}
          </Text>
        )}
        <Heading variant="display-strong-m">{page.spec.title}</Heading>
      </Column>

      <Row marginBottom="32" horizontal="center">
        <Row gap="16" vertical="center">
          <Avatar size="s" src={person.avatar} />
          <Text variant="label-default-m" onBackground="brand-weak">
            {page.status?.contributors?.join(',') || person.name}
          </Text>
        </Row>
      </Row>

      {page.spec.cover && (
        <Media
          src={page.spec.cover}
          alt={page.spec.title}
          aspectRatio="16/9"
          priority
          sizes="(min-width: 768px) 100vw, 768px"
          border="neutral-alpha-weak"
          radius="l"
          marginTop="12"
          marginBottom="8"
        />
      )}

      <Column
        as="article"
        maxWidth="s"
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Column>
  );
}
