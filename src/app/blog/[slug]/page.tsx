import { notFound } from "next/navigation";
import {
  Meta,
  Schema,
  Column,
  Heading,
  HeadingNav,
  Icon,
  Row,
  Text,
  SmartLink,
  Avatar,
  Media,
  Line,
} from "@once-ui-system/core";
import { baseURL, about, blog, person } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { getPosts, getPostBySlug, getPostContent } from "@/lib/halo/posts";
import { Metadata } from "next";
import { Posts } from "@/components/blog/Posts";
import { ShareSection } from "@/components/blog/ShareSection";
import type { ListedPostVo } from "@halo-dev/api-client";
import "../blog-content.css";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { items } = await getPosts({ size: 1000 });
  return items
    .filter((post) => post.spec?.slug)
    .map((post) => ({
      slug: post.spec!.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.spec) return {};

  return Meta.generate({
    title: post.spec.title,
    description: post.spec.excerpt?.raw || "",
    baseURL: baseURL,
    image: post.spec.cover || `/api/og/generate?title=${encodeURIComponent(post.spec.title)}`,
    path: `${blog.path}/${post.spec.slug}`,
  });
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.spec || !post.metadata) {
    notFound();
  }

  // Get post content
  const content = await getPostContent(post.metadata.name);

  return (
    <Row fillWidth>
      <Row maxWidth={12} m={{ hide: true }} />
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">
          <Schema
            as="blogPosting"
            baseURL={baseURL}
            path={`${blog.path}/${post.spec.slug}`}
            title={post.spec.title}
            description={post.spec.excerpt?.raw || ""}
            datePublished={post.spec.publishTime || ""}
            dateModified={post.status?.lastModifyTime || post.spec.publishTime || ""}
            image={
              post.spec.cover ||
              `/api/og/generate?title=${encodeURIComponent(post.spec.title)}`
            }
            author={{
              name: post.owner?.displayName || person.name,
              url: `${baseURL}${about.path}`,
              image: `${baseURL}${person.avatar}`,
            }}
          />
          <Column maxWidth="s" gap="16" horizontal="center" align="center">
            <SmartLink href="/blog">
              <Text variant="label-strong-m">Blog</Text>
            </SmartLink>
            {post.spec.publishTime && (
              <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
                {formatDate(post.spec.publishTime)}
              </Text>
            )}
            <Heading variant="display-strong-m">{post.spec.title}</Heading>
          </Column>
          <Row marginBottom="32" horizontal="center">
            <Row gap="16" vertical="center">
              <Avatar size="s" src={person.avatar} />
              <Text variant="label-default-m" onBackground="brand-weak">
                {post.owner?.displayName || person.name}
              </Text>
            </Row>
          </Row>
          {post.spec.cover && (
            <Media
              src={post.spec.cover}
              alt={post.spec.title}
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

          <ShareSection
            title={post.spec.title}
            url={`${baseURL}${blog.path}/${post.spec.slug}`}
          />

          <Column fillWidth gap="40" horizontal="center" marginTop="40">
            <Line maxWidth="40" />
            <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
              Recent posts
            </Heading>
            <Posts range={[1, 2]} columns="2" thumbnail direction="column" />
          </Column>
        </Column>
      </Row>
      <Column
        maxWidth={12}
        paddingLeft="40"
        fitHeight
        position="sticky"
        top="80"
        gap="16"
        m={{ hide: true }}
      >
        <Row
          gap="12"
          paddingLeft="2"
          vertical="center"
          onBackground="neutral-medium"
          textVariant="label-default-s"
        >
          <Icon name="document" size="xs" />
          On this page
        </Row>
        <HeadingNav fitHeight />
      </Column>
    </Row>
  );
}

// ISR: Revalidate every 60 seconds
export const revalidate = 60;
