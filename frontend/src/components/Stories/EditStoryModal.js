import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup';
import SubmitBtn from "../UI/SubmitBtn";
import EditModal from "../UI/EditModal";
import StoryForm from "../Forms/StoryForm";

const EditStoryModal = (props) => {

    const token = useSelector((state)=>state.auth.token);
    const [loading, setLoading] = useState(false);

    // Confirm button
    const handleEditStory = (title, content) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            title, 
            content
        }
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/story-update/${props.story.id}/`;
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

    // EDIT STORY FORM
    const story_formik = useFormik({
        initialValues: {
            title: props.story.title,
            content: props.story.content,
        },
        onSubmit: (values) =>  {
            handleEditStory(values.title, values.content);
        },
        validationSchema: Yup.object({
            title: Yup.string().trim().required("Title is required"),
            content: Yup.string().trim().required("Content is required")
        })
    });

    return (
        <EditModal title="Edit Story" toggleEditMode={props.toggleEditMode}>
            <StoryForm formik={story_formik} message={null}>
                <SubmitBtn
                    loading={loading}
                    clickHandler={story_formik.handleSubmit}
                    textContent="Submit"
                />
            </StoryForm>
        </EditModal>
    )
}

export default EditStoryModal;