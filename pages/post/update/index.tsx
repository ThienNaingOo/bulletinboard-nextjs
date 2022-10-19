import { getSession } from "next-auth/react";
import Header from 'components/Header';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useRouter } from 'next/router'
import connectMongo from '../../../utils/dbConnect'
import Switch from '@mui/material/Switch';
import Post from "models/post.model";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const label = { inputProps: { 'aria-label': 'Switch demo' } };

function PostEdit({ postData }: any) {
    const [title, setTitle] = useState(postData.title)
    const [description, setDescription] = useState(postData.description);
    const [status, setStatus] = useState(postData.status == '0' ? false : true)
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!postData.hasOwnProperty('_id')) {
            setTitle(postData.title);
            setDescription(postData.description);
            setStatus(postData.status === 'true')
        }
        router.beforePopState(({ as }) => {
            if (as !== router.asPath) {
                router.replace('/post')
            }
            return true;
        });

        return () => {
            router.beforePopState(() => true);
        };
    }, [router, postData])

    const confirmPostCreate = (event) => {
        event.preventDefault();
        router.push({ pathname: '/post/update/confirm', query: { title: title, description: description, post_id: postData._id, status: status } })
    }

    const clearEvent = () => {
        setTitle('');
        setDescription("");
        setStatus(true);
    }

    // const confirmEvent = async () => {
    //     let body = {
    //         post_id: postData._id,
    //         title: title,
    //         description: description,
    //         status: status ? 1 : 0,
    //         updated_user_id: userID ? userID : "",
    //     }
    //     fetch("http://localhost:3000/api/post/update", {
    //         method: "PUT",
    //         headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(body)
    //     })
    //         .then((response) => response.json())
    //         .then((json) => {
    //             setOpen(true)
    //             router.back()
    //         })
    // }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div>
            <Header></Header>
            <div className="container my-5">
                <div className="row justify-content-center mt-5">
                    <label className="col-md-6 col-form-label text-md-start">{open}</label>
                    {/* {confirm ?
                        <div className="col-md-8">
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
                        : */}
                    <div className="col-md-8">
                        <div className="row mb-3"><h4 className='text-info mb-2'>Create Post</h4></div>
                        <form onSubmit={confirmPostCreate}>
                            <div className="row mb-4">
                                <label className="col-md-4 col-form-label text-md-start">Title</label>
                                <input id="title" value={title} type="text" className="col-md-6 col-form-label text-md-start" name="title" required autoComplete="text"
                                    onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="row mb-4">
                                <label className="col-md-4 col-form-label text-md-start">Description</label>
                                <textarea id='description' value={description} className="col-md-6 col-form-label text-md-start" rows={5} required autoComplete="text"
                                    onChange={e => setDescription(e.target.value)} />
                            </div>
                            <div className="row">
                                <label className="col-md-4 col-form-label text-md-start">Status</label>
                                <div className="col-md-6 col-form-label ps-0">
                                    <Switch className="text-md-start" color="info" {...label} checked={status} onChange={e => setStatus(e.target.checked)} />
                                </div>
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
                    This is a success message!
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
        if (context.query.postId !== undefined) {
            try {
                await connectMongo();
                const postData: any = await Post.findOne({ _id: context.query.postId }).select('title description status created_user_id')
                if (session.user._id === postData.created_user_id + "") {
                    return {
                        props: {
                            postData: JSON.parse(JSON.stringify(postData))
                        }
                    }
                } else {
                    return {
                        redirect: {
                            permanent: false,
                            destination: '/'
                        }
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
            props: { postData: context.query }
        }
    }
}

export default PostEdit