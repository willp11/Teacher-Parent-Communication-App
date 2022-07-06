import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Announcement = (props) => {

    const token = useSelector((state)=>state.auth.token);

    // EDIT MODE
    const [editMode, setEditMode] = useState(false);
    // edited announcement new object
    const [newAnnouncementObj, setNewAnnouncementObj] = useState({
        title: "",
        content: ""
    });

    // EDIT ANNOUNCEMENT FUNCTIONS
    // Inputs 
    const handleUpdateAnnouncementObj = (field, value) => {
        let newObj = {...newAnnouncementObj};
        newObj[field] = value;
        setNewAnnouncementObj(newObj);
    }

    // Turn on/off edit mode
    const toggleEditMode = (announcement) => {
        if (editMode) {
            setEditMode(false);
            setNewAnnouncementObj({
                title: "",
                content: ""
            });
        } else {
            setEditMode(true);
            setNewAnnouncementObj(announcement);
        }
    }

    // Confirm button
    const handleEditAnnouncementConfirm = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = newAnnouncementObj;
        const url = 'http://localhost:8000/api/v1/school/announcement-update/' + props.announcement.id + '/';
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
                setNewAnnouncementObj({
                    title: "",
                    content: ""
                });
            })
    }

    let editOnDiv = (
        <div>
            <h3>{props.announcement.title}</h3>
            <input placeholder="New Title" value={newAnnouncementObj.title} onChange={(e)=>handleUpdateAnnouncementObj("title", e.target.value)}/>
            <textarea placeholder="New Content" value={newAnnouncementObj.content} onChange={(e)=>handleUpdateAnnouncementObj("content", e.target.value)} rows="10"/> <br/>
            <button onClick={()=>toggleEditMode(null)}>Cancel</button>
            <button onClick={()=>handleEditAnnouncementConfirm()}>Confirm</button>
        </div>
    )
    let editOffDiv = (
        <div>
            <h3>{props.announcement.title}</h3>
            <p>{props.announcement.date}</p>
            <p>{props.announcement.content}</p>
            <button onClick={()=>toggleEditMode(props.announcement)}>Edit</button> <br/>
            <button onClick={()=>props.handleDelete(props.announcement.id, "announcement")}>Delete</button>
        </div>
    )
    return (
        <div className="list-div">
            {(editMode) ? editOnDiv : editOffDiv}
        </div>
    )

}

export default Announcement;