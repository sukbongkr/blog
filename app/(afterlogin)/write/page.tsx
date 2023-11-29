"use client"

import Editor from "@/components/editor"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { getUser } from "@/lib/auth"
import { createAndUpdatePost, getPost } from "@/lib/db"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { v4 as uuid } from 'uuid';
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    content: z.string().min(100, {
        message: "Content must be at least 100 characters.",
    }),
    tag: z.string()
})

export default function WritePage() {
    const router = useRouter()
    const user = getUser()
    const searchParams = useSearchParams()

    const [loading, setLoading] = useState(false)
    const [postId, setPostId] = useState("")

    const [initialData, setInitialData] = useState("")

    useEffect(() => {
        const id = searchParams.get("postid")
        async function postExists(id: string) {
            const post = await getPost(id)

            if (!post) {
                throw new Error("Post not found")
            }

            form.setValue("title", post.title)
            setInitialData(post.content)
            form.setValue("tag", "#" + post.tag.join("#"))
        }

        if (id) {
            setPostId(id)
            postExists(id)

        } else {
            setPostId(uuid())
        }
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            tag: "",
        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {

        setLoading(true)

        if (!user) {
            throw new Error("You must be logged in to create a post.")
        }
        const { title, content } = values

        const tag = values.tag ? values.tag.split("#")
            .filter((item) => item !== "")
            .map((item) => item.replace(/[^\w\sㄱ-힣]/g, "")) : ""

        const description = content.replace(/<[^>]*>/g, '').substring(0, 50);;
        //post 부분은 데이터 구조를 손을 봐야합니다.
        const post = {
            title: title,
            content: content,
            description: description,
            createdAt: new Date(),
            tag: tag,
            author: user.uid,
            authorName: user.displayName,
            authorAvatar: user.photoURL,
        }

        createAndUpdatePost(post, postId).then(() => {
            toast({
                title: "문서를 업로드했습니다."
            })
            setLoading(false)
            router.push(`/post/${postId}`)
        }).catch((error) => {
            toast({
                title: "문서를 업로드하지 못했습니다. 다시 시도해주세요."
            })
        })
    }

    return (
        <section className="w-full mt-6">
            {/* write page */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                {/* <FormLabel>Title</FormLabel> */}
                                <FormControl>
                                    <Input placeholder="제목을 입력해주세요" {...field}
                                        className="text-2xl focus-visible:ring-0 border-t-0 border-r-0 border-l-0 border-b rounded-none focus-visible:border-ring"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field: { onChange } }) => (
                            <FormItem>
                                {/* <FormLabel>내용</FormLabel> */}
                                <FormControl>
                                    <Editor data={initialData} onChange={onChange} documentURL={postId} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tag"
                        render={({ field }) => (
                            <FormItem>
                                {/* <FormLabel>Title</FormLabel> */}
                                <FormControl>
                                    <Input placeholder="#태그를 입력해주세요" {...field}
                                        className="text-xl focus-visible:ring-0 border-t-0 border-r-0 border-l-0 border-b rounded-none focus-visible:border-ring"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">
                        {
                            loading ? "업로드 중..." : "완료하기"
                        }
                    </Button>
                </form>
            </Form>
        </section>
    )
}