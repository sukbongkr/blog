"use client";
import Link from 'next/link';
import { Button } from './ui/button'
import { PencilLine } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUser, signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Navbar = () => {
  const user = useUser();
  const router = useRouter();

  return (
    <header className='z-10 fixed top-0 left-0 right-0 flex items-center justify-betweenbg-background border-b bg-background'>
      <div className='max-w-screen-lg mx-auto w-full flex items-center justify-between py-2 px-12'>
        <Link href='/' className='text-xl font-semibold'>SukbongLabs</Link>
        <nav className='flex items-center gap-2'>
          {user ? <> <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size={'sm'} variant={'ghost'} onClick={() => router.push('/write')}>
                  <PencilLine size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>글 작성</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className='w-8 h-8 hover:opacity-90 cursor-pointer border'>
                  <AvatarImage src={user.photoURL ?? ''} />
                  <AvatarFallback>{user.displayName ? (user.displayName[0] + user.displayName[1]) : ""}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  {user.displayName}님 안녕하세요!
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={()=>router.push("/profile")}>
                    <span>내 프로필</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
            :
            <Link href='/login'>
              <Button size={'sm'} >로그인</Button>
            </Link>
          }
        </nav>
      </div>
    </header>
  )
}

export default Navbar