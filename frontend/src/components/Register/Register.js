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

    const handleRegister = (username, email, password, passwordConfirmation) => {
        const data = {
            username,
            email,
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
            username: "",
            email: "",
            password: "",
            passwordConfirmation: ""
        },
        onSubmit: (values) =>  {
            handleRegister(values.username, values.email, values.password, values.passwordConfirmation);
        },
        validationSchema: Yup.object({
            username: Yup.string().trim().required("username is required"),
            email: Yup.string().trim().required("email is required"),
            password: Yup.string().trim().required("password is required"),
            passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
        })
    });

    return (
        <div className="Register">
            <Navigation />
            <h1>Create Account</h1>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    /> <br/>
                    {formik.errors.username ? <div>{formik.errors.username} </div> : null}

                    <input
                        id="email"
                        type="text"
                        placeholder="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    /> <br/>
                    {formik.errors.email ? <div>{formik.errors.email} </div> : null}

                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    /> <br/>
                    {formik.errors.password ? <div>{formik.errors.password} </div> : null}

                    <input
                        id="passwordConfirmation"
                        type="password"
                        placeholder="Password Confirmation"
                        name="passwordConfirmation"
                        value={formik.values.passwordConfirmation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.passwordConfirmation ? <div>{formik.errors.passwordConfirmation} </div> : null}
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