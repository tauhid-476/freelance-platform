"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  // Handle loading state
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>Hi</p>
      {session ? (
        <>
          <p>Welcome, {session.user?.name || "User"}!</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </div>
  );
}
