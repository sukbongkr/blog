'use client';

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { useUser, signInWithKaKao } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const user = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user]);

    return (
        <Card className="w-full text-center max-w-md p-12">
            <CardHeader>
                <CardTitle>로그인</CardTitle>
                <CardDescription>환영합니다.</CardDescription>
            </CardHeader>
            <CardContent className="mt-6">
                <Button onClick={signInWithKaKao} className="w-full bg-yellow-500 hover:bg-yellow-500/90">카카오로 로그인</Button>
            </CardContent>
        </Card>
    )
}