import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useSelector } from "react-redux";
import Announcement from "./Announcement";
import { useState, useMemo } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { useMessage } from "../../Hooks/useMessage";
import SubmitBtn from "../UI/SubmitBtn";
import AnnouncementForm from "../Forms/AnnouncementForm";

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
        <div className="relative w-full sm:w-[500px] p-2 mx-auto mt-2 rounded-md shadow-md bg-white shadow-gray-300 border-2 border-gray-300 text-center">
            <h3>Create Announcement</h3>

            {showForm ? <ChevronUpIcon onClick={()=>setShowForm(false)} className="h-[24px] w-[24px] absolute right-2 top-3 cursor-pointer" />
             : <ChevronDownIcon onClick={()=>setShowForm(true)} className="h-[24px] w-[24px] absolute right-2 top-3 cursor-pointer" />}

            {showForm && 
                <AnnouncementForm
                    formik={announcement_formik}
                    message={message}
                >
                    <SubmitBtn
                        loading={loading}
                        clickHandler={announcement_formik.handleSubmit}
                        textContent="Submit"
                    />
                </AnnouncementForm>
            }
        </div>
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