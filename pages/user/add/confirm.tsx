import { useSession } from "next-auth/react";
import Header from 'components/Header';
import React, { useState, useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { API_URI } from "utils/constants";
import UserContext from "hooks/userContext";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function UserCreateConfirm({ data }) {
    const { user, setUser }: any = useContext(UserContext)
    const name = user.name
    const email = user.email
    const password = user.password
    const type = user.type
    const phone = user.phone
    const dob = user.dob
    const address = user.address
    const { data: session }: any = useSession();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const image = user.file;
    const createObjectURL = user.file ? URL.createObjectURL(user.file) : "/common/profile.png"
    const lazyRoot = React.useRef(null);

    // useEffect(() => {
    //     console.log('eeeeeeeeeeeeeeeee', user);

    //     // setCreateObjectURL()

    // //     router.beforePopState(({ as }) => {
    // //         if (as !== router.asPath) {
    // //             router.replace('/user/add?name=' + name + '&email=' + email + '&password=' + password + '&type=' + type
    // //                 + '&phone=' + phone + '&dob=' + dob + '&address=' + address + '&file=' + image + '&createObjectURL=' + createObjectURL)
    // //             return true;
    // //         } else return false
    // //     });

    // //     return () => {
    // //         router.beforePopState(() => true);
    // //     };
    // }, [createObjectURL])

    // const confirmUserCreate = (event) => {
    //     event.preventDefault();
    //     // setConfirm(true)
    // }

    const cancleEvent = () => {
        router.back()
    }

    const confirmEvent = async () => {
        let body = new FormData();
        body.append("id", session?.user._id);
        body.append("name", name);
        body.append("email", email);
        body.append("password", password);
        body.append("profile", user.file);
        body.append("filename", image);
        body.append("type", type.toString());
        body.append("phone", phone);
        body.append("dob", dob);
        body.append("address", address);
        body.append("created_user_id", session?.user._id);

        fetch(API_URI + "api/user/create", {
            method: "POST",
            body: body
        })
            .then((response) => response.json())
            .then((json) => {

                json.status == 'success' ? (router.replace('/user'), setOpen(true), setUser({ name: '', email: '', password: '', type: '', phone: '', dob: '', file: '', address: '' })) : null
            })
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div>
            <Header></Header>
            <div className="container my-5">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-8">
                        <div className="row mb-3">
                            <h4 className='text-info mb-2'>Create User Confirmation</h4>
                        </div>
                        <Image className="row mb-0" alt="Profile image" lazyRoot={lazyRoot} src={createObjectURL} width="200" height="200" />
                        <div className="row my-3">
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
                            <label className="col-md-7 col-form-label text-md-start">{type.toString() == "0" ? "Admin" : "User"}</label>
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
                        <div className="row mb-3">
                            <label className="col-md-3 col-form-label text-md-start">File</label>
                            <label className="col-md-7 col-form-label text-md-start">{image.name}</label>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-10 text-md-start">
                                <button type="button" className="col btn btn-info text-white me-4 search-btn" onClick={confirmEvent}>
                                    Create
                                </button>
                                <button type="button" className="col btn btn-outline-info mx-4 search-btn" onClick={cancleEvent}>
                                    Cancle
                                </button>
                            </div>
                        </div>
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

export const getServerSideProps = async (context) => {
    return {
        props: {
            data: context.query
        }
    }
}

export default UserCreateConfirm