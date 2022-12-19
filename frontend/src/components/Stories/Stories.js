import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import axios from "axios";
import Story from "./Story";
import { useState, useMemo } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import {useMessage} from "../../Hooks/useMessage";
import Spinner from '../Spinner/Spinner';

const Stories = (props) => {

    const token = useSelector((state) => state.auth.token);
    const accountType = useSelector((state)=> state.auth.accountType);

    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useMessage();
    const [loading, setLoading] = useState(false);

    // sort stories - newest first
    const sortedStories = useMemo(()=>{
        let stories = [...props.stories]
        stories.sort((a,b)=>{
            return Date.parse(b.date) - Date.parse(a.date)
        })
        return stories;
    }, [props.stories])

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
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/story-create/`;
        setLoading(true);
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
                actions.resetForm();
                setMessage("Story created successfully.")
            })
            .catch(err => {
                console.log(err);
                setMessage("There was a problem creating the story.")
            })
            .finally(()=>{
                setLoading(false);
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

    // SUBMIT BTN
    let submit_btn = (
        <button type="submit" className="w-32 rounded bg-sky-500 hover:bg-indigo-500 p-2 m-2 text-white font-semibold">Submit</button>
    )
    if (loading) {
        submit_btn = (
            <button type="submit" className="w-32 rounded bg-sky-500 hover:bg-indigo-500 p-2 my-2 mx-auto text-white font-semibold flex justify-center" disabled>
                <Spinner />
                Loading
            </button>
        )
    }

    // STORIES
    let create_story_form = (
        <div className="relative w-full sm:w-[500px] p-2 mx-auto mt-2 rounded-lg shadow-md shadow-gray-300 border-2 border-gray-300 bg-white text-center">
            <h3>Create Story</h3>

            {showForm ? <ChevronUpIcon onClick={()=>setShowForm(false)} className="h-[24px] w-[24px] absolute right-2 top-3 cursor-pointer" />
             : <ChevronDownIcon onClick={()=>setShowForm(true)} className="h-[24px] w-[24px] absolute right-2 top-3 cursor-pointer" />}

            {showForm ? 
                <form onSubmit={story_formik.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Type title..."
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
                        placeholder="Type content..."
                        value={story_formik.values.content}
                        onChange={story_formik.handleChange}
                        onBlur={story_formik.handleBlur}
                        className="border border-gray-300 mt-2 w-full"
                    /> <br/>
                    {story_formik.errors.content ? <div className="text-sm w-full text-left pl-2">{story_formik.errors.content} </div> : null}
                    {submit_btn}
                    <p className="text-sm">{message}</p>
                </form> 
            : null}
        </div>
    )

    let stories = null;
    if (sortedStories !== undefined && sortedStories !== null) {
        stories = sortedStories.map((story)=>{
            return <Story story={story} handleDelete={props.handleDelete} key={story.id} getClassInfo={props.getClassInfo}/>
        });
    }

    let stories_div = (
        <div>
            {accountType === "teacher" ? create_story_form : null}
            
            <div className="mt-4 mb-16">
                {stories}
            </div>
            
        </div>
    )

    return stories_div;
}

export default Stories;