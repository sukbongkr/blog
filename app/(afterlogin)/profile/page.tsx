"use client";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useUser, updateUserProfile } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";


const formSchema = z.object({
    username: z.string().min(2).max(50),
    userPhotoURL: z.string().url(),
})

export default function Component() {
    const user = useUser();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',

            userPhotoURL: '',
        },
    })

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        form.setValue('username', user?.displayName!)
       
        form.setValue('userPhotoURL', user?.photoURL!)
    }, [user])

    const getImageURL = async (file: File) => {
        const storageRef = ref(storage, `images/profie/${user?.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    };

    const handleImage = async () => {
        setLoading(true);
        const file = (document.getElementById('profilePicture') as HTMLInputElement).files![0];

        const res = await getImageURL(file)
        form.setValue('userPhotoURL', res)
        setLoading(false);

    }

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await updateUserProfile(data.username, data.userPhotoURL);
            toast({
                "title": "프로필 변경 완료",
            })
            router.push('/')
        } catch (error) {
            toast({
                "title": "프로필 수정 실패. 다시 시도해주세요.",
            })
        }
    }

    return (
        <Card className="w-full max-w-lg py-6">
            <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Update your profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="userPhotoURL"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile image</FormLabel>
                                    <Label htmlFor="profilePicture">
                                        <Avatar className='w-24 h-24 hover:opacity-90 cursor-pointer'>
                                            <AvatarImage src={form.getValues("userPhotoURL")} />
                                            <AvatarFallback>{user?.displayName ? (user.displayName[0] + user.displayName[1]) : ""}</AvatarFallback>
                                        </Avatar>
                                    </Label>
                                    <FormControl>
                                        <>
                                            <Input id="profilePicture" type="file" className="hidden" onChange={() => handleImage()} />
                                            <Input className="hidden" {...field} />
                                        </>
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">{loading ? "로딩중" : "수정하기"}</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

