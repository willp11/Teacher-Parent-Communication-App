import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { XIcon } from "@heroicons/react/outline";
import SubmitBtn from "../UI/SubmitBtn";
import EditModal from "../UI/EditModal";

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

    // SUBMIT BTN
    let submit_btn = (
        <SubmitBtn
            loading={loading}
            clickHandler={story_formik.handleSubmit}
            textContent="Submit"
        />
    )

    let edit_form = (
            <form onSubmit={story_formik.handleSubmit}>
                <input
                    type="text"
                    placeholder="Type a title..."
                    name="title"
                    value={story_formik.values.title}
                    onChange={story_formik.handleChange}
                    onBlur={story_formik.handleBlur}
                    className="border border-gray-300 mt-2 h-10 w-full"
                /> <br/>
                {story_formik.errors.title ? <div className="text-sm w-full text-left pl-2 mt-1">{story_formik.errors.title} </div> : null}

                <textarea
                    rows="3"
                    name="content"
                    placeholder="Write your story..."
                    value={story_formik.values.content}
                    onChange={story_formik.handleChange}
                    onBlur={story_formik.handleBlur}
                    className="border border-gray-300 mt-2 w-full"
                /> <br/>
                {story_formik.errors.content ? <div className="text-sm w-full text-left pl-2">{story_formik.errors.content} </div> : null}
                <div className="flex justify-center mt-1">
                    {submit_btn}
                </div>
            </form>
    )

    return (
        <EditModal title="Edit Story" toggleEditMode={props.toggleEditMode}>
            {edit_form}
        </EditModal>
    )
}

export default EditStoryModal;