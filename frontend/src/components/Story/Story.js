import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import StoryComments from "../StoryComments/StoryComments";

const Story = (props) => {

    const token = useSelector((state) => state.auth.token);

    // COMMENTS LIST
    const [comments, setComments] = useState([]);

    // GET ALL COMMENTS FOR THIS STORY
    const getStoryComments = useCallback(()=>{
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/story-comment-list/' + props.story.id + '/';
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setComments(res.data);
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token, props.story.id])

    // ON MOUNT - GET STORY'S COMMENTS
    useEffect(()=>{
        getStoryComments();
    }, [getStoryComments]);

    // EDIT MODE 
    const [editMode, setEditMode] = useState(false);
    // edited story new object
    const [newStoryObj, setNewStoryObj] = useState({
        title: "",
        content: ""
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
        const url = 'http://localhost:8000/api/v1/school/story-update/' + props.story.id + '/';
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
            setNewStoryObj({
                title: "",
                content: ""
            });
        } else {
            setEditMode(true);
            setNewStoryObj(story);
        }
    }

    let editOnDiv = (
        <div>
            <h3>{props.story.title}</h3>
            <input placeholder="New Title" value={newStoryObj.title} onChange={(e)=>handleUpdateStoryObj("title", e.target.value)}/>
            <textarea placeholder="New Content" value={newStoryObj.content} onChange={(e)=>handleUpdateStoryObj("content", e.target.value)} rows="10"/> <br/>
            <button onClick={()=>toggleEditMode(null)}>Cancel</button>
            <button onClick={()=>handleEditStoryConfirm()}>Confirm</button>
        </div>
    )
    let editOffDiv = (
        <div>
            <h3>{props.story.title}</h3>
            <p>{props.story.content}</p>
            <StoryComments story={props.story} comments={comments} getStoryComments={getStoryComments}/>
            <button onClick={()=>toggleEditMode(props.story)}>Edit</button> <br/>
            <button onClick={()=>props.handleDelete(props.story.id, "story")}>Delete</button>
        </div>
    )
    return (
        <div className="list-div" >
            {(editMode) ? editOnDiv : editOffDiv}
        </div>
    )
}

export default Story;