import { getSession } from "next-auth/react";
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

function PostCreate({ data }: any) {
    const [title, setTitle] = useState(data.title)
    const [description, setDescription] = useState(data.description)
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        router.beforePopState(({ as }) => {
            if (as !== router.asPath) {
                router.replace('/post')
            }
            return true;
        });

        return () => {
            router.beforePopState(() => true);
        };
    }, [router])

    const confirmPostCreate = (event) => {
        event.preventDefault();
        router.push({ pathname: '/post/add/confirm', query: { title: title, description: description } })
    }

    const clearEvent = () => {
        setTitle('');
        setDescription('')
    }

    const handleClose = () => {
        // if (reason === 'clickaway') {
        //     return;
        // }
        setOpen(false);
    }

    return (
        <div>
            <Header></Header>
            <div className="container my-5">
                <div className="row justify-content-center mt-5">
                    <label className="col-md-6 col-form-label text-md-start">{open}</label>
                    <div className="col-md-8">
                        <div className="row mb-3"><h4 className='text-info mb-2'>Create Post</h4></div>
                        <form onSubmit={confirmPostCreate}>
                            <div className="row mb-3">
                                <label className="col-md-4 col-form-label text-md-start">Title</label>
                                <input id="title" type="text" className="col-md-6 col-form-label text-md-start" name="title" required value={title}
                                    onChange={e => setTitle(e.target.value)} />
                            </div>
                            <div className="row">
                                <label className="col-md-4 col-form-label text-md-start">Description</label>
                                <textarea id='description' className="col-md-6 col-form-label text-md-start" rows={5} required value={description}
                                    onChange={e => setDescription(e.target.value)} />
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