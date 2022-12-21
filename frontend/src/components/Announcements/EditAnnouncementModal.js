import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup';
import SubmitBtn from "../UI/SubmitBtn";
import EditModal from "../UI/EditModal";

const EditAnnouncementModal = (props) => {

    const token = useSelector((state)=>state.auth.token);

    const [loading, setLoading] = useState(false);

    // EDIT ANNOUNCEMENT REQUEST HANDLER
    const handleEditConfirm = (title, content) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            title,
            content
        };
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/announcement-update/${props.announcement.id}/`;
        setLoading(true);
        axios.put(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
                props.toggleEditMode();
            })
            .catch(err => {
                console.log(err);
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    // EDIT ANNOUNCEMENT FORM
    const announcement_formik = useFormik({
        initialValues: {
            title: props.announcement.title,
            content: props.announcement.content,
        },
        onSubmit: (values) =>  {
            handleEditConfirm(values.title, values.content);
        },
        validationSchema: Yup.object({
            title: Yup.string().trim().required("title is required"),
            content: Yup.string().trim().required("content is required")
        })
    });

    // SUBMIT BTN
    let submit_btn = (
        <SubmitBtn
            loading={loading}
            clickHandler={announcement_formik.handleSubmit}
            textContent="Submit"
        />
    )
    
    // EDIT ANNOUNCEMENT FORM
    let edit_form = (
        <form onSubmit={announcement_formik.handleSubmit}>
            <input
                type="text"
                placeholder="Type the title..."
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
                placeholder="Write the content..."
                className="border border-gray-300 mt-2 w-full"
            /> <br/>
            {announcement_formik.errors.content ? <div className="text-sm w-full text-left pl-2 mt-1">{announcement_formik.errors.content} </div> : null}
            <div className="flex justify-center mt-2">
                {submit_btn}
            </div>
        </form>
    )

    return (
        <EditModal title="Edit Announcement" toggleEditMode={props.toggleEditMode}>
            {edit_form}
        </EditModal>
    )
}

export default EditAnnouncementModal;