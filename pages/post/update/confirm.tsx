import { getSession, useSession } from "next-auth/react";
import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useRouter } from 'next/router'
import Switch from '@mui/material/Switch';
import { API_URI } from "utils/constants";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const label = { inputProps: { 'aria-label': 'Switch demo' } };

function PostUpdateConfirm({ data }) {
    const title = data.title
    const description = data.description
    const { data: session }: any = useSession();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const status = (data.status === 'true')

    useEffect(() => {
        router.beforePopState(({ as }) => {
            if (as !== router.asPath) {
                router.replace('/post/update?title=' + title + '&description=' + description + '&status=' + status)
                return true;
            } else return false
        });

        return () => {
            router.beforePopState(() => true);
        };
    }, [router, title, description, status])

    const cancleEvent = () => {
        router.back()
    }

    const confirmEvent = async () => {
        let body = {
            post_id: data.post_id,
            title: title,
            description: description,
            status: status ? 1 : 0,
            updated_user_id: session?.user._id ? session?.user._id : "",
        }
        fetch(API_URI + "api/post/update", {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
            .then((response) => response.json())
            .then((json) => {
                json.status == 'success' ? (
                    setOpen(true),
                    router.replace('/post')) : null
            })
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div>
            <Header></Header>
            <div className="container my-5 col-md-8">
                <div className="row mb-3">
                    <h4 className='text-info mb-2'>Update Post Confirmation</h4>
                </div>
                <div className="row mb-3">
                    <label className="col-md-4 col-form-label text-md-start">Title</label>
                    <label className="col-md-6 col-form-label text-md-start">{title}</label>
                </div>
                <div className="row mb-3">
                    <label className="col-md-4 col-form-label text-md-start">Description</label>
                    <label className="col-md-6 col-form-label text-md-start">{description}</label>
                </div>
                <div className="row">
                    <label className="col-md-4 col-form-label text-md-start">Status</label>
                    <div className="col-md-6 col-form-label ps-0">
                        <Switch className="text-md-start" color="info" disabled {...label} checked={status} />
                    </div>
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

export default PostUpdateConfirm