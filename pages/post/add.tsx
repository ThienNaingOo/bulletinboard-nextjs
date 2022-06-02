import { useSession } from "next-auth/react";
import Header from 'pages/components/Header';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useRouter } from 'next/router'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function PostCreate() {
    const [confirm, setConfirm] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const { data: session }: any = useSession();
    const [userID, setUserID] = useState("");
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        console.log(session);
        
        setUserID(session?.user.id);
    })

    const confirmPostCreate = (event) => {
        event.preventDefault();
        console.log(title, description);
        setConfirm(true)
    }

    const clearEvent = () => {
        setConfirm(false)
    }

    const confirmEvent = async () => {
        let body = {
            title: title,
            description: description,
            created_user_id: userID ? userID : "",
        }
        console.log(body);

        fetch("http://localhost:3000/api/post/create", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                setOpen(true)
                router.back()
            })
    }

    const handleClose = () => {
        // if (reason === 'clickaway') {
        //     return;
        // }
        setOpen(false);
        console.log("set open false", open);

    }

    return (
        <div>
            <Header></Header>
            <div className="container my-5">
                <div className="row justify-content-center mt-5">
                    <label className="col-md-6 col-form-label text-md-start">{open}</label>
                    {confirm ?
                        <div className="col-md-8">
                            <div className="row mb-3">
                                <h4 className='text-info mb-2'>Create Post Confirmation</h4>
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-4 col-form-label text-md-start">Title</label>
                                <label className="col-md-6 col-form-label text-md-start">{title}</label>
                            </div>
                            <div className="row mb-3">
                                <label className="col-md-4 col-form-label text-md-start">Description</label>
                                <label className="col-md-6 col-form-label text-md-start">{description}</label>
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
                            <div className="row mb-3"><h4 className='text-info mb-2'>Create Post</h4></div>
                            <form onSubmit={confirmPostCreate}>
                                <div className="row mb-3">
                                    <label className="col-md-4 col-form-label text-md-start">Title</label>
                                    <input id="title" type="text" className="col-md-6 col-form-label text-md-start" name="title" required autoComplete="text"
                                        onChange={e => setTitle(e.target.value)} />
                                </div>
                                <div className="row">
                                    <label className="col-md-4 col-form-label text-md-start">Description</label>
                                    <textarea id='description' className="col-md-6 col-form-label text-md-start" rows={5} required autoComplete="text"
                                        onChange={e => setDescription(e.target.value)} />
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
                    This is a success message!
                </Alert>
            </Snackbar>
        </div>
    )
}

export default PostCreate