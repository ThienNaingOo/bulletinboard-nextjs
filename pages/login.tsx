import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/router';

export default function Login() {
    const [email, setEmail] = useState("")
    const [showError, setShowError] = useState({
        password: false,
        email: false,
    })
    const [password, setPassword] = useState("")
    const router = useRouter();
    const emailregex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;

    const submit = async () => {
        await signIn("credentials", {
            redirect: false,
            email: email,
            password: password,
            callbackUrl: "/post"
        }).then((result: any) => {
            (result.error == null) ? router.replace('/post') : alert("Email or password is incorrect.")
        }).catch((error) => (alert("Email or password is incorrect."), console.log(error.error)
        )
        )
    }

    const checkvalid = () => {
        setShowError({
            email: email == "" || !emailregex.test(email),
            password: password == "" || password.length < 6 || password.length > 20
        });

        email == "" ||
            !emailregex.test(email) ||
            password == "" ||
            password.length < 6 ||
            password.length > 20
            ? null
            : submit()
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
                                <div className="form-group row">
                                    <label htmlFor="email" className="col-md-3 col-form-label text-md-right">Email</label>

                                    <div className="col-md-6">
                                        <input id="email" type="email" className="form-control my-2" name="email" required autoComplete="email"
                                            onChange={e => (setEmail(e.target.value), setShowError({email: false, password: false}))} />
                                    </div>{
                                        showError.email ? (
                                            email == "" ? (
                                                <div className="row col-md-3"><small className="text-danger align-self-center">Email is required.</small></div>
                                            ) : !emailregex.test(email) ?
                                                <div className="row col-md-3"><small className="text-danger align-self-center">Email is invalid.</small></div>
                                                : null
                                        ) : null
                                    }
                                </div>


                                <div className="form-group row">
                                    <label htmlFor="password" className="col-md-3 col-form-label text-md-right">Password</label>

                                    <div className="col-md-6">
                                        <input id="password" type="password" value={password} className="form-control my-2" name="password" autoComplete="current-password" required
                                            onChange={e => (setPassword(e.target.value), setShowError({email: false, password: false}))} />
                                    </div>
                                    {showError.password ? (
                                        password == "" ? (
                                            <div className="row col-md-3"><small className="text-danger align-self-center">Password is required.</small></div>
                                        ) : password.length < 6 || password.length > 20 ?
                                            <div className="row col-md-3"><small className="text-danger align-self-center">Password must be 6 to 20 characters.</small></div>
                                            : null
                                    ) : null}
                                </div>

                                {/* <div className="form-group row">
                                        <div className="col-md-11">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" name="remember" id="remember" />

                                                <label className="form-check-label" htmlFor="remember">
                                                    Remember Me
                                                </label>
                                            </div>
                                        </div>
                                    </div> */}

                                {/* <div className="form-group row">
                                        <div className="col-md-11">
                                            <a className="btn btn-link" href="">
                                                Forgot Your Password?
                                            </a>
                                        </div>
                                    </div> */}

                                <div className="form-group  mb-0 mt-5">
                                    <div className="col-md-10 offset-md-3">
                                        <button type="submit" className="col btn btn-info text-white mx-4 search-btn" onClick={checkvalid}>
                                            Login
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}