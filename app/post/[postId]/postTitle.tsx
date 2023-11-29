"use client"

import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import 'dayjs/locale/ko'
import { Timestamp } from "firebase/firestore"
import { getUser } from "@/lib/auth"

import { XCircle } from "lucide-react"

import Link from "next/link"
import { deletePost } from "@/lib/db"
import { DialogClose } from "@radix-ui/react-dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

dayjs.extend(relativeTime);
dayjs.locale("ko")

type Props = {
    id: string
    title: string
    author: string
    authorName: string
    authorAvatar: string
    createdAt: Timestamp
}

export default function PostTitle({ id, title, author, authorName, authorAvatar, createdAt }: Props) {
    const user = getUser();
    const router = useRouter();

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Avatar className="hover:opacity-90 cursor-pointer border">
                            <AvatarImage alt="Author's avatar" src={authorAvatar} />
                            <AvatarFallback>AN</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{authorName}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Posted {dayjs(createdAt.seconds * 1000).fromNow()}</div>
                        </div>
                    </div>

                    {
                        user && user.uid === author ?
                            <div className="flex items-center gap-2">
                                <Link href={`/write?postid=${id}`}>
                                    <Button variant="outline" size={"sm"}>
                                        수정
                                    </Button>
                                </Link>
                                <Dialog>
                                    <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/70 h-9 px-3">
                                        <XCircle size={16} />
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>문서를 삭제하시겠습니까?</DialogTitle>
                                            <DialogDescription>
                                                삭제된 문서는 복구할 수 없습니다.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            
                                            onClick={() => {
                                               deletePost(id).then(() => {
                                                    toast({
                                                         title: "문서를 삭제했습니다."
                                                    })
                                                    router.push("/")
                                                  }).catch((error) => {
                                                    toast({
                                                         title: "문서를 삭제하지 못했습니다. 다시 시도해주세요."
                                                    })
                                                  })
                                            }}
                                        >
                                            삭제
                                        </Button>
                                        <DialogClose asChild>
                                            <Button variant="outline" size="sm" >
                                                취소
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                    </DialogContent>           
                                </Dialog>
                            </div>
                            : null
                    }
                </div>
                <h1 className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-gray-100">{title}</h1>
            </div>
        </div>
    )
}
