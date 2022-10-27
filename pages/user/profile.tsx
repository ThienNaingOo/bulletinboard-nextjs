import connectMongo from './../../utils/dbConnect';
import Users from '../../models/user.model';
import { getSession } from "next-auth/react";
import Header from 'components/Header';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

function Profile({ data }) {
    const router = useRouter();
    const lazyRoot = React.useRef(null);
    const createObjectURL = data.profile !== '' ? data.profile : "/common/profile.png"

    return (
        <div>
            <Header></Header>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-8">
                        <div className='row'>
                            <div className="col-md-9">
                                <Image className="row" alt="profile image" lazyRoot={lazyRoot} src={createObjectURL} width="200" height="200" />
                            </div>

                            <div className="col-md-3 mb-3 text-end">
                                <Link href="/user/changepassword">
                                    <a><u>Change Password?</u></a>
                                </Link>
                            </div>
                        </div>
                        <div className="row card mt-5 mb-5">
                            <div className="card-header bg-info"><h4 className='text-white'>User Profile</h4></div>

                            <div className="card-body">
                                <div className="row">
                                    <label className="col-md-4 col-form-label text-md-start">Name</label>
                                    <label className="col-md-6 col-form-label text-md-start">{data.name}</label>
                                </div>
                                <div className="row">
                                    <label className="col-md-4 col-form-label text-md-start">Email Address</label>
                                    <label className="col-md-6 col-form-label text-md-start">{data.email}</label>
                                </div>
                                <div className="row">
                                    <label className="col-md-4 col-form-label text-md-start">Type</label>
                                    <label className="col-md-6 col-form-label text-md-start">{(data.type == 0) ? "admin" : "user"}</label>
                                </div>
                                <div className="row">
                                    <label className="col-md-4 col-form-label text-md-start">Phone</label>
                                    <label className="col-md-6 col-form-label text-md-start">{data.phone}</label>
                                </div>
                                <div className="row">
                                    <label className="col-md-4 col-form-label text-md-start">Date of Birth</label>
                                    <label className="col-md-6 col-form-label text-md-start">{format(new Date(data.dob), 'MM/dd/yyyy')}</label>
                                </div>
                                <div className="row">
                                    <label className="col-md-4 col-form-label text-md-start">Address</label>
                                    <label className="col-md-6 col-form-label text-md-start">{data.address}</label>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-10 text-md-end">
                                        <button className="col btn btn-info text-white mx-4 search-btn" onClick={() => router.push({ pathname: '/user/update', query: { userId: data._id } })}>
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = async (ctx) => {
    const session: any = await getSession(ctx);
    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    } else {
        await connectMongo();
        const user = await Users.findOne({ _id: session?.user?._id })
        return {
            props: {
                data: JSON.parse(JSON.stringify(user))
            }
        }
    }
}

export default Profile