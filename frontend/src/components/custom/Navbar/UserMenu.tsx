import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import LogoutButton from "@/components/custom/Dashboard/LogoutButton";
import { useUser } from '@/context/UserContext';

const UserMenu = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex">
        <Input
          type="search"
          placeholder="Search..."
          className="h-9 w-[200px] lg:w-[300px]"
        />
      </div>

      {user ? (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              <CircleUserRound className="h-9 w-9" strokeWidth={1} />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent align="end" className="w-[240px] p-0">
            <div className="flex flex-col">
              <div className="border-b p-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">{user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="p-2">
                <Link href="/profile" className="w-full">
                  <Button variant="ghost" className="w-full justify-start font-normal">
                    Profile
                  </Button>
                </Link>
                <div className="mt-1">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">
              Sign up
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 