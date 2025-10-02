"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IUser } from "@/types/user";

type HeaderProps = {
  title: string;
  name?: string;       // user full name
  avatarUrl?: string;  // optional avatar
};

export function AppHeader({ title }: HeaderProps) {
    const [showOptions, setShowOptions] = useState(false);
    const [user, setUser] = useState<IUser | null>(null);
    const router = useRouter();
  
      // Load user from localStorage on client-side only
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
        setUser(JSON.parse(storedUser));
        }
    }, []);
    
    // Generate initials
    console.log("parsed user: ", user);
    const initials = user?.name
        .split(" ")
        .map((n:string) => n[0].toUpperCase())
        .slice(0, 2)
        .join("");

    
    const handleLogout = async ()=>{
        try{
            const res = await axios.post('/api/auth/logout', {}, { withCredentials: true });
            localStorage.removeItem("user");
            router.push("/login");
        }catch(err){
            console.log(err)
        }
    }

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm mt-0">
      {/* Left: Page title */}
      <h1 className="text-xl font-semibold text-gray-800 pl-5">{title}</h1>

      {/* Right: Avatar / Initials */}
      <div className="relative" onClick={()=> setShowOptions(!showOptions)}>
        {user?.profile?.avatar ? (
          <Image
            src={user?.profile?.avatar}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full border border-gray-300 object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium text-sm cursor-pointer hover:ring-2 hover:ring-blue-400 transition">
            {initials}
          </div>
        )}
      </div>

      <Card className={showOptions ? 'absolute right-5 top-15 block w-36 p-2' : "hidden"}>
        <ul className="flex flex-col space-y-0.5">
            <li>
            <Link
                href="/profile"
                className="block w-full px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
            >
                Profile
            </Link>
            </li>
            <li>
            <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full cursor-pointer justify-start px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
            >
                Logout
            </Button>
            </li>
        </ul>
      </Card>
    </header>
  );
}
