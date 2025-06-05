"use client";

import { authClient } from "@/auth-client";
import Link from "next/link";
import SignoutButton from "@/components/signout-button";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
  const { data, isPending } = authClient.useSession();
  if (isPending) return <div>Loading...</div>;

  const session = data;

  return !session ? (
    <div className="flex gap-5 justify-center">
      <Link href="/sign-in">
        <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
          Sign In
        </Button>
      </Link>
      {/* <Link href="/sign-up">
        <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
          Sign Up
        </Button>
      </Link> */}
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Link href="/">
        <Button> Home </Button>
      </Link>
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white  rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
        <SignoutButton />
      </div>
    </div>
  );
}
