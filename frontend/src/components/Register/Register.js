import './Register.css';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authSlice from "../../store/slices/auth";
import Navigation from '../Navigation/Navigation';
import { Link } from 'react-router-dom';
import {extractErrors} from '../../Utils/utils';

const Register = () => {

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
                setErrors(extractErrors(err));
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
            email: Yup.string().trim().required("Email is required"),
            firstName: Yup.string().trim().required("First name is required"),
            // lastName is not required as maybe people only have 1 name
            lastName: Yup.string().trim(),
            password: Yup.string().trim().required("Password is required"),
            passwordConfirmation: Yup.string().required("Password confirmation is required").oneOf([Yup.ref('password'), null], 'Passwords must match')
        })
    });

    // Error messages
    let errors_div = errors.map(err=>{
        return (
            <div className="text-sm pl-2 py-1 font-bold w-full text-center">{err}</div>
        )
    })

    return (
        <div className="relative bg-white overflow-hidden min-h-screen">
            <div className="max-w-7xl mx-auto">
                <Navigation />
                <div className="w-full p-2 flex items-center justify-center md:px-4 lg:px-8">
                    <div className="w-96 p-8 rounded-md border border-gray-300 shadow-sm  bg-sky-50">
                        <h1>Register</h1>

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

                            <p className="text-base p-2 font-bold">First Name</p>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Type your first name" 
                                className="p-2 border border-gray-300 w-full" 
                                value={formik.values.firstName} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.firstName ? <div className="text-sm pl-2 py-1">{formik.errors.firstName} </div> : null}

                            <p className="text-base p-2 font-bold">Last Name</p>
                            <input 
                                type="text"
                                name="lastName"
                                placeholder="Type your last name (optional)" 
                                className="p-2 border border-gray-300 w-full" 
                                value={formik.values.lastName} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

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

                            <p className="text-base p-2 font-bold">Password Confirmation</p>
                            <input 
                                type="password"
                                name="passwordConfirmation"
                                placeholder="Type your password again" 
                                className="p-2 border border-gray-300 w-full"
                                value={formik.values.passwordConfirmation}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.passwordConfirmation ? <div className="text-sm pl-2 py-1">{formik.errors.passwordConfirmation} </div> : null}

                            <button 
                                disabled={loading} 
                                type="submit" 
                                className="w-full rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-3 mt-4 mb-2 text-white font-bold border-2 border-black"
                            >
                                SIGN UP
                            </button>
                        </form>

                        {errors_div}
                    
                        <p className="text-sm pt-2">
                            <span>Already have an account?</span>
                            <span className="pl-2 font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                                <Link to="/login">Log in</Link>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;