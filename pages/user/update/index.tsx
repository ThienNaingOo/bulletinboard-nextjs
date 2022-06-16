import { getSession, useSession } from "next-auth/react";
import Header from 'pages/components/Header';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useRouter } from 'next/router';
import Image from 'next/image';
import connectMongo from '../../../utils/dbConnect'
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
    const [type, settype] = useState(userData.type)
    const [phone, setphone] = useState(userData.phone)
    const [dob, setdob] = useState(format(new Date(userData.dob), 'yyyy-MM-dd'))
    const [address, setaddress] = useState(userData.address)
    const { data: session }: any = useSession();
    const [userID, setUserID] = useState("");
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [image, setImage] = useState("");
    const [userprofile, setuserprofile] = useState(userData.profile ? userData.profile : "/common/profile.png");
    const [createObjectURL, setCreateObjectURL] = useState(userData.profile ? userData.profile : "/common/profile.png");
    const lazyRoot = React.useRef(null);
    const [filename, setfilename] = useState(userData.profile)
    const [oldimg, setoldimg] = useState(userData.profile)

    useEffect(() => {
        setUserID(session?.user.id);
        console.log(userData);
        if (!userData.hasOwnProperty('password')) {
            setname(userData.name)
            setemail(userData.email)
            setphone(userData.phone)
            setdob(format(new Date(userData.dob), 'yyyy-MM-dd'))
            setaddress(userData.address)
            setfilename(userData.file)
            setCreateObjectURL(userData.filepath)
            setuserprofile(userData.filepath)
            setoldimg(userData.oldimg)
        }
    })

    const confirmUserUpdate = (event) => {
        event.preventDefault();
        // (password !== confirmpwd) ? alert("Password are not same.") :
        // setConfirm(true)
        // confirmEvent(userprofile == createObjectURL)
        fileSaveToTemp()
    }


    // const confirmEvent = async (is_update) => {
    //     let body = new FormData();
    //     body.append("id", userData._id);
    //     body.append("name", name);
    //     body.append("email", email);
    //     body.append("profile", userprofile);
    //     body.append("file", image);
    //     body.append("type", type);
    //     body.append("phone", phone);
    //     body.append("dob", dob);
    //     body.append("address", address);
    //     body.append("updated_user_id", userID);
    //     body.append("is_profileupdate", is_update);

    //     fetch("http://localhost:3000/api/user/update", {
    //         method: "POST",
    //         headers: {
    //         },
    //         body: body
    //     })
    //         .then((response) => response.json())
    //         .then((json) => {
    //             setOpen(true)
    //             router.replace('/user/list')
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
        console.log(userprofile, createObjectURL);

        if (userprofile !== createObjectURL) {
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
                    router.push({ pathname: '/user/update/confirm', query: { id: userData._id, name: name, email: email, type: type, phone: phone, dob: dob, file: json.data.name, createObjectURL: json.data.path, address: address, oldimg: oldimg } })
                })
        } else router.push({ pathname: '/user/update/confirm', query: { id: userData._id, name: name, email: email, type: type, phone: phone, dob: dob, file: filename, createObjectURL: createObjectURL, address: address, oldimg: oldimg } })
    }

    return (
        <div>
            <Header></Header>
            <div className="container my-5">
                <div className="row justify-content-center mt-5">
                    {/* {confirm ?
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
                                        Update
                                    </button>
                                    <button type="button" className="col btn btn-outline-info mx-4 search-btn" onClick={clearEvent}>
                                        Cancle
                                    </button>
                                </div>
                            </div>
                        </div>
                        : */}
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
                            {/* <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Password</label>
                                    <input id="password" type="password" value={password} className="col-md-7 col-form-label text-md-start" name="password" required autoComplete="password"
                                        onChange={e => setpassword(e.target.value)} />
                                </div>
                                <div className="row mb-3">
                                    <label className="col-md-3 col-form-label text-md-start">Confirm Password</label>
                                    <input id="confirmpwd" type="password" className="col-md-7 col-form-label text-md-start" name="confirmpwd" required autoComplete="password"
                                        onChange={e => setconfirmpwd(e.target.value)} />
                                </div> */}
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
                                <input id="profile" type="file" style={{ width: '100px' }} className="col-md-3 col-form-label ps-0 text-md-start" name="profile"
                                    onChange={e => uploadToClient(e)} />
                                <label className="col-md-6 col-form-label text-md-start">{filename? filename: 'No file Choosen.'}</label>
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
    const session: any = await getSession(context);
    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    } else {
        if (context.query.hasOwnProperty('userId')) {
            try {
                await connectMongo();
                const data = await User.findOne({ _id: context.query.userId })
                return {
                    props: {
                        userData: JSON.parse(JSON.stringify(data)),
                    }
                }
            } catch (error) {
                return {
                    redirect: {
                        permanent: false,
                        destination: '/'
                    }
                }
            }
        } else return {
            props: {
                userData: context.query,
            }
        }
    }
}

export default UserUpdate