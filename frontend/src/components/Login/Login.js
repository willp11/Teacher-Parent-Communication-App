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
import PageTitle from '../UI/PageTitle';
import LoginForm from '../Forms/LoginForm';
import RoundedSubmitBtn from '../UI/RoundedSubmitBtn';

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
        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/dj-rest-auth/login/`, data)
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
        <div className="relative bg-slate-100 overflow-auto min-h-screen">
            <Navigation />
            <PageTitle title="Login" />
            <div className="w-full p-2 flex flex-col items-center justify-center">
                <div className="w-96 rounded-md p-8 shadow-lg bg-white border-2 border-gray-300 shadow-md">

                    <LoginForm formik={formik}>
                        <div className="w-full flex justify-end align-center">
                            <Link to="/resetPassword" className="text-sm p-2 cursor-pointer text-gray-500  text-gray-500 hover:text-gray-900">Forgot password?</Link>
                        </div>
                        <RoundedSubmitBtn textContent="LOGIN" loading={loading} />
                    </LoginForm>
                
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
    )
}

export default Login;