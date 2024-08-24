'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Dancing_Script } from 'next/font/google';
const dancingScript = Dancing_Script({ subsets: ['latin'] });
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faHome } from '@fortawesome/free-solid-svg-icons'

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  date?: string;
  readingTime: number;
  firstImage: string | null;
  tags?: string[];
}

interface ArchiveStructure {
  [year: string]: {
    months: {
      [month: string]: BlogPost[];
    };
    totalPosts: number;
  };
}

function slugify(text: string): string {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default function Home() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [archiveStructure, setArchiveStructure] = useState<ArchiveStructure>({});
  const [expandedYears, setExpandedYears] = useState<{[year: string]: boolean}>({});
  const [expandedMonths, setExpandedMonths] = useState<{[yearMonth: string]: boolean}>({});
  const [selectedTag, setSelectedTag] = useState<string>("ALL");

  useEffect(() => {
    async function getPosts() {
      const response = await fetch('/api/posts');
      const posts = await response.json();
      console.log('Raw API response:', posts);
      setBlogPosts(posts);

      // Collect all tags and remove duplicates
      const tags = posts.flatMap((post: BlogPost) => post.tags || []) as string[];
      const uniqueTags = Array.from(new Set(tags));
      setAllTags(uniqueTags);

      // Create archive structure
      const archive: ArchiveStructure = {};
      posts.forEach((post: BlogPost) => {
        console.log('Processing post:', post);
        if (post.date) {
          const date = new Date(post.date);
          const year = date.getFullYear().toString();
          const month = date.toLocaleString('default', { month: 'long' });
          if (!archive[year]) {
            archive[year] = { totalPosts: 0, months: {} };
          }
          if (!archive[year].months[month]) {
            archive[year].months[month] = [];
          }
          archive[year].months[month].push(post);
          archive[year].totalPosts += 1;
        }
      });
      setArchiveStructure(archive);
    }
    getPosts();
  }, []);

  const filteredPosts = selectedTag === "ALL"
    ? blogPosts
    : blogPosts.filter(post => post.tags && post.tags.includes(selectedTag));

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setSelectedPost(null);
  };
  
  function slugify(text: string): string {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  function extractTextExcerpt(markdown: string, length: number = 100): string {
    const textContent = markdown.replace(/!\[.*?\]\(.*?\)/g, '');
    const plainText = textContent.replace(/[#*_`]/g, '');
    return plainText.length > length ? plainText.slice(0, length) + '...' : plainText;
  }

  function formatDate(dateString?: string): string {
    if (!dateString) return 'No date available';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const toggleYear = (year: string) => {
    setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }));
  };

  const toggleMonth = (year: string, month: string) => {
    const key = `${year}-${month}`;
    setExpandedMonths(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderers = {
    img: (image: { src: string; alt: string }) => (
      <Image
        src={image.src}
        alt={image.alt}
        width={500}
        height={300}
        layout="responsive"
      />
    ),
  };

  const CustomImage = ({ src, alt }: { src: string; alt: string }) => {
    return (
      <Image
        src={src}
        alt={alt}
        width={800}
        height={400}
        objectFit="cover"
        className="w-full rounded-lg my-4"
      />
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b py-6">
        <div className="container mx-auto text-center">
          <h1 className={`text-4xl font-bold text-gray-800 mb-2 ${dancingScript.className}`}>
             This Blog is the Property of Huayanjun
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 overflow-hidden">
        <div className="flex w-full">
          <div className="w-5/6 flex flex-col bg-gray-100 overflow-y-auto">
            <div className="flex-grow p-4">
              {selectedPost ? (
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <button 
                      onClick={() => setSelectedPost(null)}
                      className="text-black hover:text-blue-800 transition-colors duration-200 mr-4 pl-4"
                      title="返回主页"
                    >
                      <FontAwesomeIcon icon={faHome} className="text-2xl" />
                    </button>
                    <h1 className="text-3xl font-bold text-center flex-grow">{selectedPost.title}</h1>
                  </div>
                  <div className="flex justify-center items-center mb-4 flex-wrap gap-x-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags && selectedPost.tags.map((tag, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm">{selectedPost.readingTime} min read</span>
                  </div>
                  <div className="flex">
                    <div className="w-full pl-4 prose prose-lg">
                      <ReactMarkdown
                        components={{
                          img: ({ src, alt }) => <CustomImage src={src || ''} alt={alt || ''} />,
                          h1: ({ children }) => <h1 className="text-3xl font-bold mt-6 mb-4">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-2xl font-bold mt-5 mb-3">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
                          h4: ({ children }) => <h4 className="text-lg font-bold mt-3 mb-2">{children}</h4>,
                          h5: ({ children }) => <h5 className="text-base font-bold mt-2 mb-1">{children}</h5>,
                          h6: ({ children }) => <h6 className="text-sm font-bold mt-2 mb-1">{children}</h6>,
                          p: ({ children }) => {
                            if (Array.isArray(children) && children[0] && typeof children[0] === 'object' && 'type' in children[0] && children[0].type === 'img') {
                              return <>{children}</>;
                            }
                            return <p className="mb-4">{children}</p>;
                          },
                        }}
                      >
                        {selectedPost.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-6">{formatDate(selectedPost.date)}</p>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    {filteredPosts.map((post) => (
                      <div 
                        key={post.id} 
                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer relative border border-gray-200"
                        onClick={() => setSelectedPost(post)}
                      >
                        {post.firstImage ? (
                          <div className="w-full h-48 relative">
                            <Image 
                              src={post.firstImage} 
                              alt={post.title} 
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                        <div className="p-4 flex flex-col">
                          <h2 className="text-lg font-bold mb-2 line-clamp-2">{post.title}</h2>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex flex-wrap gap-1">
                              {post.tags && post.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                              {post.tags && post.tags.length > 2 && (
                                <span className="text-xs text-gray-500">+{post.tags.length - 2}</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {post.readingTime} min read
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-1/6 bg-gray-100 flex flex-col">
            <div className="flex-grow py-4 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                {/* Personal intro */}
                <div className="p-4 border-b flex flex-col items-center text-center">
                  <div className="mb-3">
                    <Image
                      src="/images/profile.jpg"
                      alt="huayanjun"
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  </div>
                  <h2 className="text-lg font-semibold">huayanjun</h2>
                  <p className="text-gray-600 text-sm mt-1">写代码，最重要的优雅!</p>
                  {/* New contact info */}
                  <a 
                    href="mailto:huayanjun@136.com" 
                    className="text-black hover:text-blue-800 transition-colors duration-200 py-1"
                    title="发送邮件给我"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
                  </a>
          
                </div>

                {/* Tags */}
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleTagClick("ALL")}
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        selectedTag === "ALL"
                          ? 'bg-purple-200 text-purple-800'
                          : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      }`}
                    >
                      ALL
                    </button>
                    {allTags.map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => handleTagClick(tag)}
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          selectedTag === tag
                            ? 'bg-purple-200 text-purple-800'
                            : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Archives */}
                <div className="p-4 flex-grow overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-3">Archives</h3>
                  <ul className="text-sm text-gray-600">
                    {Object.entries(archiveStructure)
                      .sort(([a], [b]) => parseInt(b) - parseInt(a))
                      .map(([year, yearData]) => (
                      <li key={year} className="mb-2">
                        <button 
                          onClick={() => toggleYear(year)}
                          className="w-full text-left font-medium hover:text-blue-600"
                        >
                          {year} ({yearData.totalPosts})
                        </button>
                        {expandedYears[year] && (
                          <ul className="ml-4 mt-1">
                            {Object.entries(yearData.months)
                              .sort(([a], [b]) => {
                                const monthOrder = ['December', 'November', 'October', 'September', 'August', 'July', 'June', 'May', 'April', 'March', 'February', 'January'];
                                return monthOrder.indexOf(a) - monthOrder.indexOf(b);
                              })
                              .map(([month, posts]) => (
                              <li key={`${year}-${month}`} className="mb-1">
                                <button 
                                  onClick={() => toggleMonth(year, month)}
                                  className="w-full text-left hover:text-blue-600"
                                >
                                  {month} ({posts.length})
                                </button>
                                {expandedMonths[`${year}-${month}`] && (
                                  <ul className="ml-4 mt-1">
                                    {posts.map(post => (
                                      <li key={post.id} className="mb-1">
                                        <button 
                                          onClick={() => setSelectedPost(post)}
                                          className="text-blue-600 hover:underline"
                                        >
                                          {post.title}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-black py-4">
        <div className="container mx-auto px-4">
          <div className="mt-8 text-center text-sm">
            <p className="mt-2">
              <a 
                href="https://beian.miit.gov.cn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                苏ICP备2023023847号
              </a>
            </p>
            <p>&copy; {new Date().getFullYear()} Huayanjun&apos;s Blog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}