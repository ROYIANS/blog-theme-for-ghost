import { notFound } from "next/navigation";
import {
  Meta,
  Schema,
  Row,
  Column,
  HeadingNav,
  Icon,
  Text,
} from "@once-ui-system/core";
import { baseURL, person } from "@/resources";
import { getAllPages, getPageBySlug, getPageContent } from "@/lib/halo/pages";
import { PageRenderer } from "@/components/page/PageRenderer";
import { ShareSection } from "@/components/blog/ShareSection";
import { Metadata } from "next";
import "../../blog/blog-content.css";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const pages = await getAllPages();
  return pages
    .filter((page) => page.spec?.slug)
    .map((page) => ({
      slug: page.spec!.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page || !page.spec) return {};

  return Meta.generate({
    title: page.spec.title,
    description: page.status?.excerpt || "",
    baseURL: baseURL,
    image: page.spec.cover || `/api/og/generate?title=${encodeURIComponent(page.spec.title)}`,
    path: `/page/${page.spec.slug}`,
  });
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  console.log('page2', page);

  if (!page || !page.spec || !page.metadata) {
    notFound();
  }

  // Get page content
  const content = await getPageContent(page.metadata.name);

  return (
    <Row fillWidth>
      <Row maxWidth={12} m={{ hide: true }} />
      <Row fillWidth horizontal="center">
        <Schema
          as="webPage"
          baseURL={baseURL}
          path={`/page/${page.spec.slug}`}
          title={page.spec.title}
          description={page.spec.excerpt?.raw || ""}
          datePublished={page.spec.publishTime || ""}
          dateModified={page.status?.lastModifyTime || page.spec.publishTime || ""}
          image={
            page.spec.cover ||
            `/api/og/generate?title=${encodeURIComponent(page.spec.title)}`
          }
          author={{
            name: page?.status?.contributors?.join(', ') || person.name,
            url: baseURL,
            image: `${baseURL}${person.avatar}`,
          }}
        />

        <PageRenderer page={page} content={content} />

        <ShareSection
          title={page.spec.title}
          url={`${baseURL}/page/${page.spec.slug}`}
        />
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
