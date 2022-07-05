import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useSelector } from "react-redux";
import { useState } from "react";

const Announcements = (props) => {

    const token = useSelector((state) => state.auth.token);

    // EDIT MODE - when on, all edit buttons disappear. On announcement being edited, show cancel and confirm buttons.
    const [editMode, setEditMode] = useState(false);
    // use announcement id
    const [announcementToEdit, setAnnouncementToEdit] = useState(null);
    // edited announcement new object
    const [newAnnouncementObj, setNewAnnouncementObj] = useState({
        title: "",
        content: ""
    });

    // CREATE ANNOUNCEMENT FUNCTION
    const handleCreateAnnouncement = (title, content, actions) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            title,
            content,
            school_class: props.classId
        }
        const url = 'http://localhost:8000/api/v1/school/announcement-create/';
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

    // EDIT ANNOUNCEMENT FUNCTION
    // Inputs 
    const handleUpdateAnnouncementObj = (field, value) => {
        let newObj = {...newAnnouncementObj};
        newObj[field] = value;
        setNewAnnouncementObj(newObj);
    }
    // Confirm button
    const handleEditAnnouncementConfirm = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = newAnnouncementObj;
        const url = 'http://localhost:8000/api/v1/school/announcement-update/' + announcementToEdit + '/';
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
                setNewAnnouncementObj({
                    title: "",
                    content: ""
                });
            })
    }
    // Turn on/off edit mode
    const toggleEditMode = (announcement) => {
        if (editMode) {
            setEditMode(false);
            setAnnouncementToEdit(null);
            setNewAnnouncementObj({
                title: "",
                content: ""
            });
        } else {
            setEditMode(true);
            setAnnouncementToEdit(announcement.id);
            setNewAnnouncementObj(announcement);
        }
    }

    // CREATE/UPDATE ANNOUNCEMENT FORM
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

    // ANNOUNCEMENTS
    let announcements = props.announcements.map((announcement)=>{
        let editOnDiv = (
            <div>
                <h3>{announcement.title}</h3>
                <input placeholder="New Title" value={newAnnouncementObj.title} onChange={(e)=>handleUpdateAnnouncementObj("title", e.target.value)}/>
                <textarea placeholder="New Content" value={newAnnouncementObj.content} onChange={(e)=>handleUpdateAnnouncementObj("content", e.target.value)} rows="10"/> <br/>
                <button onClick={()=>toggleEditMode(null)}>Cancel</button>
                <button onClick={()=>handleEditAnnouncementConfirm()}>Confirm</button>
            </div>
        )
        let editOffDiv = (
            <div>
                <h3>{announcement.title}</h3>
                <p>{announcement.date}</p>
                <p>{announcement.content}</p>
                <button onClick={()=>toggleEditMode(announcement)}>Edit</button> <br/>
                <button onClick={()=>props.handleDelete(announcement.id, "announcement")}>Delete</button>
            </div>
        )
        return (
            <div className="list-div" key={announcement.id}>
                {(editMode) ? editOnDiv : editOffDiv}
            </div>
        )
    });

    let announcements_div = (
        <div className="list-div-wrapper">
            <h2>Announcements</h2>
            {(!editMode) ? create_announcement_form : null}
            {announcements.length === 0 ? <p>There are no announcements</p> : null}
            {announcements}
        </div>
    )

    return announcements_div;
}

export default Announcements;