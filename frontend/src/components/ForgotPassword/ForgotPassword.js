import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { extractErrors } from "../../Utils/utils";
import Navigation from "../Navigation/Navigation";
import * as Yup from 'yup';

const ForgotPassword = () => {

    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Function send handle reset request
    const handleResetPassword = (email) => {
        const url = 'http://localhost:8000/api/v1/dj-rest-auth/password/reset/';
        const data = {
            email
        }
        setLoading(true);
        axios.post(url, data)
            .then(res=>{
                console.log(res);
                setLoading(false);
                setShowSuccess(true);
            })
            .catch(err=>{
                console.log(err);
                setErrors(extractErrors(err));
                setLoading(false);
            })
    }

    // Form
    const formik = useFormik({
        initialValues: {
            email: ""
        },
        onSubmit: (values) =>  {
            handleResetPassword(values.email);
        },
        validationSchema: Yup.object({
            email: Yup.string().trim().required("Email is required"),
        })
    })

    // Error messages
    let errors_div = errors.map(err=>{
        return (
            <div className="text-sm pl-2 py-1 font-bold w-full text-center">{err}</div>
        )
    })

    // Input form div
    let form_div = (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <p className="text-base pt-6 pl-2 pb-2 font-bold">E-mail</p>
                <input 
                    type="text"
                    name="email"
                    placeholder="Type your e-mail" 
                    className="p-2 border border-gray-300 w-full"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.errors.email ? <div className="text-sm pl-2 py-1">{formik.errors.email} </div> : null}
                <button
                    disabled={loading}
                    type="submit"
                    className="w-full rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-3 text-white font-bold my-4"
                >
                    RESET PASSWORD
                </button>
            </form>
            {errors_div}
        </div>
    )

    let success_div = (
        <div>
            <p className="text-base p-2">Check your e-mail and follow the link to reset your password.</p>
            <form onSubmit={formik.handleSubmit}>
            <button
                    disabled={loading}
                    type="submit"
                    className="w-full rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-3 text-white font-bold my-4"
                >
                    RE-SEND EMAIL
                </button>
            </form>
        </div>
    )

    return (
        <div className="relative bg-white overflow-hidden min-h-screen">
            <div className="max-w-7xl mx-auto">
                <Navigation />
                <div className="w-full py-2 px-2 flex items-center justify-center md:px-4 lg:px-8">
                    <div className="bg-white w-96 p-8 rounded-md border border-gray-300 shadow-sm  bg-slate-50">
                        <h1 className="text-4xl tracking-tight font-extrabold text-center">Reset Password</h1>
                        {showSuccess ? success_div : form_div}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;