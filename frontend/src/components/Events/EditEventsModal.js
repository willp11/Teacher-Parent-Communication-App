import { useSelector } from "react-redux";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useState } from "react";
import SubmitBtn from "../UI/SubmitBtn";
import EditModal from "../UI/EditModal";

const EditEventsModal = (props) => {

    const token = useSelector((state)=>state.auth.token);

    const [loading, setLoading] = useState(false);

    // Confirm button
    const handleEditEvent = (name, date, description, helpers_required) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            name,
            date,
            description,
            helpers_required
        };
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/event-update/${props.event.id}/`;
        setLoading(true);
        axios.put(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
                props.toggleEditMode();
            })
            .catch(err => {
                console.log(err);
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    // EDIT EVENT FORM
    const formatDate = () => {
        return new Date().toLocaleDateString()
    }
    const event_formik = useFormik({
        initialValues: {
            name: props.event.name,
            date: props.event.date,
            description: props.event.description,
            helpers: props.event.helpers_required,
        },
        onSubmit: (values) => {
            handleEditEvent(values.name, values.date, values.description, values.helpers);
        },
        validationSchema: Yup.object({
            name: Yup.string().trim().required("name is required"),
            date: Yup.date().min(
                new Date(),
                `Date needs to be after ${formatDate()}`
            ),
            description: Yup.string().trim().required("description is required")
        })
    });

    // SUBMIT BTN
    let submit_btn = (
        <SubmitBtn
            loading={loading}
            clickHandler={event_formik.handleSubmit}
            textContent="Submit"
        />
    )
    
    let edit_form = (
        <form onSubmit={event_formik.handleSubmit}>
            <input
                type="text"
                placeholder="Type event name..."
                name="name"
                value={event_formik.values.name}
                onChange={event_formik.handleChange}
                onBlur={event_formik.handleBlur}
                className="border border-gray-300 mt-2 h-10 w-full"
            /> <br/>
            {event_formik.errors.name ? <div className="text-sm w-full text-left pl-2">{event_formik.errors.name} </div> : null}

            <input
                type="date"
                placeholder="Date"
                name="date"
                value={event_formik.values.date}
                onChange={event_formik.handleChange}
                onBlur={event_formik.handleBlur}
                className="border border-gray-300 mt-2 h-10 w-full"
            /> <br/>
            {event_formik.errors.date ? <div className="text-sm w-full text-left pl-2">{event_formik.errors.date} </div> : null}

            <textarea
                rows="3"
                placeholder="Type description..."
                name="description"
                value={event_formik.values.description}
                onChange={event_formik.handleChange}
                onBlur={event_formik.handleBlur}
                className="border border-gray-300 mt-2 w-full"
            /> <br/>
            {event_formik.errors.description ? <div className="text-sm w-full text-left pl-2">{event_formik.errors.description} </div> : null}

            <input
                type="number"
                placeholder="Type number helpers..."
                name="helpers"
                value={event_formik.values.helpers}
                onChange={event_formik.handleChange}
                onBlur={event_formik.handleBlur}
                className="border border-gray-300 mt-2 h-10 w-full"
            /> <br/>
            {event_formik.errors.helpers ? <div className="text-sm w-full text-left pl-2">{event_formik.errors.helpers} </div> : null}
            <div className="flex justify-center mt-2">
                {submit_btn}
            </div>
        </form>
    )

    return (
        <EditModal title="Edit Event" toggleEditMode={props.toggleEditMode}>
            {edit_form}
        </EditModal>
    )
}

export default EditEventsModal;