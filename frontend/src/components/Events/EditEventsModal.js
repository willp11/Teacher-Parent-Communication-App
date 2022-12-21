import { useSelector } from "react-redux";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useState } from "react";
import SubmitBtn from "../UI/SubmitBtn";
import EditModal from "../UI/EditModal";
import EventForm from "../Forms/EventForm";

const EditEventsModal = (props) => {

    const token = useSelector((state)=>state.auth.token);

    const [loading, setLoading] = useState(false);

    // EDIT EVENT REQUEST HANDLER
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

    return (
        <EditModal title="Edit Event" toggleEditMode={props.toggleEditMode}>
            <EventForm formik={event_formik} message={null}>
                <SubmitBtn
                    loading={loading}
                    clickHandler={event_formik.handleSubmit}
                    textContent="Submit"
                />
            </EventForm>
        </EditModal>
    )
}

export default EditEventsModal;