import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import axios from "axios";
import Story from "./Story";

const Stories = (props) => {

    const token = useSelector((state) => state.auth.token);

    // CREATE STORY FUNCTION
    const handleCreateStory = (title, content, actions) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            title, 
            content,
            school_class: props.classId
        }
        const url = 'http://localhost:8000/api/v1/school/story-create/';
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
            title: Yup.string().trim().required("Title is required"),
            content: Yup.string().trim().required("Content is required")
        })
    });

    // STORIES
    let create_story_form = (
        <div className="w-full sm:w-[500px] p-4 mx-auto mt-2 rounded-md shadow-md bg-slate-100 text-center">
            <form onSubmit={story_formik.handleSubmit}>
                <h3>Create Story</h3>
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

    let stories = props.stories.map((story)=>{
        return <Story story={story} handleDelete={props.handleDelete} key={story.id} getClassInfo={props.getClassInfo}/>
    });

    let stories_div = (
        <div>
            {create_story_form}
            
            <div className="mt-8 mb-16">
                {stories}
            </div>
            
        </div>
    )

    return stories_div;
}

export default Stories;