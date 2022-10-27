import React, { useState } from "react";
import '../styles/globals.css'
import Head from "next/head";
import { SessionProvider } from "next-auth/react"
import Script from 'next/script';
import UserContext from "hooks/userContext";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState({ name: '', email: '', password: '', type: 0, phone: '', dob: '', file: '', createObjectURL: '', address: '' })
  const state: any = { user, setUser }

  return (
    <SessionProvider>
      <UserContext.Provider value={state}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous"></link>
        </Head>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></Script>
        <Component {...pageProps} />
      </UserContext.Provider>
    </SessionProvider>
  )
}

export default MyApp
