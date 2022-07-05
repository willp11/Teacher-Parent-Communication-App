import { useFormik } from "formik";
import * as Yup from 'yup';
import { useSelector } from "react-redux";
import axios from "axios";

const Events = (props) => {

    const token = useSelector((state) => state.auth.token);

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
            helpers: 0
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
            description: Yup.string().trim().required("description is required"),
            helpers: 0
        })
    });

    let create_event_form = (
        <form onSubmit={event_formik.handleSubmit}>
            <div>
                <input
                    type="text"
                    placeholder="Event Name"
                    name="name"
                    value={event_formik.values.name}
                    onChange={event_formik.handleChange}
                    onBlur={event_formik.handleBlur}
                    style={{textAlign: "center"}}
                /> <br/>
                {event_formik.errors.name ? <div className="ErrorMsg">{event_formik.errors.name} </div> : null}

                <input
                    type="date"
                    placeholder="Date"
                    name="date"
                    value={event_formik.values.date}
                    onChange={event_formik.handleChange}
                    onBlur={event_formik.handleBlur}
                /> <br/>
                {event_formik.errors.date ? <div className="ErrorMsg">{event_formik.errors.date} </div> : null}

                <textarea
                    rows="10"
                    name="description"
                    value={event_formik.values.description}
                    onChange={event_formik.handleChange}
                    onBlur={event_formik.handleBlur}
                    placeholder="Description"
                /> <br/>
                {event_formik.errors.description ? <div className="ErrorMsg">{event_formik.errors.description} </div> : null}

                <input
                    type="number"
                    placeholder="No. helpers"
                    name="helpers"
                    value={event_formik.values.helpers}
                    onChange={event_formik.handleChange}
                    onBlur={event_formik.handleBlur}
                    style={{textAlign: "center"}}
                /> <br/>
                {event_formik.errors.helpers ? <div className="ErrorMsg">{event_formik.errors.helpers} </div> : null}
            </div>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    ) 
    let events = props.events.map((event)=>{
        return (
            <div className="list-div" key={event.id}>
                <h3>{event.name}</h3>
                <p>{event.date}</p>
                <p>{event.description}</p>
                <button onClick={()=>props.handleDelete(event.id, "event")}>Delete</button>
            </div>
        )
    });
    let events_div = (
        <div className="list-div-wrapper">
            <h2>Events</h2>
            {create_event_form}
            {props.events.length === 0 ? <p>There are no events</p> : null}
            {events}
        </div>
    )

    return events_div;
}

export default Events;