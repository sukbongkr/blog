import PostListItem from "@/components/postlistitem";
import { getAllPosts } from "@/lib/db";

export async function getPostsData() {
  const posts = await getAllPosts();
  
  return {
    posts,
  };
}

export default async function Home() {
  const data = await getPostsData();

  return (
    <>
      {/* landing page */}

      {/* post list */}
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
              likes={post.likes}
              tags={post.tag}
              comments={post.comments}
              postlink={`/post/${post.id}`}
              authorlink={`/author/${post.author}`}
            />
          ))
        }
      </section>
    </>
  )
}
