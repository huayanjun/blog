import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function extractFirstImage(content: string): string | null {
  const match = content.match(/!\[.*?\]\((.*?)\)/);
  return match ? match[1] : null;
}

export async function GET() {
  const postsDirectory = path.join(process.cwd(), 'src/app/posts');
  const filenames = await fs.readdir(postsDirectory);
  
  const posts = await Promise.all(filenames.map(async (filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    const readingTime = calculateReadingTime(content);
    const firstImage = extractFirstImage(content);
    return {
      id: filename.replace(/\.md$/, ''),
      title: data.title || 'Untitled',
      date: data.date || null,
      author: data.author || 'Anonymous',
      tags: data.tags || [],
      slug: filename.replace(/\.md$/, ''),
      excerpt: data.excerpt || content.slice(0, 150) + '...',
      content,
      readingTime,
      firstImage
    };
  }));

  return NextResponse.json(posts);
}