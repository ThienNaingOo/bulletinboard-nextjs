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

function UserUpdateConfirm({ data }: any) {
    const { user, setUser }: any = useContext(UserContext)
    const updateUserId = data.id
    const name = user.name
    const email = user.email
    const oldimg = user.oldimg
    const type = user.type
    const phone = user.phone
    const dob = user.dob
    const address = user.address
    const { data: session }: any = useSession();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const image = data.file;
    const createObjectURL = user.file ? URL.createObjectURL(user.file) : (user.oldimg ? user.oldimg : "/common/profile.png");
    const lazyRoot = React.useRef(null);

    const cancleEvent = () => {
        router.back()
    }

    const confirmEvent = async () => {
        let body = new FormData();
        body.append("id", updateUserId);
        body.append("name", name);
        body.append("email", email);
        body.append("is_profileupdate", (createObjectURL !== oldimg && createObjectURL !== '/common/profile.png') ? 'true' : 'false');
        body.append("old_profile", user.file ? "" : "true");
        body.append("profile", user.file);
        body.append("filename", image);
        body.append("type", type);
        body.append("phone", phone);
        body.append("dob", dob);
        body.append("address", address);
        body.append("created_user_id", session?.user._id);

        fetch(API_URI + "api/user/update", {
            method: "POST",
            headers: {
            },
            body: body
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.status == "success") {
                    setOpen(true)
                    router.replace('/user')
                    setUser({ name: '', email: '', password: '', type: '', phone: '', dob: '', file: '', address: '', oldimg: '' })
                } else {
                    let error = json.error ? json.error : ''
                    alert(json.message + '\n' + error.toString().replace(/,/g, "\n"))
                }
            })
            .catch((err) => console.log(err)
            )
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
                            <h4 className='text-info mb-2'>Update User Confirmation</h4>
                        </div>
                        <Image alt="profile image" className="row mb-0" lazyRoot={lazyRoot} src={createObjectURL} width="200" height="200" />
                        <div className="row my-3">
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

export default UserUpdateConfirm