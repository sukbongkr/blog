import { getPost } from "@/lib/db";
import PostTitle from "./postTitle";

//export const revalidate = 60 * 60 * 24; // 24 hours

export async function getPostData(postId: string) {
    const post = await getPost(postId);

    return post;
}

export default async function PostDetailPage({ params: { postId } }: { params: { postId: string } }) {
    const post = await getPostData(postId);

    return (
        <section className="flex flex-col gap-8 w-full px-4">
            {/* post detail */}
            {
                post ? (
                    <>
                        <PostTitle
                        id = {postId}
                        title={post?.title}
                        author = {post?.author}
                        authorName={post?.authorName}
                        authorAvatar={post?.authorAvatar}
                        createdAt={post?.createdAt}

                        />
                        <div className="editor w-full sm:px-6 lg:px-8" dangerouslySetInnerHTML={{ __html: post?.content }} />
                    </>
                ) : <p>404 not found 문서가 없습니다.</p>
            }
            {/* comments */}
        </section>
    )
}
