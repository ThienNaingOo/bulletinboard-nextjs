import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const submit = async () => {
        console.log(email, password);
        let rrr = await signIn("credentials", {
            redirect: true,
            email: email,
            password: password,
            callbackUrl: "/post"
        }).then((result) => {
            console.log(result);
        })
        console.log(rrr);

    }

    return (
        <>
            <nav className="navbar navbar-dark bg-info bg-gradient">
                <div className="row col-12 d-flex text-white px-3">
                    <span className="h3">SCM Bulletin Board</span>
                </div>
            </nav>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header"><h3>Login Form</h3></div>

                            <div className="card-body">
                                {/* <form onSubmit={submit}> */}
                                    <div className="form-group row">
                                        <label htmlFor="email" className="col-md-4 col-form-label text-md-right">Email</label>

                                        <div className="col-md-6">
                                            <input id="email" type="email" className="form-control my-2" name="email" required autoComplete="email"
                                                onChange={e => setEmail(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label htmlFor="password" className="col-md-4 col-form-label text-md-right">Password</label>

                                        <div className="col-md-6">
                                            <input id="password" type="password" value={password} className="form-control my-2" name="password" autoComplete="current-password" required
                                                onChange={e => setPassword(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div className="col-md-11">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" name="remember" id="remember" />

                                                <label className="form-check-label" htmlFor="remember">
                                                    Remember Me
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div className="col-md-11">
                                            <a className="btn btn-link" href="">
                                                Forgot Your Password?
                                            </a>
                                        </div>
                                    </div>

                                    <div className="form-group row mb-0">
                                        <div className="col-md-8 offset-md-3">
                                            <button type="submit" className="col btn btn-info text-white mx-4 search-btn" onClick={submit}>
                                                Login
                                            </button>
                                        </div>
                                    </div>
                                {/* </form> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}