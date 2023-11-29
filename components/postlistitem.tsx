import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import Link from "next/link"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import 'dayjs/locale/ko'
import { Timestamp } from "firebase/firestore"

dayjs.extend(relativeTime);
dayjs.locale("ko")

type Props = {
    title: string
    description: string
    createdAt: Timestamp
    author: string
    avatar: string
    likes?: number
    comments?: number
    tags: string[]
    postlink: string
    authorlink: string
}

const PostListItem = ({
    title,
    description,
    createdAt,
    author,
    avatar,
    authorlink,
    postlink,
    tags
}: Props) => {
    return (
        <article className="flex items-center w-full p-4 gap-4 border-b">
            <div className="flex flex-col flex-1">
                <header className="flex items-center gap-1">
                    <Link href={authorlink} className="flex items-center gap-2">
                        <Avatar className="hover:opacity-90 cursor-pointer border">
                            <AvatarImage src={avatar} />
                            <AvatarFallback>{author[0] + author[1]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                            <p className="text-sm font-medium">{author}</p>
                            <p className="text-xs font-light text-gray-600">{dayjs(createdAt.seconds * 1000).fromNow()}</p>
                        </div>
                    </Link>         
                </header>
                <Link href={postlink} className="mt-2 flex flex-col">
                    <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
                    <p className="text-gray-600 line-clamp-2 text-sm md:text-base">{description}</p>
                </Link>
                <div className="flex items-center gap-2 mt-4">
                    {   
                        tags &&
                        tags.map((tag) => (
                            <Badge key={tag} className="cursor-pointer">{tag}</Badge>
                        ))
                    }
                </div>
            </div>
            {/* <Link href={postlink} className="hidden sm:flex bg-slate-400 aspect-square">
                <img src="https://picsum.photos/200" alt="post thumbnail" className="object-cover w-full h-full" />
            </Link> */}
        </article>
    )
}

export default PostListItem