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
import RegisterForm from '../Forms/RegisterForm';
import PageTitle from '../UI/PageTitle';
import RoundedSubmitBtn from '../UI/RoundedSubmitBtn';

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
        setLoading(true);
        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/dj-rest-auth/registration/`, data)
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
            <div key={err} className="text-sm pl-2 py-1 font-bold w-full text-center">{err}</div>
        )
    })

    return (
        <div className="relative bg-slate-100 overflow-auto min-h-screen">

            <Navigation />
            <PageTitle title="Register" />
            <div className="w-full p-2 flex flex-col items-center justify-center">
                <div className="w-96 rounded-md p-8 shadow-lg bg-white border-2 border-gray-300 shadow-md">

                    <RegisterForm formik={formik}>
                        <RoundedSubmitBtn textContent="REGISTER" loading={loading} />
                    </RegisterForm>

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
    )
}

export default Register;