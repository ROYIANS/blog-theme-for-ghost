"use client";

import { Card, Column, Media, Row, Avatar, Text } from "@once-ui-system/core";
import { formatDate } from "@/utils/formatDate";
import { person } from "@/resources";
import type { ListedPostVo } from "@halo-dev/api-client";

interface PostProps {
  post: ListedPostVo;
  thumbnail?: boolean;
  direction?: "row" | "column";
}

export default function Post({ post, thumbnail = false, direction }: PostProps) {
  return (
    <Card
      fillWidth
      key={post.metadata.name}
      href={`/blog/${post.spec.slug}`}
      transition="micro-medium"
      direction={direction}
      border="transparent"
      background="transparent"
      padding="4"
      radius="l-4"
      gap={direction === "column" ? undefined : "24"}
      s={{ direction: "column" }}
    >
      {post.spec.cover && thumbnail && (
        <Media
          priority
          sizes="(max-width: 768px) 100vw, 640px"
          border="neutral-alpha-weak"
          cursor="interactive"
          radius="l"
          src={post.spec.cover}
          alt={"Thumbnail of " + post.spec.title}
          aspectRatio="16 / 9"
        />
      )}
      <Row fillWidth>
        <Column maxWidth={28} paddingY="24" paddingX="l" gap="20" vertical="center">
          <Row gap="24" vertical="center">
            <Row vertical="center" gap="16">
              <Avatar src={person.avatar} size="s" />
              <Text variant="label-default-s">{post.owner?.displayName || person.name}</Text>
            </Row>
            {post.spec.publishTime && (
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {formatDate(post.spec.publishTime, false)}
              </Text>
            )}
          </Row>
          <Text variant="heading-strong-l" wrap="balance">
            {post.spec.title}
          </Text>
          {post.categories && post.categories.length > 0 && (
            <Text variant="label-strong-s" onBackground="neutral-weak">
              {post.categories[0].spec.displayName}
            </Text>
          )}
        </Column>
      </Row>
    </Card>
  );
}
