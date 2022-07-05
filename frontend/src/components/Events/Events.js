import { useFormik } from "formik";
import * as Yup from 'yup';
import { useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";

const Events = (props) => {

    const token = useSelector((state) => state.auth.token);

    // EDIT MODE - when on, all edit buttons disappear. On event being edited, show cancel and confirm buttons.
    const [editMode, setEditMode] = useState(false);
    // use event id
    const [eventToEdit, setEventToEdit] = useState(null);
    // edited event new object
    const [newEventObj, setNewEventObj] = useState({
        name: "",
        date: "",
        description: "",
        helpers_required: 0
    });

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

    // EDIT ANNOUNCEMENT FUNCTION
    // Inputs 
    const handleUpdateEventObj = (field, value) => {
        let newObj = {...newEventObj};
        newObj[field] = value;
        setNewEventObj(newObj);
    }
    // Confirm button
    const handleEditEventConfirm = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = newEventObj;
        const url = 'http://localhost:8000/api/v1/school/event-update/' + eventToEdit + '/';
        axios.put(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
            })
            .catch(err => {
                console.log(err);
            })
            .finally(()=>{
                toggleEditMode(null);
                setNewEventObj({
                    name: "",
                    date: "",
                    description: "",
                    helpers_required: 0
                });
            })
    }
    // Turn on/off edit mode
    const toggleEditMode = (event) => {
        if (editMode) {
            setEditMode(false);
            setEventToEdit(null);
            setNewEventObj({
                name: "",
                date: "",
                description: "",
                helpers_required: 0
            });
        } else {
            setEditMode(true);
            setEventToEdit(event.id);
            setNewEventObj(event);
        }
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
        let editOnDiv = (
            <div>
                <h3>{event.name}</h3>
                <input type="text" placeholder="New Name" value={newEventObj.name} onChange={(e)=>handleUpdateEventObj("name", e.target.value)}/> <br/>
                <input type="date" value={newEventObj.date} onChange={(e)=>handleUpdateEventObj("date", e.target.value)}/> <br/>
                <textarea placeholder="New description" value={newEventObj.description} onChange={(e)=>handleUpdateEventObj("description", e.target.value)} rows="10"/> <br/>
                <input type="number" value={newEventObj.helpers_required} onChange={(e)=>handleUpdateEventObj("helpers_required", e.target.value)}/> <br/>
                <button onClick={()=>toggleEditMode(null)}>Cancel</button>
                <button onClick={()=>handleEditEventConfirm()}>Confirm</button>
            </div>
        )
        let editOffDiv = (
            <div>
                <h3>{event.name}</h3>
                <p>{event.date}</p>
                <p>{event.description}</p>
                <p>Helpers required: {event.helpers_required}</p>
                <button onClick={()=>toggleEditMode(event)}>Edit</button> <br/>
                <button onClick={()=>props.handleDelete(event.id, "event")}>Delete</button>
            </div>
        )
        return (
            <div className="list-div" key={event.id}>
                {(editMode && eventToEdit === event.id) ? editOnDiv : editOffDiv}
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