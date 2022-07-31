import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useSelector } from "react-redux";
import Announcement from "./Announcement";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";

const Announcements = (props) => {

    const token = useSelector((state) => state.auth.token);
    const accountType = useSelector((state)=> state.auth.accountType);

    const [showForm, setShowForm] = useState(false);

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

            {showForm ? <form onSubmit={announcement_formik.handleSubmit}>
                <input
                    type="text"
                    placeholder="Type title..."
                    name="title"
                    value={announcement_formik.values.title}
                    onChange={announcement_formik.handleChange}
                    onBlur={announcement_formik.handleBlur}
                    className="border border-gray-300 mt-2 h-10 w-full"
                /> <br/>
                {announcement_formik.errors.title ? <div className="text-sm w-full text-left pl-2 mt-1">{announcement_formik.errors.title} </div> : null}

                <textarea
                    rows="3"
                    name="content"
                    value={announcement_formik.values.content}
                    onChange={announcement_formik.handleChange}
                    onBlur={announcement_formik.handleBlur}
                    placeholder="Type content..."
                    className="border border-gray-300 mt-2 w-full"
                /> <br/>
                {announcement_formik.errors.content ? <div className="text-sm w-full text-left pl-2 mt-1">{announcement_formik.errors.content} </div> : null}
                <button type="submit" className="w-32 rounded bg-sky-500 hover:bg-indigo-500 p-2 m-2 text-white font-semibold">Submit</button>
            </form> : null }
        </div>
    )

    // ANNOUNCEMENTS
    let announcements = props.announcements.map((announcement)=>{
        return <Announcement announcement={announcement} key={announcement.id} handleDelete={props.handleDelete} getClassInfo={props.getClassInfo} />
    });

    let announcements_div = (
        <div>
            {accountType === "teacher" ? create_announcement_form : null}

            <div className="mt-4 mb-16">
                {announcements}
            </div>
            
        </div>
    )

    return announcements_div;
}

export default Announcements;