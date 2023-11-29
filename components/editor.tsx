'use client'

import { useEditor, EditorContent, FloatingMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import { use, useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    dialogClose,
} from "@/components/ui/dialog"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Bold as B, Heading1, Heading2, ImageIcon, Italic, List, ListOrdered, Strikethrough, UnderlineIcon } from 'lucide-react';
import { Input } from './ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/lib/firebase'

const urlForm = z.object({
    imgurl: z.string().url({
        message: "URL must be valid.",
    }),
})

const imageForm = z.object({
    image: z.custom<File>((v) => v instanceof File, {
        message: 'Image is required',
      })
})

type Props = {
    data : string
    onChange: (data: string) => void
    documentURL?: string
}

export default function Editor({
    data, onChange, documentURL
}: Props) {
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof urlForm>>({
        resolver: zodResolver(urlForm),
        defaultValues: {
            imgurl: "",
        },
    })

    const form2 = useForm<z.infer<typeof imageForm>>({
        resolver: zodResolver(imageForm),
        defaultValues: {
            image: undefined,
        },
    })

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: '내용을 입력하세요',
            }),
            Image,
            Underline,
        ],
        content: data ?? "",

        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: "editor w-full min-h-[55vh] border-input border-none px-3 py-1 transition-colors focus-visible:outline-none",
            }
        },
    })

    useEffect(() => {
        if (editor) {
            editor.setEditable(true)
        }
    }, [editor])

    useEffect(() => {
        if (editor && data) {
            editor.commands.setContent(data)
        }
    }, [editor, data])

    const getImageURL = async (file : File) => {
        const storageRef = ref(storage, `images/postImages/${documentURL}/${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    };

    const addImageFromFile = useCallback(async (image : File) => {
        if (!editor) {
            return
        }
        try {
            setLoading(true)
            const url = await getImageURL(image)

            if (url) {
                editor.chain().focus().setImage({ src: url }).run()
            }
            setLoading(false)
            dialogClose()
        } catch (e) {
            console.error(e)
            //toast.error("이미지 업로드에 실패했습니다.")
        }
    }, [editor])

    function onImageURLSubmit(values: z.infer<typeof urlForm>) {
        addImageFromURL(values.imgurl)
    }

    function onImageSubmit(values: z.infer<typeof imageForm>) {
        addImageFromFile(values.image)
    }

    const addImageFromURL = useCallback(async (url: string) => {
        if (!editor) {
            return
        }
        try {
            setLoading(true)
            editor.chain().focus().setImage({ src: url }).run()
            setLoading(false)
            dialogClose()
        } catch (e) {
            console.error(e)
        }
    }, [editor])

    return (
        <>
            {editor ?
                <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className='ml-8'>
                    <div className="flex gap-1 flex-wrap min">
                        <Button
                            type='button'
                            variant={"outline"}
                            size={"sm"}
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                        >
                            <Heading1 />
                        </Button>
                        <Button
                        type='button'
                            variant={"outline"}
                            size={"sm"}
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                        >
                            <Heading2 />
                        </Button>
                        <Button
                        type='button'
                            variant={"outline"}
                            size={"sm"}
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={editor.isActive('bulletList') ? 'is-active' : ''}
                        >
                            <List />
                        </Button>
                        <Button
                        type='button'
                            variant={"outline"}
                            size={"sm"}
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={editor.isActive('orderedList') ? 'is-active' : ''}
                        >
                            <ListOrdered />
                        </Button>
                        <Button
                        type='button'
                            variant={"outline"}
                            size={"sm"}
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor.isActive('bold') ? 'is-active' : ''}
                        >
                            <B />
                        </Button>
                        <Button
                        type='button'
                            variant={"outline"}
                            size={"sm"}
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={editor.isActive('italic') ? 'is-active' : ''}
                        >
                            <Italic />
                        </Button>
                        <Button
                        type='button'
                            variant={"outline"}
                            size={"sm"}
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={editor.isActive('underline') ? 'is-active' : ''}
                        >
                            <UnderlineIcon />
                        </Button>
                        <Button
                        type='button'
                            variant={"outline"}
                            size={"sm"}
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={editor.isActive('strike') ? 'is-active' : ''}
                        >
                            <Strikethrough />
                        </Button>
                        <Dialog>
                            <DialogTrigger>
                                <div className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground'>
                                    <ImageIcon />
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>이미지 업로드</DialogTitle>
                                    <DialogDescription>
                                        파일을 업로드하거나 이미지 URL을 입력하세요.
                                    </DialogDescription>
                                    <Tabs defaultValue="account" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="upload">Upload</TabsTrigger>
                                            <TabsTrigger value="url">URL</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value='upload' className="w-full">
                                        <Form {...form2}>
                                                <form onSubmit={form2.handleSubmit(onImageSubmit)} className="space-y-8">
                                                    <FormField
                                                        control={form2.control}
                                                        name="image"
                                                        render={({ field : { ref, onBlur, onChange, name,} }) => (
                                                            <FormItem>
                                                                <FormLabel>이미지 파일 업로드</FormLabel>
                                                                <FormControl>
                                                                    <Input 
                                                                    type='file' 
                                                                    accept='image/*'
                                                                    ref={ref}
                                                                    name={name}
                                                                    onBlur={onBlur}
                                                                    onChange={(e) => {
                                                                        e.preventDefault()
                                                                        onChange(e.target.files?.[0])
                                                                    }}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button type="submit" disabled={loading} variant={"default"}
                                                    size={"sm"}
                                                    className='w-full mt-2'>{loading ? 'Uploading...' : 'Upload'}</Button>
                                                </form>
                                            </Form>
                                        </TabsContent>
                                        <TabsContent value='url' className="w-full">
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onImageURLSubmit)} className="space-y-8">
                                                    <FormField
                                                        control={form.control}
                                                        name="imgurl"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>이미지주소</FormLabel>
                                                                <FormControl>
                                                                <Input type="text" placeholder='이미지 주소를 입력해주세요' {...field}/>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button type="submit" disabled={loading} variant={"default"}
                                                    size={"sm"}
                                                    className='w-full mt-2'>{loading ? '업로드 중...' : '업로드'}</Button>
                                                </form>
                                            </Form>
                                        </TabsContent>
                                    </Tabs>
                                </DialogHeader>
                                {/* <DialogFooter className="sm:justify-start">
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">
                                            Close
                                        </Button>
                                    </DialogClose>
                                </DialogFooter> */}
                            </DialogContent>
                        </Dialog>
                    </div>
                </FloatingMenu> : null}
            <EditorContent editor={editor} />
        </>
    )
}
