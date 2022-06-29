import './Register.css';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authSlice from "../../store/slices/auth";
import Navigation from '../Navigation/Navigation';

const Register = () => {

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const token = useSelector((state) => state.auth.token);

    useEffect(()=>{
        if (token !== null) {
            return navigate('/profile');
        }
    }, [token, navigate]);

    const handleRegister = (email, firstName, lastName, password, passwordConfirmation) => {
        const data = {
            email,
            first_name: firstName,
            last_name: lastName,
            password1: password,
            password2: passwordConfirmation
        };
        axios.post('http://localhost:8000/api/v1/dj-rest-auth/registration/', data)
            .then((res) => {
                dispatch(
                    authSlice.actions.setAuthToken({
                        token: res.data.key
                    })
                )
                setLoading(false);
                return navigate('/profile');
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                setMessage(err.response.data.msg.toString());
            })
    }

    const formik = useFormik({
        initialValues: {
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            passwordConfirmation: ""
        },
        onSubmit: (values) =>  {
            handleRegister(values.email, values.firstName, values.lastName, values.password, values.passwordConfirmation);
        },
        validationSchema: Yup.object({
            email: Yup.string().trim().required("email is required"),
            firstName: Yup.string().trim().required("first name is required"),
            // lastName is not required as maybe people only have 1 name
            password: Yup.string().trim().required("password is required"),
            passwordConfirmation: Yup.string().required("password confirmation is required").oneOf([Yup.ref('password'), null], 'Passwords must match')
        })
    });

    return (
        <div className="Register">
            <Navigation />
            <h1>Create Account</h1>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <input
                        id="email"
                        type="text"
                        placeholder="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="RegisterInput"
                    /> <br/>
                    {formik.errors.email ? <div className="RegisterWarning">{formik.errors.email} </div> : null}

                    <input
                        id="firstName"
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="RegisterInput"
                    /> <br/>
                    {formik.errors.firstName ? <div className="RegisterWarning">{formik.errors.firstName} </div> : null}

                    <input
                        id="lastName"
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="RegisterInput"
                    /> <br/>
                    {formik.errors.lastName ? <div style={{fontSize: "0.8rem"}}>{formik.errors.lastName} </div> : null}

                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="RegisterInput"
                    /> <br/>
                    {formik.errors.password ? <div className="RegisterWarning">{formik.errors.password} </div> : null}

                    <input
                        id="passwordConfirmation"
                        type="password"
                        placeholder="Password Confirmation"
                        name="passwordConfirmation"
                        value={formik.values.passwordConfirmation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="RegisterInput"
                    />
                    {formik.errors.passwordConfirmation ? <div className="RegisterWarning">{formik.errors.passwordConfirmation} </div> : null}
                </div>
                <div hidden={false}>
                    {message}
                </div>
                <div className="RegisterBtn">
                    <button type="submit" disabled={loading}>Submit</button>
                </div>
            </form>
        </div>
    );
}

export default Register;