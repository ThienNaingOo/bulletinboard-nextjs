import { useSession } from "next-auth/react";
import Header from 'pages/components/Header';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Router, { useRouter } from 'next/router';
import Image from 'next/image';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function UserCreate() {

    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [confirmpwd, setconfirmpwd] = useState("")
    const [type, settype] = useState("")
    const [phone, setphone] = useState("")
    const [dob, setdob] = useState("")
    const [address, setaddress] = useState("")
    const [confirm, setConfirm] = useState(false)
    const { data: session }: any = useSession();
    const [userID, setUserID] = useState("");
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [image, setImage] = useState("");
    const [createObjectURL, setCreateObjectURL] = useState("");
    const lazyRoot = React.useRef(null);

    useEffect(() => {
        setUserID(session?.user.id);
        if( window ) {
            Router.beforePopState(()=> {
                // console.log("as,",as == router.asPath , confirm);
                if (confirm) {
                    setname(name)
                    setConfirm(false)
                    return false
                }
                return true
            })
        }
    })

    const confirmUserCreate = (event) => {
        event.preventDefault();
        // router.push({ pathname: '/user/add/confirm', query: { name: name, email: email, password: password, type: type, phone: phone, dob: dob, file: image, createObjectURL: createObjectURL  } })
        setConfirm(true)
    }

    const clearEvent = () => {
        setConfirm(false)
    }

    const confirmEvent = async () => {
        let body = new FormData();
        body.append("name", name);
        body.append("email", email);
        body.append("password", password);
        body.append("file", image);
        body.append("type", type);
        body.append("phone", phone);
        body.append("dob", dob);
        body.append("address", address);
        body.append("created_user_id", userID);

        fetch("http://localhost:3000/api/user/create", {
            method: "POST",
            headers: {
            },
            body: body
        })
            .then((response) => response.json())
            .then((json) => {
                setOpen(true)
                router.back()
            })
    }

    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];

            setImage(i);
            setCreateObjectURL(URL.createObjectURL(i))
        }
    };

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div>
            <Header></Header>
            <div className="container my-5">
                <div className="row justify-content-center mt-5">
                    <label className="col-md-7 col-form-label text-md-start">{open}</label>
                    {confirm ?
                        <div className="col-md-8">
                            <div className="row mb-3">
                                <h4 className='text-info mb-2'>Create User Confirmation</h4>
                            </div>
                            <Image className="row mb-3" lazyRoot={lazyRoot} src={createObjectURL} width="200" height="200" />
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Name</label>
                                <label className="col-md-7 col-form-label text-md-start">{name}</label>
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Email</label>
                                <label className="col-md-7 col-form-label text-md-start">{email}</label>
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Password</label>
                                <label className="col-md-7 col-form-label text-md-start">{password}</label>
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Type</label>
                                <label className="col-md-7 col-form-label text-md-start">{type == "0" ? "Admin" : "User"}</label>
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Phone</label>
                                <label className="col-md-7 col-form-label text-md-start">{phone}</label>
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Date of Birth</label>
                                <label className="col-md-7 col-form-label text-md-start">{dob}</label>
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Address</label>
                                <label className="col-md-7 col-form-label text-md-start">{address}</label>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-10 text-md-start">
                                    <button type="button" className="col btn btn-info text-white me-4 search-btn" onClick={confirmEvent}>
                                        Create
                                    </button>
                                    <button type="button" className="col btn btn-outline-info mx-4 search-btn" onClick={clearEvent}>
                                        Cancle
                                    </button>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="col-md-8">
                            <div className="row mb-3"><h4 className='text-info mb-2'>Create User</h4></div>
                            <form onSubmit={confirmUserCreate}>
                                <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Name</label>
                                    <input id="name" type="text" className="col-md-7 col-form-label text-md-start" name="name" required autoComplete="text"
                                        onChange={e => setname(e.target.value)} />
                                </div>
                                <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Email Address</label>
                                    <input id="email" type="email" className="col-md-7 col-form-label text-md-start" name="email" required autoComplete="email"
                                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}"
                                        title="Email is invalid."
                                        onChange={e => setemail(e.target.value)} />
                                </div>
                                <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Password</label>
                                    <input id="password" type="password" className="col-md-7 col-form-label text-md-start" name="password" required autoComplete="password"
                                        onChange={e => setpassword(e.target.value)} />
                                </div>
                                <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Confirm Password</label>
                                    <input id="confirmpwd" type="password" className="col-md-7 col-form-label text-md-start" name="confirmpwd" required autoComplete="password"
                                        onChange={e => setconfirmpwd(e.target.value)} />
                                </div>
                                <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Type</label>
                                    <select className="col-md-7 col-form-label text-md-start" value={type} onChange={e => settype(e.target.value)}>
                                        <option value={0}>Admin</option>
                                        <option value={1}>User</option>
                                    </select>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Phone</label>
                                    <input id="phone" type="text" className="col-md-7 col-form-label text-md-start" name="phone" required autoComplete="text"
                                        pattern="\+?95|0?9+[0-9]{7,10}"
                                        title="Phone number is invalid."
                                        onChange={e => setphone(e.target.value)} />
                                </div>
                                <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Date of Birth</label>
                                    <input id="dob" type="date" className="col-md-7 col-form-label text-md-start" name="dob"
                                        onChange={e => setdob(e.target.value)} />
                                </div>
                                <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Address</label>
                                    <input id="address" type="text" className="col-md-7 col-form-label text-md-start" name="address" autoComplete="text"
                                        onChange={e => setaddress(e.target.value)} />
                                </div>
                                <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Profile</label>
                                    <input id="profile" type="file" className="col-md-7 col-form-label ps-0 text-md-start" name="profile" required autoComplete="text"
                                        onChange={e => uploadToClient(e)} />
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
                    }
                </div>
            </div>
            <Snackbar open={open} autoHideDuration={6000}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    successfully added 1 user!
                </Alert>
            </Snackbar>
        </div>
    )
}

export default UserCreate