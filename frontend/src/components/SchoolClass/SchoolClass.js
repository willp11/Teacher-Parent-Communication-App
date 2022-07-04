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
    const handleCreateAnnouncement = (title, content, actions) => {
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
                actions.resetForm();
            })
            .catch(err => {
                console.log(err);
            })
    }

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
            school_class: schoolClass.id
        }
        const url = 'http://localhost:8000/api/v1/school/event-create/';
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                getClassInfo();
                actions.resetForm();
            })
            .catch(err => {
                console.log(err);
            })
    }
    // DELETE FUNCTION
    const handleDelete = (id, model) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/' + model + '-delete/' + id + '/';
        axios.delete(url, {headers: headers})
            .then(res=>{
                console.log(res);
                getClassInfo();
            })
            .catch(err => {
                console.log(err);
            })
    }

    // CREATE STORY FUNCTION
    const handleCreateStory = (title, content, actions) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            title, 
            content,
            school_class: schoolClass.id
        }
        const url = 'http://localhost:8000/api/v1/school/story-create/';
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                getClassInfo();
                actions.resetForm();
            })
            .catch(err => {
                console.log(err);
            })
    }

    // CREATE STUDENT FUNCTION
    const handleCreateStudent = (name, actions) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            name, 
            school_class: schoolClass.id
        }
        const url = 'http://localhost:8000/api/v1/school/student-create/';
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                getClassInfo();
                actions.resetForm();
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
        onSubmit: (values, actions) =>  {
            handleCreateAnnouncement(values.title, values.content, actions);
        },
        validationSchema: Yup.object({
            title: Yup.string().trim().required("title is required"),
            content: Yup.string().trim().required("content is required")
        })
    });

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

    // CREATE STORY FORM
    const story_formik = useFormik({
        initialValues: {
            title: "",
            content: "",
        },
        onSubmit: (values, actions) =>  {
            handleCreateStory(values.title, values.content, actions);
        },
        validationSchema: Yup.object({
            title: Yup.string().trim().required("title is required"),
            content: Yup.string().trim().required("content is required")
        })
    });

    // CREATE STUDENT FORM
    const student_formik = useFormik({
        initialValues: {
            name: ""
        },
        onSubmit: (values, actions) =>  {
            handleCreateStudent(values.name, actions);
        },
        validationSchema: Yup.object({
            name: Yup.string().trim().required("name is required")
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
                    <button onClick={()=>handleDelete(announcement.id, "announcement")}>Delete</button>
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
                        placeholder="Content"
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
        let create_event_form = (
            <form onClick={event_formik.handleSubmit}>
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
        let events = schoolClass.events.map((event)=>{
            return (
                <div className="list-div" key={event.id}>
                    <h3>{event.name}</h3>
                    <p>{event.date}</p>
                    <p>{event.description}</p>
                    <button onClick={()=>handleDelete(event.id, "event")}>Delete</button>
                </div>
            )
        });
        let events_div = (
            <div className="list-div-wrapper">
                <h2>Events</h2>
                {create_event_form}
                {schoolClass.events.length === 0 ? <p>There are no events</p> : null}
                {events}
            </div>
        )
        // STORIES
        let create_story_form = (
            <form onSubmit={story_formik.handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        value={story_formik.values.title}
                        onChange={story_formik.handleChange}
                        onBlur={story_formik.handleBlur}
                        style={{textAlign: "center"}}
                    /> <br/>
                    {story_formik.errors.title ? <div className="ErrorMsg">{story_formik.errors.title} </div> : null}

                    <textarea
                        rows="10"
                        name="content"
                        value={story_formik.values.content}
                        onChange={story_formik.handleChange}
                        onBlur={story_formik.handleBlur}
                        placeholder="Content"
                    /> <br/>
                    {story_formik.errors.content ? <div className="ErrorMsg">{story_formik.errors.content} </div> : null}
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        )
        let stories = schoolClass.stories.map((story)=>{
            return (
                <div className="list-div" key={story.id}>
                    <h3>{story.title}</h3>
                    <p>{story.content}</p>
                    <button onClick={()=>handleDelete(story.id, "story")}>Delete</button>
                </div>
            )
        });
        let stories_div = (
            <div className="list-div-wrapper">
                <h2>Stories</h2>
                {create_story_form}
                {schoolClass.stories.length === 0 ? <p>There are no stories</p> : null}
                {stories}
            </div>
        )

        // STUDENTS
        let create_student_form = (
            <form onSubmit={student_formik.handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={student_formik.values.name}
                        onChange={student_formik.handleChange}
                        onBlur={student_formik.handleBlur}
                        style={{textAlign: "center"}}
                    /> <br/>
                    {student_formik.errors.name ? <div className="ErrorMsg">{student_formik.errors.name} </div> : null}
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        )
        let students = schoolClass.students.map((student)=>{
            return (
                <div className="list-div" key={student.id}>
                    <h3>{student.name}</h3>
                    <button onClick={()=>handleDelete(student.id, "student")}>Delete</button>
                </div>
            )
        });
        let students_div = (
            <div className="list-div-wrapper">
                <h2>Students</h2>
                {create_student_form}
                {schoolClass.students.length === 0 ? <p>There are no students</p> : null}
                {students}
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
                    {students_div}
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