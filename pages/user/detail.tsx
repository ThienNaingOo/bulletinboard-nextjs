import connectMongo from '../../utils/dbConnect';
import Users from '../../models/user.model';
import Header from 'components/Header';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { format } from 'date-fns';
import Image from 'next/image';
import React, { useState } from 'react';

function UserDetail({ data }) {
    const router = useRouter();
    const lazyRoot = React.useRef(null);
    const [createObjectURL, setCreateObjectURL] = useState(data.profile ? data.profile : "/common/profile.png");

    return (
        <div>
            <Header></Header>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header bg-info"><h4 className='text-white'>User Details</h4></div>

                            <div className="card-body">
                            <Image className="row" lazyRoot={lazyRoot} src={createObjectURL} width="200" height="200" />
                                <div className="row mt-3">
                                    <label className="col-md-4 col-form-label text-md-start">Name</label>
                                    <label className="col-md-6 col-form-label text-md-start">{data.name}</label>
                                </div>
                                <div className="row">
                                    <label className="col-md-4 col-form-label text-md-start">Email Address</label>
                                    <label className="col-md-6 col-form-label text-md-start">{data.email}</label>
                                </div>
                                {/* <div className="row">
                                    <label className="col-md-4 col-form-label text-md-start">Password</label>
                                    <label className="col-md-6 col-form-label text-md-start">{data.password}</label>
                                </div> */}
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
        await connectMongo();
        const user = await Users.findOne({ _id: context.query.userId })

        return {
            props: {
                data: JSON.parse(JSON.stringify(user))
            }
        }
    }
}

export default UserDetail