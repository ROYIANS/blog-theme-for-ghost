import { getPosts } from "@/lib/halo/posts";
import { Grid } from "@once-ui-system/core";
import Post from "./Post";
import type { ListedPostVo } from "@halo-dev/api-client";

interface PostsProps {
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
}

export async function Posts({
  range,
  columns = "1",
  thumbnail = false,
  direction,
}: PostsProps) {
  // Fetch posts from Halo API
  const { items: allPosts } = await getPosts({ size: 100, page: 1 });

  // Filter out posts without spec and sort by publish time (newest first)
  const validPosts = allPosts.filter((post) => post.spec?.slug && post.spec?.title);

  const sortedPosts = validPosts.sort((a, b) => {
    const dateA = a.spec?.publishTime ? new Date(a.spec.publishTime).getTime() : 0;
    const dateB = b.spec?.publishTime ? new Date(b.spec.publishTime).getTime() : 0;
    return dateB - dateA;
  });

  // Apply range filter
  const displayedPosts = range
    ? sortedPosts.slice(range[0] - 1, range.length === 2 ? range[1] : sortedPosts.length)
    : sortedPosts;

  return (
    <>
      {displayedPosts.length > 0 && (
        <Grid columns={columns} s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
          {displayedPosts.map((post) => (
            <Post key={post.metadata.name} post={post} thumbnail={thumbnail} direction={direction} />
          ))}
        </Grid>
      )}
    </>
  );
}
