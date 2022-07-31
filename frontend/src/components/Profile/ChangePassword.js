import { useFormik } from "formik";
import { useSelector } from "react-redux";
import axios from "axios";
import * as Yup from 'yup';
import { useState } from "react";
import { extractErrors } from "../../Utils/utils";
import Spinner from '../Spinner/Spinner';

const ChangePassword = () => {

    const token = useSelector((state)=>state.auth.token);

    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);

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
                setMessages(["Password changed successfully."])
            })
            .catch(err=>{
                console.log(err);
                setMessages(extractErrors(err));
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

    // MESSAGES
    let messages_div = messages.map(msg=>{
        return (
            <div className="text-sm pl-2 py-1 w-full text-center">{msg}</div>
        )
    })

    // SUBMIT BTN
    let submit_btn = (
        <button className="w-32 rounded bg-sky-500 hover:bg-indigo-500 p-2 text-white font-semibold mt-4 flex justify-center mx-auto" type="submit" disabled={false}>
            Submit
        </button>
    )
    if (loading) {
        submit_btn = (
            <button className="w-32 rounded bg-sky-500 hover:bg-indigo-500 p-2 text-white font-semibold mt-4 flex justify-center mx-auto" type="submit" disabled={true}>
                <Spinner />
                Loading
            </button>
        )
    }

    // JSX
    let change_password_div = (
        <div className="w-full rounded-md shadow-md bg-white mt-2 mx-auto p-4 min-h-[250px]">
            <h2 className="pb-4 text-md">Change Password</h2>
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
                    {submit_btn}
                </div>
            </form>
            {messages_div}
        </div>
    )

    return change_password_div;
}

export default ChangePassword;