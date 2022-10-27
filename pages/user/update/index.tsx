import { getSession } from "next-auth/react";
import Header from 'components/Header';
import React, { useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useRouter } from 'next/router';
import Image from 'next/image';
import connectMongo from '../../../utils/dbConnect'
import { format } from 'date-fns';
import User from "models/user.model";
import UserContext from "hooks/userContext";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function UserUpdate({ userData }: any) {
    const { user, setUser }: any = useContext(UserContext)

    const [name, setname] = useState(user.name ? user.name : userData.name)
    const [email, setemail] = useState(user.email ? user.email : userData.email)
    const [type, settype] = useState(user.type ? user.type : userData.type)
    const [phone, setphone] = useState(user.phone ? user.phone : userData.phone)
    const [dob, setdob] = useState(user.dob ? format(new Date(user.dob), 'yyyy-MM-dd') : format(new Date(userData.dob), 'yyyy-MM-dd'))
    const [address, setaddress] = useState(user.address ? user.address : userData.address)
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const lazyRoot = React.useRef(null);
    const [image, setImage] = useState(user.file);
    const [createObjectURL, setCreateObjectURL] = useState(user.file ? URL.createObjectURL(user.file) : (userData.profile !== '' ? userData.profile : "/common/profile.png"));
    const [filename, setfilename] = useState(userData.profile)
    const oldimg = userData.profile

    const confirmUserUpdate = (event) => {
        event.preventDefault();
        let usr = { name: name, email: email, password: '', type: type, phone: phone, dob: dob, file: (oldimg == createObjectURL) ? "" : image, address: address, oldimg: oldimg }
        setUser(usr)
        router.push({ pathname: '/user/update/confirm', query: { id: userData._id } })
    }

    const clearEvent = () => {
        setname('');
        setemail('');
        settype('');
        setphone('');
        setdob('');
        setaddress('');
        setfilename('');
        setCreateObjectURL('/common/profile.png');
        setUser({ name: '', email: '', password: '', type: '', phone: '', dob: '', file: '', address: '', oldimg: '' })
    }

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

    return (
        <div>
            <Header></Header>
            <div className="container my-5">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-8">
                        <div className="row mb-3"><h4 className='text-info mb-2'>Update User</h4></div>
                        <form onSubmit={confirmUserUpdate}>
                            <Image className="row" alt="profile image" lazyRoot={lazyRoot} src={createObjectURL} width="200" height="200" />
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
                                <label className="col-md-6 col-form-label text-md-start">{filename ? filename : 'No file Choosen.'}</label>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-10 text-md-start">
                                    <button type="submit" className="col btn btn-info text-white me-4 search-btn">
                                        Confirm
                                    </button>
                                    <button type="reset" onClick={clearEvent} className="col btn btn-outline-info mx-4 search-btn">
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