import './Login.css';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import axios from 'axios';
import authSlice from "../../store/slices/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navigation from '../Navigation/Navigation';

const Login = () => {
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

    const handleLogin = (email, password) => {
        const data = {
            email,
            password: password
        };
        axios.post('http://localhost:8000/api/v1/dj-rest-auth/login/', data)
            .then((res) => {
                console.log(res.data);
                dispatch(
                    authSlice.actions.setAuthToken({
                        token: res.data.key,
                    })
                );
                setLoading(false);
                return navigate("/profile");
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
            password: ""
        },
        onSubmit: (values) =>  {
            handleLogin(values.email, values.password);
        },
        validationSchema: Yup.object({
            email: Yup.string().trim().required("email is required"),
            password: Yup.string().trim().required("password is required"),
        })
    });

    return (
        <div className="Login">
            <Navigation />
            <h1>Login</h1>
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
                    /> <br/>
                    {formik.errors.email ? <div className="LoginWarning">{formik.errors.email} </div> : null}

                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    /> <br/>
                    {formik.errors.password ? <div className="LoginWarning">{formik.errors.password} </div> : null}
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

export default Login;