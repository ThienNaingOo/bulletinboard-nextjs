import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router'

function Home(props: any) {
  const router = useRouter()
  const { data: session } = useSession();

  useEffect(() => {
    if (session == null) {
      router.push('/login');
    } else {
      router.push('/post');
    }
  })

  return (
    <>
    </>
  )
}

export default Home