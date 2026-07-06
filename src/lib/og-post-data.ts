export type BlogPostOgSource = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

export function resolveOgTitle(data: BlogPostOgSource): string {
  return data.ogTitle ?? data.title;
}

export function resolveOgDescription(data: BlogPostOgSource): string {
  return data.ogDescription ?? data.description;
}
