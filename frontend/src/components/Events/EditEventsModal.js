import { useSelector } from "react-redux";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { XIcon } from "@heroicons/react/outline";

const EditEventsModal = (props) => {

    const token = useSelector((state)=>state.auth.token);

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
        const url = 'http://localhost:8000/api/v1/school/event-update/' + props.event.id + '/';
        axios.put(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
                props.toggleEditMode();
            })
            .catch(err => {
                console.log(err);
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
    
    let edit_form = (
        <div className="relative w-full sm:w-[500px] p-4 mx-auto mt-2 rounded-md shadow-md bg-slate-100 text-center">
            <XIcon 
                className="absolute top-2 right-2 h-[24px] w-[24px] hover:border hover:border-gray-300 cursor-pointer"
                onClick={props.toggleEditMode}
            />
            <form onSubmit={event_formik.handleSubmit}>
                <h3>Edit Event</h3>
                <input
                    type="text"
                    placeholder="Type event name..."
                    name="name"
                    value={event_formik.values.name}
                    onChange={event_formik.handleChange}
                    onBlur={event_formik.handleBlur}
                    className="border border-gray-300 mt-2 h-10 w-full"
                /> <br/>
                {event_formik.errors.name ? <div className="ErrorMsg">{event_formik.errors.name} </div> : null}

                <input
                    type="date"
                    placeholder="Date"
                    name="date"
                    value={event_formik.values.date}
                    onChange={event_formik.handleChange}
                    onBlur={event_formik.handleBlur}
                    className="border border-gray-300 mt-2 h-10 w-full"
                /> <br/>
                {event_formik.errors.date ? <div className="ErrorMsg">{event_formik.errors.date} </div> : null}

                <textarea
                    rows="3"
                    placeholder="Type description..."
                    name="description"
                    value={event_formik.values.description}
                    onChange={event_formik.handleChange}
                    onBlur={event_formik.handleBlur}
                    className="border border-gray-300 mt-2 w-full"
                /> <br/>
                {event_formik.errors.description ? <div className="ErrorMsg">{event_formik.errors.description} </div> : null}

                <input
                    type="number"
                    placeholder="Type number helpers..."
                    name="helpers"
                    value={event_formik.values.helpers}
                    onChange={event_formik.handleChange}
                    onBlur={event_formik.handleBlur}
                    className="border border-gray-300 mt-2 h-10 w-full"
                /> <br/>
                {event_formik.errors.helpers ? <div className="ErrorMsg">{event_formik.errors.helpers} </div> : null}
                <button type="submit" className="w-32 rounded-full bg-sky-500 hover:bg-indigo-500 p-2 my-2 text-white font-bold border-2 border-black">Submit</button>
            </form>
        </div>
    )

    let edit_modal = (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-20 w-screen h-screen flex items-center justify-center">
            {edit_form}
        </div>
    )

    return edit_modal;
}

export default EditEventsModal;