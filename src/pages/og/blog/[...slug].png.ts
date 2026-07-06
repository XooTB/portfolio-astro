import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '@/lib/generate-og-image';

function toSlug(postId: string): string {
  return postId.replace(/\/index$/, '');
}

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  return posts.map((post) => ({
    params: { slug: toSlug(post.id) },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response('Not found', { status: 404 });
  }

  const posts = await getCollection('blog');
  const post = posts.find((entry) => toSlug(entry.id) === slug);

  if (!post) {
    return new Response('Not found', { status: 404 });
  }

  const png = await generateOgImage({
    title: post.data.title,
    description: post.data.description,
    author: post.data.author,
    date: post.data.date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    topics: post.data.topics,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
