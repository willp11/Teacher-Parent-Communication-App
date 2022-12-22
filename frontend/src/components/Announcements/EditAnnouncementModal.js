import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup';
import SubmitBtn from "../UI/SubmitBtn";
import EditModal from "../UI/EditModal";
import AnnouncementForm from "../Forms/AnnouncementForm";

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

    // FORMIK
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

    return (
        <EditModal title="Edit Announcement" toggleEditMode={props.toggleEditMode}>
            <AnnouncementForm formik={announcement_formik} message={null}>
                <SubmitBtn
                    loading={loading}
                    clickHandler={announcement_formik.handleSubmit}
                    textContent="Submit"
                />
            </AnnouncementForm>
        </EditModal>
    )
}

export default EditAnnouncementModal;