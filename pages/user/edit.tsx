import { useSession } from "next-auth/react";
import Header from 'pages/components/Header';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useRouter } from 'next/router';
import Image from 'next/image';
import connectMongo from '../../utils/dbConnect'
import { format } from 'date-fns';
import User from "models/user.model";
import Link from 'next/link';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function UserUpdate({ userData }) {

    const [name, setname] = useState(userData.name)
    const [email, setemail] = useState(userData.email)
    const [password, setpassword] = useState("")
    const [confirmpwd, setconfirmpwd] = useState("")
    const [type, settype] = useState(userData.type)
    const [phone, setphone] = useState(userData.phone)
    const [dob, setdob] = useState(format(new Date(userData.dob), 'yyyy-MM-dd'))
    const [address, setaddress] = useState(userData.address)
    const [confirm, setConfirm] = useState(false)
    const { data: session }: any = useSession();
    const [userID, setUserID] = useState("");
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [image, setImage] = useState("");
    const [createObjectURL, setCreateObjectURL] = useState(userData.profile ? userData.profile : "/common/profile.png");
    const lazyRoot = React.useRef(null);

    useEffect(() => {
        setUserID(session?.user.id);
        // console.log(format(new Date(userData.dob), 'MM/dd/yyyy'));

    })

    const confirmUserUpdate = (event) => {
        event.preventDefault();
        (password !== confirmpwd) ? alert("Password are not same.") : setConfirm(true)
    }

    const clearEvent = () => {
        setConfirm(false)
    }

    const confirmEvent = async () => {
        let body = new FormData();
        body.append("id", userData._id);
        body.append("name", name);
        body.append("email", email);
        body.append("password", password);
        body.append("file", image);
        body.append("type", type);
        body.append("phone", phone);
        body.append("dob", dob);
        body.append("address", address);
        body.append("updated_user_id", userID);

        fetch("http://localhost:3000/api/user/update", {
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
                    {confirm ?
                        <div className="col-md-8">
                            <div className="row mb-3">
                                <h4 className='text-info mb-2'>Update User Confirmation</h4>
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
                            <div className="row mb-3"><h4 className='text-info mb-2'>Update User</h4></div>
                            <form onSubmit={confirmUserUpdate}>
                                <Image className="row" lazyRoot={lazyRoot} src={createObjectURL} width="200" height="200" />
                                <div className="row mb-3 mt-5">
                                    <label className="col-md-3 col-form-label text-md-start">Name</label>
                                    <input id="name" type="text" value={name} className="col-md-7 col-form-label text-md-start" name="name" required autoComplete="text"
                                        onChange={e => setname(e.target.value)} />
                                </div>
                                <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Email Address</label>
                                    <input id="email" type="email" value={email} className="col-md-7 col-form-label text-md-start" name="email" required autoComplete="email"
                                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}"
                                        title="Email is invalid."
                                        onChange={e => setemail(e.target.value)} />
                                </div>
                                <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Password</label>
                                    <input id="password" type="password" value={password} className="col-md-7 col-form-label text-md-start" name="password" required autoComplete="password"
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
                                    <input id="phone" type="text" value={phone} className="col-md-7 col-form-label text-md-start" name="phone" required autoComplete="text"
                                        pattern="\+?95|0?9+[0-9]{7,10}"
                                        title="Phone number is invalid."
                                        onChange={e => setphone(e.target.value)} />
                                </div>
                                <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Date of Birth</label>
                                    <input id="dob" type="date" value={dob} className="col-md-7 col-form-label text-md-start" name="dob"
                                        onChange={e => setdob(e.target.value)} />
                                </div>
                                <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Address</label>
                                    <input id="address" type="text" value={address} className="col-md-7 col-form-label text-md-start" name="address" autoComplete="text"
                                        onChange={e => setaddress(e.target.value)} />
                                </div>
                                <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Profile</label>
                                    <input id="profile" type="file" className="col-md-7 col-form-label ps-0 text-md-start" name="profile" required autoComplete="text"
                                        onChange={e => uploadToClient(e)} />
                                </div>
                                <div className="row mb-3">
                                    <Link href="/user/changepassword">
                                        <a>Change Password?</a>
                                    </Link>
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
                    successfully updated!
                </Alert>
            </Snackbar>
        </div>
    )
}

export const getServerSideProps = async (context) => {

    await connectMongo();
    const data = await User.findOne({ _id: context.query.userId })
    console.log("_id", data);
    return {
        props: {
            userData: JSON.parse(JSON.stringify(data)),
            // getUserID: context.query.userId
        }
    }
}

export default UserUpdate