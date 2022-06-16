import { getSession } from "next-auth/react";
import Header from 'pages/components/Header';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Router, { useRouter } from 'next/router';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function UserCreate({ data }) {

    const [name, setname] = useState(data?.name)
    const [email, setemail] = useState(data?.email)
    const [password, setpassword] = useState(data?.password)
    const [confirmpwd, setconfirmpwd] = useState("")
    const [type, settype] = useState(data?.type)
    const [phone, setphone] = useState(data?.phone)
    const [dob, setdob] = useState(data?.dob)
    const [address, setaddress] = useState(data?.address)
    // const [confirm, setConfirm] = useState(false)
    // const { data: session }: any = useSession();
    // const [userID, setUserID] = useState("");
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [image, setImage] = useState(data?.createObjectURL);
    const [filename, setfilename] = useState("No file Choosen.")
    const [tempname, settempname] = useState()
    const [createObjectURL, setCreateObjectURL] = useState(data?.createObjectURL);

    useEffect(() => {
        setname(data?.name);
        setemail(data?.email);
        setpassword(data?.password);
        setconfirmpwd(data?.password);
        settype(data?.type);
        setphone(data?.phone);
        setdob(data?.dob);
        setaddress(data?.address);
        setfilename(data?.file);
        settempname(data?.file)
        setCreateObjectURL(data?.createObjectURL)
        // setUserID(session?.user.id);
        Router.beforePopState(({ as }) => {
            if (as !== router.asPath) {
                router.replace('/post')
            }
            return true;
        })
    }, [router])

    const confirmUserCreate = (event) => {
        event.preventDefault();
        fileSaveToTemp()
    }

    // const clearEvent = () => {
    //     setConfirm(false)
    // }

    // const confirmEvent = async () => {
    //     let body = new FormData();
    //     body.append("name", name);
    //     body.append("email", email);
    //     body.append("password", password);
    //     body.append("file", image);
    //     body.append("type", type);
    //     body.append("phone", phone);
    //     body.append("dob", dob);
    //     body.append("address", address);
    //     body.append("created_user_id", userID);

    //     fetch("http://localhost:3000/api/user/create", {
    //         method: "POST",
    //         headers: {
    //         },
    //         body: body
    //     })
    //         .then((response) => response.json())
    //         .then((json) => {
    //             setOpen(true)
    //             router.back()
    //         })
    // }

    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];
            setfilename(i.name)
            
            setImage(i);
            setCreateObjectURL(URL.createObjectURL(i))
        }
    };

    const handleClose = () => {
        setOpen(false);
    }

    const fileSaveToTemp = () => {
        if (tempname !== filename) {
        let body = new FormData();
        body.append("file", image);
        fetch("http://localhost:3000/api/user/savefile", {
            method: "PUT",
            headers: {
            },
            body: body
        })
            .then((response) => response.json())
            .then((json) => {
                router.push({ pathname: '/user/add/confirm', query: { name: name, email: email, password: password, type: type, phone: phone, dob: dob, file: json.data.name, createObjectURL: json.data.path, address: address } })
            })
        } else router.push({ pathname: '/user/add/confirm', query: { name: name, email: email, password: password, type: type, phone: phone, dob: dob, file: filename, createObjectURL: createObjectURL, address: address } })
    }

    return (
        <div>
            <Header></Header>
            <div className="container my-5">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-8">
                        <div className="row mb-3"><h4 className='text-info mb-2'>Create User</h4></div>
                        <form onSubmit={confirmUserCreate}>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Name</label>
                                <input id="name" type="text" className="col-md-7 col-form-label text-md-start" name="name" required autoComplete="text"
                                    onChange={e => setname(e.target.value)} value={name} />
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Email Address</label>
                                <input id="email" type="email" className="col-md-7 col-form-label text-md-start" name="email" required autoComplete="email"
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}"
                                    title="Email is invalid."
                                    onChange={e => setemail(e.target.value)} value={email} />
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Password</label>
                                <input id="password" type="password" className="col-md-7 col-form-label text-md-start" name="password" required autoComplete="password"
                                    onChange={e => setpassword(e.target.value)} value={password} />
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Confirm Password</label>
                                <input id="confirmpwd" type="password" className="col-md-7 col-form-label text-md-start" name="confirmpwd" required autoComplete="password"
                                    onChange={e => setconfirmpwd(e.target.value)} value={confirmpwd} />
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
                                    onChange={e => setphone(e.target.value)} value={phone} />
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Date of Birth</label>
                                <input id="dob" type="date" className="col-md-7 col-form-label text-md-start" name="dob"
                                    onChange={e => setdob(e.target.value)} value={dob} />
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Address</label>
                                <input id="address" type="text" className="col-md-7 col-form-label text-md-start" name="address" autoComplete="text"
                                    onChange={e => setaddress(e.target.value)} value={address} />
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-3 col-form-label text-md-start">Profile</label>
                                <input id="profile" type="file" style={{ width: '100px' }} className="col-md-3 col-form-label ps-0 text-md-start" name="profile"
                                    onChange={e => uploadToClient(e)} />
                                <label className="col-md-6 col-form-label text-md-start">{filename}</label>
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
                    successfully added 1 user!
                </Alert>
            </Snackbar>
        </div>
    )
}

export const getServerSideProps = async (ctx) => {
    const session: any = await getSession(ctx)
    if (!session || session?.user?.type == 1) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    } else return {
        props: { data: ctx.query }
    }
}

export default UserCreate