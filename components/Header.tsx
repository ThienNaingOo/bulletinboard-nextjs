import React, { useContext, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from 'next/link';
import UserContext from 'hooks/userContext';

function Header() {
    const { setUser }: any = useContext(UserContext)
    const { data: session }: any = useSession();
    const lazyRoot = React.useRef(null);

    const clearUserContext = () => {
        setUser({ name: '', email: '', password: '', type: '', phone: '', dob: '', file: '', address: '', oldimg: '' })
    }

    useEffect(() => {})

    return (
        <nav className="navbar navbar-expand-lg bg-info bg-gradient">
            <div className="container">

                <div className="navbar-brand d-flex me-5 flex-row align-items-center text-white">
                    <Image className="" alt='BulletinBoard Logo' lazyRoot={lazyRoot} src="/common/app.png" width="30" height="30" />
                    <Link href="/" >
                        <a onClick={(e)=> clearUserContext()} className="fs-4 fw-bolder text-white ms-2 mb-0">SCM Bulletin Board</a>
                    </Link>
                </div>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-5 ps-5">
                        {(session?.user.type == "0") ?
                            <li className="nav-item me-3">
                                <Link href="/user">
                                    <a onClick={(e)=> clearUserContext()} className="nav-link active text-white fs-6">User</a>
                                </Link>
                            </li>
                            : null
                        }
                        <li className="nav-item">
                            <Link href="/post">
                                <a onClick={(e)=> clearUserContext()} className="nav-link active text-white fs-6">Posts</a>
                            </Link>
                        </li>
                    </ul>
                    {session ?
                        <div className="d-flex">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item ml-3">
                                    <Link href="/user/profile">
                                        <a onClick={(e)=> clearUserContext()} className="text-white fw-bold">{session.user?.name}</a>
                                    </Link>
                                    {/* <a className="nav-link active" aria-current="page" href="/user/profile">
                                        <p className='text-white fw-bold'></p>
                                    </a> */}
                                </li>
                                <p className='text-white fw-bold mx-3'>|</p>
                                <li className="nav-item">
                                    {/* <a className="nav-link active text-white" aria-current="page" href='/login' onClick={() => {
                                        signOut({ callbackUrl: '/login', redirect: true })
                                    }}><p className='text-white fw-bold'>Log out</p></a> */}
                                    <Link href='/login' >
                                        <a className="text-white" onClick={() => {
                                            clearUserContext()
                                            signOut({ callbackUrl: '/login', redirect: true })
                                        }}>Logout</a>
                                    </Link>
                                </li>
                            </ul>
                        </div> : null
                    }
                </div>
            </div>

        </nav>
    )
}
export default Header;