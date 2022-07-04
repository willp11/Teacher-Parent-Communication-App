import './SchoolClass.css';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Navigation from '../Navigation/Navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SchoolClass = () => {

    const { id } = useParams();
    const token = useSelector((state) => state.auth.token);
    const [schoolClass, setSchoolClass] = useState(null);

    // GET CLASS DATA FUNCTION
    const getClassInfo = useCallback(async() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/class/' + id + '/';
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setSchoolClass(res.data)
            })
            .catch(err => {
                console.log(err);
            })
    }, [token, id])

    // ON MOUNT - GET SCHOOL CLASS DATA
    useEffect(()=>{
        getClassInfo();
    }, [getClassInfo])

    // CREATE ANNOUNCEMENT FUNCTION
    const handleCreateAnnouncement = (title, content) => {
        console.log("creating announcement");
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            title,
            content,
            school_class: schoolClass.id
        }
        const url = 'http://localhost:8000/api/v1/school/announcement-create/';
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                getClassInfo();
            })
            .catch(err => {
                console.log(err);
            })
    }

    // CREATE ANNOUNCEMENT FORM
    const announcement_formik = useFormik({
        initialValues: {
            title: "",
            content: "",
        },
        onSubmit: (values) =>  {
            handleCreateAnnouncement(values.title, values.content);
        },
        validationSchema: Yup.object({
            title: Yup.string().trim().required("title is required"),
            content: Yup.string().trim().required("content is required")
        })
    });


    // JSX
    let school_class_div = null;
    if (schoolClass !== null) {
        // ANNOUNCEMENTS
        let announcements = schoolClass.announcements.map((announcement)=>{
            return (
                <div className="list-div" key={announcement.id}>
                    <h3>{announcement.title}</h3>
                    <p>{announcement.date}</p>
                    <p>{announcement.content}</p>
                </div>
            )
        });

        // TO DO - 
        // IF USER IS TEACHER OF THE CLASS AND CREATE ANNOUNCEMENT MODE ON
        // SHOW CREATE ANNOUNCEMENT FORM
        let create_announcement_form = (
            <form onSubmit={announcement_formik.handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        value={announcement_formik.values.title}
                        onChange={announcement_formik.handleChange}
                        onBlur={announcement_formik.handleBlur}
                        style={{textAlign: "center"}}
                    /> <br/>
                    {announcement_formik.errors.title ? <div className="ErrorMsg">{announcement_formik.errors.title} </div> : null}

                    <textarea
                        rows="10"
                        name="content"
                        value={announcement_formik.values.content}
                        onChange={announcement_formik.handleChange}
                        onBlur={announcement_formik.handleBlur}
                    /> <br/>
                    {announcement_formik.errors.content ? <div className="ErrorMsg">{announcement_formik.errors.content} </div> : null}
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        )

        let announcements_div = (
            <div className="list-div-wrapper">
                <h2>Announcements</h2>
                {create_announcement_form}
                {schoolClass.announcements.length === 0 ? <p>There are no announcements</p> : null}
                {announcements}
            </div>
        )
        // EVENTS
        let events = schoolClass.events.map((event)=>{
            return (
                <div className="list-div" key={event.id}>
                    <h3>{event.name}</h3>
                    <p>{event.date}</p>
                    <p>{event.description}</p>
                </div>
            )
        });
        let events_div = (
            <div className="list-div-wrapper">
                <h2>Events</h2>
                {schoolClass.events.length === 0 ? <p>There are no events</p> : null}
                {events}
            </div>
        )
        // STORIES
        let stories = schoolClass.stories.map((story)=>{
            return (
                <div className="list-div" key={story.id}>
                    <h3>{story.title}</h3>
                    <p>{story.content}</p>
                </div>
            )
        });
        let stories_div = (
            <div className="list-div-wrapper">
                <h2>Stories</h2>
                {schoolClass.stories.length === 0 ? <p>There are no stories</p> : null}
                {stories}
            </div>
        )

        school_class_div = (
            <div>
                <h1>{schoolClass.name}</h1>
                <h2>{schoolClass.school.name}</h2>
                <p><b>Teacher: </b>{schoolClass.teacher.user.first_name + " " + schoolClass.teacher.user.last_name}</p>
                <div className="FlexRowCentered">
                    {announcements_div}
                    {events_div}
                    {stories_div}
                </div>
            </div>
        )
    }

    return (
        <div className="SchoolClass">
            <Navigation />
            {school_class_div}
        </div>
    );
}

export default SchoolClass;