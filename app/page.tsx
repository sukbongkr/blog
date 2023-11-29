import PostListItem from "@/components/postlistitem";
import { getAllPosts } from "@/lib/db";

export const dynamic = 'force-dynamic';

async function getPosts() {
  const posts = await getAllPosts();
  
  return {
    posts,
  };
}

export default async function Home() {
  const data = await getPosts();

  return (
    <>
      <section className="flex flex-col gap-8 w-full">
       
        {
          data.posts.map((post) => (
            <PostListItem
              key={post.id}
              title={post.title}
              description={post.description}
              avatar={post.authorAvatar}
              author={post.authorName}
              createdAt={post.createdAt}
              tags={post.tag}
              postlink={`/post/${post.id}`}
              authorlink={`/author/${post.author}`}
            />
          ))
        }
      </section>
    </>
  )
}
