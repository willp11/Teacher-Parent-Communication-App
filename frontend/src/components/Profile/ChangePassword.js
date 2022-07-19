import { useFormik } from "formik";
import { useSelector } from "react-redux";
import axios from "axios";
import * as Yup from 'yup';
import { useState } from "react";
import { extractErrors } from "../../Utils/utils";

const ChangePassword = () => {

    const token = useSelector((state)=>state.auth.token);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    // Function to send change password request
    const handleChangePassword = (new_password1, new_password2) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };
        const data = {
            new_password1, 
            new_password2
        };

        setLoading(true);

        axios.post('http://localhost:8000/api/v1/dj-rest-auth/password/change/', data, {headers: headers})
            .then(res=>{
                console.log(res);
                setErrors(["Password changed successfully."])
            })
            .catch(err=>{
                console.log(err);
                setErrors(extractErrors(err));
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    // CHANGE PASSWORD FORM
    const formik = useFormik({
        initialValues: {
            password: "",
            passwordConfirmation: ""
        },
        onSubmit: (values) =>  {
            handleChangePassword(values.password, values.passwordConfirmation);
        },
        validationSchema: Yup.object({
            password: Yup.string().trim().required("Password is required"),
            passwordConfirmation: Yup.string().required("Password confirmation is required").oneOf([Yup.ref('password'), null], 'Passwords must match')
        })
    });

    // ERRORS
    let errors_div = errors.map(err=>{
        return (
            <div className="text-sm pl-2 py-1 font-bold w-full text-center">{err}</div>
        )
    })

    // JSX
    let change_password_div = (
        <div className="w-full rounded-md shadow-md bg-sky-50 mt-2 mb-4 mx-auto p-2 pb-4">
            <h2 className="my-4 text-md text-gray-600">Change Password</h2>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <input
                        id="password"
                        type="password"
                        placeholder="Type new password..."
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="p-2 border border-gray-300 h-10"
                    /> <br/>
                    {formik.errors.password ? <div className="text-sm pl-2 py-1">{formik.errors.password} </div> : null}

                    <input
                        id="passwordConfirmation"
                        type="password"
                        placeholder="Repeat password..."
                        name="passwordConfirmation"
                        value={formik.values.passwordConfirmation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="p-2 border border-gray-300 h-10"
                    />
                    {formik.errors.passwordConfirmation ? <div className="text-sm pl-2 py-1">{formik.errors.passwordConfirmation} </div> : null}
                </div>
                <div>
                    <button className="w-32 shadow-md rounded-full bg-sky-500 hover:bg-indigo-500 p-2 text-white text-sm font-bold border-2 border-black mt-4" type="submit" disabled={loading}>Submit</button>
                </div>
            </form>
            {errors_div}
        </div>
    )

    return change_password_div;
}

export default ChangePassword;