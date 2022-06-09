import React from 'react';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

function Header() {
    const { data: session }: any = useSession();
    const lazyRoot = React.useRef(null);    

    return (
        <nav className="navbar navbar-expand-lg bg-info bg-gradient">
            <div className="container">
                <a className="navbar-brand d-flex me-5 flex-row align-items-center text-white" href="/">
                    <Image className="" lazyRoot={lazyRoot} src="/common/app.png" width="30" height="30" />
                    <p className="fs-4 fw-bolder text-white ms-2 mb-0">SCM Bulletin Board</p>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {(session?.user.type == "0") ?
                            <li className="nav-item me-3">
                                <a className="nav-link active text-white fs-6" aria-current="page" href="/user/list">User</a>
                            </li>
                            : null
                        }
                        <li className="nav-item">
                            <a className="nav-link text-white fs-6" href="/post">Posts</a>
                        </li>
                    </ul>
                    {session ?
                        <div className="d-flex">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item ml-3">
                                    <a className="nav-link active" aria-current="page" href="/user/profile">
                                        <p className='text-white fw-bold'>{session.user?.name}</p>
                                    </a>
                                </li><p className='text-white fw-bold align-self-center'>|</p>
                                <li className="nav-item">
                                    <a className="nav-link active text-white" aria-current="page" href='/login' onClick={() => {
                                        signOut({ callbackUrl: '/login', redirect: true })
                                    }}><p className='text-white fw-bold'>Log out</p></a>
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