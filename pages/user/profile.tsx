import connectMongo from './../../utils/dbConnect';
import Users from '../../models/user.model';
import { getSession } from "next-auth/react";
import Header from 'pages/components/Header';
import { useRouter } from 'next/router';

function Profile({ data }) {
    const router = useRouter();

    const editProfile = () => {
        console.log(data);
        alert(data._id)

        router.push({ pathname: '/user/edit', query: { userId: data._id } })
    }

    return (
        <div>
            <Header></Header>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-8">
                        <div className="card">
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
                                    <label className="col-md-4 col-form-label text-md-start">Password</label>
                                    <label className="col-md-6 col-form-label text-md-start">{data.password}</label>
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
                                    <label className="col-md-6 col-form-label text-md-start">{data.dob}</label>
                                </div>
                                <div className="row">
                                    <label className="col-md-4 col-form-label text-md-start">Address</label>
                                    <label className="col-md-6 col-form-label text-md-start">{data.address}</label>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-10 text-md-end">
                                        <button className="col btn btn-info text-white mx-4 search-btn" onClick={() => router.push({ pathname: '/user/edit', query: { userId: data._id } })}>
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

export const getServerSideProps = async () => {
    const session: any = await getSession();
    await connectMongo();
    console.log(session);

    const user = await Users.findOne({ id: session?.user?.id })
    console.log(user);

    return {
        props: {
            data: JSON.parse(JSON.stringify(user))
        }
    }
}

export default Profile