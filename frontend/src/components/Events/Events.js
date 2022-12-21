import { useFormik } from "formik";
import * as Yup from 'yup';
import { useSelector } from "react-redux";
import axios from "axios";
import Event from "./Event";
import { useEffect, useState, useCallback } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { useMessage } from "../../Hooks/useMessage";
import SubmitBtn from "../UI/SubmitBtn";
// import Spinner from "../Spinner/Spinner";

const eventTypes = ["Today", "Upcoming", "Finished"]

const Events = (props) => {

    const token = useSelector((state) => state.auth.token);
    const accountType = useSelector((state)=> state.auth.accountType);

    const [message, setMessage] = useMessage();
    const [loading, setLoading] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [selectedEventType, setSelectedEventType] = useState("Today");

    // sorted events
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [todayEvents, setTodayEvents] = useState([]);
    const [finishedEvents, setFinishedEvents] = useState([]);

    // Function to sort events by date and if they are today or upcoming or finished
    const sortEvents = useCallback(()=>{
        // sort events into today, upcoming and finished
        let upcoming = [];
        let today = [];
        let finished = [];
        let today_date = new Date().toLocaleDateString();
        let today_ts = Date.parse(new Date());
        props.events.forEach((e)=>{
            let date = new Date(e.date).toLocaleDateString();
            if (date === today_date) {
                today.push(e);
            } else {
                let ts = Date.parse(e.date);
                ts > today_ts ? upcoming.push(e) : finished.push(e)
            }
        })

        // order events by date - upcoming: earliest first, finished: latest first
        upcoming = upcoming.sort((a,b)=>{
            let a_ts = Date.parse(a.date)
            let b_ts = Date.parse(b.date)
            return a_ts - b_ts
        })
        finished = finished.sort((a,b)=>{
            let a_ts = Date.parse(a.date)
            let b_ts = Date.parse(b.date)
            return b_ts - a_ts
        })

        setUpcomingEvents(upcoming);
        setFinishedEvents(finished);
        setTodayEvents(today);

        return {today, upcoming, finished}
    }, [props.events])

    // when props.events change, sort the events
    useEffect(()=>{
        sortEvents()
    }, [sortEvents])

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
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/event-create/`;
        setLoading(true);
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
                actions.resetForm();
                setMessage("Event created successfully.")
            })
            .catch(err => {
                console.log(err);
                setMessage("There was a problem creating the event.")
            })
            .finally(()=>{
                setLoading(false);
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

    // SUBMIT BTN
    let submit_btn = (
        <SubmitBtn
            loading={loading}
            clickHandler={event_formik.handleSubmit}
            textContent="Submit"
        />
    )

    let create_event_form = (
        <div className="relative w-full sm:w-[500px] p-2 mx-auto mt-2 rounded-md shadow-md shadow-gray-300 bg-white border-2 border-gray-300 text-center">
            <h3>Create Event</h3>

            {showForm ? <ChevronUpIcon onClick={()=>setShowForm(false)} className="h-[24px] w-[24px] absolute right-2 top-3 cursor-pointer" />
             : <ChevronDownIcon onClick={()=>setShowForm(true)} className="h-[24px] w-[24px] absolute right-2 top-3 cursor-pointer" />}

            {showForm ? <form onSubmit={event_formik.handleSubmit}>
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
                <p className="text-sm">{message}</p>
            </form> : null}
        </div>
    )

    // Events divs
    let events = null;
    let event_arr = [];
    let div_title = "";
    let div_txt = "";
    let finished = false;
    if (selectedEventType === "Today") {
        event_arr = todayEvents
        div_title = "Today's Events"
        div_txt = "There are no events today."
    } else if (selectedEventType === "Upcoming") {
        event_arr = upcomingEvents
        div_title = "Upcoming Events"
        div_txt = "There are no upcoming events."
    } else if (selectedEventType === "Finished") {
        event_arr = finishedEvents
        div_title = "Finished Events"
        div_txt = "There are no finished events."
        finished = true;
    }
    let selected_events = event_arr.map((event)=>{
        return <Event key={event.id} event={event} handleDelete={props.handleDelete} getClassInfo={props.getClassInfo} finished={finished}/>
    });
    events = (
        <div className="mt-2 mb-16">
            <h3 className="mb-4">{div_title}</h3>
            {event_arr.length === 0 ? <p className="text-center">{div_txt}</p> : null}
            {selected_events}
        </div>
    )

    // Select upcoming, today, finished buttons
    let buttons = eventTypes.map((type)=>{
        let style = "w-24 mx-1 text-base font-semibold p-1 border border-gray-300 bg-white hover:bg-indigo-500 hover:text-white rounded shadow-md"
        if (selectedEventType === type) {
            style = "w-24 mx-1 text-base font-semibold p-1 border border-gray-300 text-white bg-sky-500 rounded shadow-md"
        }
        return <button key={type} className={style} onClick={()=>setSelectedEventType(type)}>{type}</button>
    })
    let buttons_div = (
        <div className="w-[calc(100%-1rem)] sm:w-[500px] mx-auto flex justify-evenly mt-4">
            {buttons}
        </div>
    )

    let events_div = (
        <div>
            {accountType === "teacher" ? create_event_form : null}
            {buttons_div}
            {events}
        </div>
    )

    return events_div;
}

export default Events;