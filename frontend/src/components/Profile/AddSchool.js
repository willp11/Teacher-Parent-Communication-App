import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useMessage } from '../../Hooks/useMessage';
import Spinner from '../Spinner/Spinner';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline';

const AddSchool = (props) => {

    const token = useSelector(state => state.auth.token);
    const [message, setMessage] = useMessage();
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleAddSchool = (name, city, country, actions) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/school-list-create/`;
        const data = {
            name,
            city,
            country
        }
        setLoading(true);
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                setMessage("School added successfully.")
                actions.resetForm();
                props.getSchoolList()
            })
            .catch(err=>{
                console.log(err);
                setMessage("There was a problem with your request.")
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    const formik = useFormik({
        initialValues: {
            name: "",
            city: "",
            country: ""
        },
        onSubmit: (values, actions) => {
            handleAddSchool(values.name, values.city, values.country, actions);
        },
        validationSchema: Yup.object({
            name: Yup.string().trim().required("Name is required"),
            city: Yup.string().trim().required("City is required"),
            country: Yup.string().trim().required("Country is required")
        })
    })

    // SUBMIT BTN
    let submit_btn = (
        <button type="submit" className="w-32 rounded bg-sky-500 hover:bg-indigo-500 p-2 m-2 text-white font-semibold">Submit</button>
    )
    if (loading) {
        submit_btn = (
            <button type="submit" className="w-32 rounded bg-sky-500 hover:bg-indigo-500 p-2 my-2 mx-auto text-white font-semibold flex justify-center" disabled>
                <Spinner />
                Loading
            </button>
        )
    }

    let add_school_form = (
        <div className="relative w-full sm:w-[500px] p-2 mx-auto mt-2 rounded-md shadow shadow-gray-300 bg-gray-50 border border-gray-300 text-center">
            <h3>Add School</h3>

            {showForm ? <ChevronUpIcon onClick={()=>setShowForm(false)} className="h-[24px] w-[24px] absolute right-2 top-3 cursor-pointer" />
             : <ChevronDownIcon onClick={()=>setShowForm(true)} className="h-[24px] w-[24px] absolute right-2 top-3 cursor-pointer" />}

            {showForm ? <form onSubmit={formik.handleSubmit}>
                <input
                    type="text"
                    placeholder="Type school name..."
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="border border-gray-300 mt-2 h-10 w-full"
                /> <br/>
                {formik.errors.name ? <div className="text-sm w-full text-left pl-2">{formik.errors.name} </div> : null}

                <input
                    type="text"
                    placeholder="Type city..."
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="border border-gray-300 mt-2 h-10 w-full"
                /> <br/>
                {formik.errors.city ? <div className="text-sm w-full text-left pl-2">{formik.errors.city} </div> : null}

                <input
                    type="text"
                    placeholder="Type country..."
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="border border-gray-300 mt-2 h-10 w-full"
                /> <br/>
                {formik.errors.country ? <div className="text-sm w-full text-left pl-2">{formik.errors.country} </div> : null}

                {submit_btn}
                <p className="text-sm">{message}</p>
            </form> : null}
        </div>
    )

    return add_school_form;
}

export default AddSchool;