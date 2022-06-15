import { useSession } from "next-auth/react";
import Header from 'pages/components/Header';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useRouter } from 'next/router';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function PasswordChange() {
    const [oldpassword, setoldpassword] = useState("")
    const [password, setpassword] = useState("")
    const [confirmpwd, setconfirmpwd] = useState("")
    const { data: session }: any = useSession();
    const [userID, setUserID] = useState("");
    const [open, setOpen] = useState(false);
    const [erropen, seterrOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setUserID(session?.user.id);
    })

    const confirmPasswordChange = (event) => {
        event.preventDefault();
        (password === confirmpwd)? confirmEvent(): alert("password and confirmed password are not same.")
    }

    const confirmEvent = async () => {
        let body = {
            id: userID,
            oldpassword: oldpassword,
            newpassword: password
        }

        fetch("http://localhost:3000/api/user/update/password", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
            .then((response) => response.json())
            .then((json) => {
                json.success ? (setOpen(true), router.replace("/")): seterrOpen(true)

            }).catch((error)=> console.error(error))
    }

    const handleClose = () => {
        setOpen(false);
        seterrOpen(false);
    }

    return (
        <div>
            <Header></Header>
            <div className="container my-5">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-8">
                        <div className="row mb-3"><h4 className='text-info mb-2'>Change Password</h4></div>
                        <form onSubmit={confirmPasswordChange}>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Old Password</label>
                                <input id="oldpassword" type="password" className="col-md-7 col-form-label text-md-start" name="oldpassword" required autoComplete="password"
                                    onChange={e => setoldpassword(e.target.value)} />
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">New Password</label>
                                <input id="password" type="password" className="col-md-7 col-form-label text-md-start" name="password" required autoComplete="password"
                                    onChange={e => setpassword(e.target.value)} />
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Confirm New Password</label>
                                <input id="confirmpwd" type="password" className="col-md-7 col-form-label text-md-start" name="confirmpwd" required autoComplete="password"
                                    onChange={e => setconfirmpwd(e.target.value)} />
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-10 text-md-start">
                                    <button type="submit" className="col btn btn-info text-white me-4 search-btn">
                                        Confirm
                                    </button>
                                    <button type="reset" className="col btn btn-outline-info mx-4 search-btn">
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
            <Snackbar open={open} autoHideDuration={6000}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    password changed successfully added!
                </Alert>
            </Snackbar>
            <Snackbar open={erropen} autoHideDuration={6000}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    somethis went wrong!
                </Alert>
            </Snackbar>
        </div>
    )
}

export default PasswordChange