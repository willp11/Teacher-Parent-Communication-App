import { useSelector } from "react-redux";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { XIcon } from "@heroicons/react/outline";

const EditStoryModal = (props) => {

    const token = useSelector((state)=>state.auth.token);

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
        const url = 'http://localhost:8000/api/v1/school/story-update/' + props.story.id + '/';
        axios.put(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
                props.toggleEditMode();
            })
            .catch(err => {
                console.log(err);

                // TO DO - display error messages
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

    let edit_story_form = (
        <div className="relative w-full sm:w-[500px] p-4 mx-auto mt-2 rounded-md shadow-md bg-slate-100 text-center">
            <XIcon 
                className="absolute top-2 right-2 h-[24px] w-[24px] hover:border hover:border-gray-300 cursor-pointer"
                onClick={props.toggleEditMode}
            />
            <form onSubmit={story_formik.handleSubmit}>
                <h3>Edit Story</h3>
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
                <button type="submit" className="w-32 rounded-full bg-sky-500 hover:bg-indigo-500 p-2 my-2 text-white font-bold border-2 border-black">Submit</button>
            </form>
        </div>
    )

    let edit_modal = (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-20 w-screen h-screen flex items-center justify-center">
            {edit_story_form}
        </div>
    )

    return edit_modal;
}

export default EditStoryModal;