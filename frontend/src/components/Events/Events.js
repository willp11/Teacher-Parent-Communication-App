import { useFormik } from "formik";
import * as Yup from 'yup';
import { useSelector } from "react-redux";
import axios from "axios";
import Event from "./Event";

const Events = (props) => {

    const token = useSelector((state) => state.auth.token);
    const accountType = useSelector((state)=> state.auth.accountType);

    // CREATE EVENT FUNCTION
    const handleCreateEvent = (name, date, description, helpers_required, actions) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            name, 
            date, 
            description, 
            helpers_required,
            school_class: props.classId
        }
        const url = 'http://localhost:8000/api/v1/school/event-create/';
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
                actions.resetForm();
            })
            .catch(err => {
                console.log(err);
            })
    }

    // CREATE EVENT FORM
    const formatDate = () => {
        return new Date().toLocaleDateString()
    }
    const event_formik = useFormik({
        initialValues: {
            name: "",
            date: "",
            description: "",
            helpers: ""
        },
        onSubmit: (values, actions) => {
            handleCreateEvent(values.name, values.date, values.description, values.helpers, actions);
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

    let create_event_form = (
        <div className="w-full sm:w-[500px] p-4 mx-auto mt-2 rounded-md shadow-md bg-slate-100 text-center">
            <form onSubmit={event_formik.handleSubmit}>
                <h3>Create Event</h3>
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

    let events = props.events.map((event)=>{
        return <Event key={event.id} event={event} handleDelete={props.handleDelete} getClassInfo={props.getClassInfo} />
    });

    let events_div = (
        <div>
            {accountType === "teacher" ? create_event_form : null}
            
            <div className="mt-4 mb-16">
                <h3 className="mb-4">Upcoming Events</h3>
                {events.length === 0 ? <p className="text-center">There are no upcoming events.</p> : null}
                {events}
            </div>

        </div>
    )

    return events_div;
}

export default Events;