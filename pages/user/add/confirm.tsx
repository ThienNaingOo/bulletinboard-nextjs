import { useSession } from "next-auth/react";
import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function UserCreateConfirm({data}) {

    const [name, setname] = useState(data.name)
    const [email, setemail] = useState(data.email)
    const [password, setpassword] = useState(data.password)
    const [type, settype] = useState(data.type)
    const [phone, setphone] = useState(data.phone)
    const [dob, setdob] = useState(data.dob)
    const [address, setaddress] = useState(data.address)
    const { data: session }: any = useSession();
    const [userID, setUserID] = useState("");
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [image, setImage] = useState(data.file);
    const [createObjectURL, setCreateObjectURL] = useState(data.createObjectURL);
    const lazyRoot = React.useRef(null);

    useEffect(() => {
        setUserID(session?.user.id);
        router.beforePopState(({ as }) => {
            if (as !== router.asPath) {                
                router.replace('/user/add?name=' + name + '&email=' + email+ '&password=' + password+ '&type=' + type
                + '&phone=' + phone + '&dob=' + dob + '&address=' + address + '&file=' + image + '&createObjectURL=' + createObjectURL)
                return true;
            } else return false
        });

        return () => {
            router.beforePopState(() => true);
        };
    }, [router])

    const confirmUserCreate = (event) => {
        event.preventDefault();
        // setConfirm(true)
    }

    const cancleEvent = () => {
        router.back()
    }

    const confirmEvent = async () => {
        let body = new FormData();
        body.append("name", name);
        body.append("email", email);
        body.append("password", password);
        body.append("file", createObjectURL);
        body.append("filename", image);
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
                router.replace('/user/list')
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
                        <Image className="row mb-0" lazyRoot={lazyRoot} src={createObjectURL} width="200" height="200" />
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