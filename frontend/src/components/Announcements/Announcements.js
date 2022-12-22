import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useSelector } from "react-redux";
import Announcement from "./Announcement";
import { useState, useMemo } from "react";
import { useMessage } from "../../Hooks/useMessage";
import SubmitBtn from "../UI/SubmitBtn";
import AnnouncementForm from "../Forms/AnnouncementForm";
import CreateContainer from "../UI/CreateContainer";

const Announcements = (props) => {

    const token = useSelector((state) => state.auth.token);
    const accountType = useSelector((state)=> state.auth.accountType);

    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useMessage();
    const [loading, setLoading] = useState(false);

    // sort announcements - newest first
    const sortedAnnouncements = useMemo(()=>{
        let announcements = [...props.announcements]
        announcements.sort((a,b)=>{
            return Date.parse(b.date) - Date.parse(a.date)
        })
        return announcements;
    }, [props.announcements])

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
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/announcement-create/`;
        setLoading(true);
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
                actions.resetForm();
                setMessage("Announcement created successfully.")
            })
            .catch(err => {
                console.log(err);
                setMessage("There was a problem creating the announcement.")
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    // FORMIK
    const announcement_formik = useFormik({
        initialValues: {
            title: "",
            content: "",
        },
        onSubmit: (values, actions) =>  {
            handleCreateAnnouncement(values.title, values.content, actions);
        },
        validationSchema: Yup.object({
            title: Yup.string().trim().required("Title is required"),
            content: Yup.string().trim().required("Content is required")
        })
    });

    // CREATE ANNOUNCEMENT FORM
    let create_announcement_form = (
        <CreateContainer title="Create Announcement" showForm={showForm} setShowForm={setShowForm}>
            <AnnouncementForm formik={announcement_formik} message={message} >
                <SubmitBtn
                    loading={loading}
                    clickHandler={announcement_formik.handleSubmit}
                    textContent="Submit"
                />
            </AnnouncementForm>
        </CreateContainer>
    )

    // ANNOUNCEMENTS
    let announcements = null;
    if (sortedAnnouncements !== undefined && sortedAnnouncements !== null) {
        announcements = sortedAnnouncements.map((announcement)=>{
            return <Announcement announcement={announcement} key={announcement.id} handleDelete={props.handleDelete} getClassInfo={props.getClassInfo} />
        });   
    }

    return (
        <div>
            {accountType === "teacher" ? create_announcement_form : null}
            <div className="mt-4 mb-16">
                {announcements}
            </div>   
        </div>
    )
}

export default Announcements;