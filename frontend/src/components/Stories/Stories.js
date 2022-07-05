import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import axios from "axios";
import { useState } from "react";

const Stories = (props) => {

    const token = useSelector((state) => state.auth.token);

    // EDIT MODE - when on, all edit buttons disappear. On story being edited, show cancel and confirm buttons.
    const [editMode, setEditMode] = useState(false);
    // use story id
    const [storyToEdit, setStoryToEdit] = useState(null);
    // edited story new object
    const [newStoryObj, setNewStoryObj] = useState({
        title: "",
        content: ""
    });

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
            title: Yup.string().trim().required("title is required"),
            content: Yup.string().trim().required("content is required")
        })
    });

    // EDIT STORY FUNCTION
    // Inputs 
    const handleUpdateStoryObj = (field, value) => {
        let newObj = {...newStoryObj};
        newObj[field] = value;
        setNewStoryObj(newObj);
    }
    // Confirm button
    const handleEditStoryConfirm = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = newStoryObj;
        const url = 'http://localhost:8000/api/v1/school/story-update/' + storyToEdit + '/';
        axios.put(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
            })
            .catch(err => {
                console.log(err);
            })
            .finally(()=>{
                toggleEditMode(null);
                setNewStoryObj({
                    title: "",
                    content: ""
                });
            })
    }
    // Turn on/off edit mode
    const toggleEditMode = (story) => {
        if (editMode) {
            setEditMode(false);
            setStoryToEdit(null);
            setNewStoryObj({
                title: "",
                content: ""
            });
        } else {
            setEditMode(true);
            setStoryToEdit(story.id);
            setNewStoryObj(story);
        }
    }

    // STORIES
    let create_story_form = (
        <form onSubmit={story_formik.handleSubmit}>
            <div>
                <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={story_formik.values.title}
                    onChange={story_formik.handleChange}
                    onBlur={story_formik.handleBlur}
                    style={{textAlign: "center"}}
                /> <br/>
                {story_formik.errors.title ? <div className="ErrorMsg">{story_formik.errors.title} </div> : null}

                <textarea
                    rows="10"
                    name="content"
                    value={story_formik.values.content}
                    onChange={story_formik.handleChange}
                    onBlur={story_formik.handleBlur}
                    placeholder="Content"
                /> <br/>
                {story_formik.errors.content ? <div className="ErrorMsg">{story_formik.errors.content} </div> : null}
            </div>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    )
    let stories = props.stories.map((story)=>{
        let editOnDiv = (
            <div>
                <h3>{story.title}</h3>
                <input placeholder="New Title" value={newStoryObj.title} onChange={(e)=>handleUpdateStoryObj("title", e.target.value)}/>
                <textarea placeholder="New Content" value={newStoryObj.content} onChange={(e)=>handleUpdateStoryObj("content", e.target.value)} rows="10"/> <br/>
                <button onClick={()=>toggleEditMode(null)}>Cancel</button>
                <button onClick={()=>handleEditStoryConfirm()}>Confirm</button>
            </div>
        )
        let editOffDiv = (
            <div>
                <h3>{story.title}</h3>
                <p>{story.content}</p>
                <button onClick={()=>toggleEditMode(story)}>Edit</button> <br/>
                <button onClick={()=>props.handleDelete(story.id, "story")}>Delete</button>
            </div>
        )
        return (
            <div className="list-div" key={story.id}>
                {(editMode && storyToEdit === story.id) ? editOnDiv : editOffDiv}
            </div>
        )
    });
    let stories_div = (
        <div className="list-div-wrapper">
            <h2>Stories</h2>
            {create_story_form}
            {props.stories.length === 0 ? <p>There are no stories</p> : null}
            {stories}
        </div>
    )

    return stories_div;
}

export default Stories;