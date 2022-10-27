import React from "react";
import { getSession } from "next-auth/react";

function Home(props: any) {

  return (
    <></>
  )
}

export const getServerSideProps = async (ctx) => {
  const session: any = await getSession(ctx)
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      }
    }
  } else return {
    redirect: {
      permanent: false,
      destination: '/post'
    }
  }
}

export default Home