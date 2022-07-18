import './Login.css';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import axios from 'axios';
import authSlice from "../../store/slices/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navigation from '../Navigation/Navigation';
import { Link } from 'react-router-dom';
import {extractErrors} from '../../Utils/utils';

const Login = () => {
    const [errors, setErrors] = useState([]);
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
        setLoading(true);
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
                setErrors(extractErrors(err));
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
            email: Yup.string().trim().required("Email is required"),
            password: Yup.string().trim().required("Password is required"),
        })
    });

    // Error messages
    let errors_div = errors.map(err=>{
        return (
            <div key={err} className="text-sm pl-2 py-1 font-bold w-full text-center">{err}</div>
        )
    })

    return (
        <div className="relative bg-white overflow-hidden min-h-screen">
            <div className="max-w-7xl mx-auto">
                <Navigation />
                <div className="w-full p-2 flex items-center justify-center">
                    <div className="w-96 rounded-md p-8 shadow-lg bg-sky-100">
                        <h1>Log in</h1>

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

                            <p className="text-base p-2 font-bold">Password</p>
                            <input 
                                type="password"
                                name="password"
                                placeholder="Type your password" 
                                className="p-2 border border-gray-300 w-full"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            /> 
                            {formik.errors.password ? <div className="text-sm pl-2 py-1">{formik.errors.password} </div> : null}

                            <div className="w-full flex justify-end align-center">
                                <Link to="/resetPassword" className="text-sm p-2 cursor-pointer text-gray-500  text-gray-500 hover:text-gray-900">Forgot password?</Link>
                            </div>
                            <button 
                                disabled={loading}
                                type="submit"
                                className="w-full rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-3 text-white font-bold my-2 border-2 border-black"
                            >
                                LOGIN
                            </button>
                        </form>

                        {errors_div}
                        
                        <p className="text-sm pt-4">
                            <span>Don't have an account?</span>
                            <span className="pl-2 font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                                <Link to="/register">Sign Up</Link>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;