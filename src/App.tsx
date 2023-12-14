import { useEffect, useState, type ReactNode } from 'react';

import fetchingImg from './assets/data-fetching.png';
import BlogPosts, { type BlogPost } from './components/BlogPosts.tsx';
import { get } from './util/http.ts';
import ErrorMessage from './components/ErrorMessage.tsx';

type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchPosts() {
      setIsFetching(true);
      try {
        const data = (await get('https://jsonplaceholder.typicode.com/posts')) as RawDataBlogPost[];
        const blogPosts: BlogPost[] = data.map((rawPost) => {
          return {
            id: rawPost.id,
            title: rawPost.title,
            text: rawPost.body,
          };
        });
        setFetchedPosts(blogPosts);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
        // setError('Failed to fetch posts!');
      }

      setIsFetching(false);
    }

    fetchPosts();
  }, []);

  let content: ReactNode;
  if (error) content = <ErrorMessage text={error} />;
  if (fetchedPosts) content = <BlogPosts posts={fetchedPosts} />;
  if (isFetching) content = <p id="loading-fallback">Fetching posts...</p>;

  return (
    <main>
      <img src={fetchingImg} alt="An abstract image depicting a data fetching process." />
      {content}
    </main>
  );
}

export default App;
