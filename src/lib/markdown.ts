import { remark } from 'remark';
import html from 'remark-html';
import math from 'remark-math';
import katex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export async function processMarkdown(content: string) {
  const { content: mdContent } = matter(content);
  const result = await unified()
    .use(remarkParse)
    .use(math)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeRaw)
    .use(katex)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(mdContent);

  return result.toString();
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
} 