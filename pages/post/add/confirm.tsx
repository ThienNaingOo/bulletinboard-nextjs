import { getSession, useSession } from "next-auth/react";
import Header from 'components/Header';
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

function PostCreate({ data }) {
    const title = data.title
    const description = data.description
    const { data: session }: any = useSession();
    const [userID, setUserID] = useState("");
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setUserID(session?.user._id);
        router.beforePopState(({ as }) => {
            if (as !== router.asPath) {
                router.replace('/post/add?title=' + title + '&description=' + description)
                return true;
            } else return false
        });

        return () => {
            router.beforePopState(() => true);
        };
    }, [router])

    const cancleEvent = () => {
        router.back()
    }

    const confirmEvent = async () => {
        let body = {
            title: title,
            description: description,
            created_user_id: userID ? userID : "",
            created_at: new Date(Date.now())
        }

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
                if (json.status == 'success') {
                    setOpen(true)
                    router.replace('/post')
                } else {
                    alert(json.error.join('\n'))
                }

            })
            .catch((error) => alert(error))
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
                    This is a success message!
                </Alert>
            </Snackbar>
        </div>
    )
}

export const getServerSideProps = async (ctx) => {
    const session: any = await getSession(ctx)
    if (!session) {
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

export default PostCreate