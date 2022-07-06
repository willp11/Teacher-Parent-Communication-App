import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Event = (props) => {

    const token = useSelector((state)=>state.auth.token);

    // EDIT MODE - when on, all edit buttons disappear. On event being edited, show cancel and confirm buttons.
    const [editMode, setEditMode] = useState(false);
    // use event id
    // const [eventToEdit, setEventToEdit] = useState(null);
    // edited event new object
    const [newEventObj, setNewEventObj] = useState({
        name: "",
        date: "",
        description: "",
        helpers_required: 0
    });

    // EDIT ANNOUNCEMENT FUNCTION
    // Inputs 
    const handleUpdateEventObj = (field, value) => {
        let newObj = {...newEventObj};
        newObj[field] = value;
        setNewEventObj(newObj);
    }
    // Turn on/off edit mode
    const toggleEditMode = (event) => {
        if (editMode) {
            setEditMode(false);
            // setEventToEdit(null);
            setNewEventObj({
                name: "",
                date: "",
                description: "",
                helpers_required: 0
            });
        } else {
            setEditMode(true);
            // setEventToEdit(event.id);
            setNewEventObj(event);
        }
    }
    // Confirm button
    const handleEditEventConfirm = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = newEventObj;
        const url = 'http://localhost:8000/api/v1/school/event-update/' + props.event.id + '/';
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
                setNewEventObj({
                    name: "",
                    date: "",
                    description: "",
                    helpers_required: 0
                });
            })
    }

    let editOnDiv = (
        <div>
            <h3>{props.event.name}</h3>
            <input type="text" placeholder="New Name" value={newEventObj.name} onChange={(e)=>handleUpdateEventObj("name", e.target.value)}/> <br/>
            <input type="date" value={newEventObj.date} onChange={(e)=>handleUpdateEventObj("date", e.target.value)}/> <br/>
            <textarea placeholder="New description" value={newEventObj.description} onChange={(e)=>handleUpdateEventObj("description", e.target.value)} rows="10"/> <br/>
            <input type="number" value={newEventObj.helpers_required} onChange={(e)=>handleUpdateEventObj("helpers_required", e.target.value)}/> <br/>
            <button onClick={()=>toggleEditMode(null)}>Cancel</button>
            <button onClick={()=>handleEditEventConfirm()}>Confirm</button>
        </div>
    )
    let editOffDiv = (
        <div>
            <h3>{props.event.name}</h3>
            <p>{props.event.date}</p>
            <p>{props.event.description}</p>
            <p>Helpers required: {props.event.helpers_required}</p>
            <button onClick={()=>toggleEditMode(props.event)}>Edit</button> <br/>
            <button onClick={()=>props.handleDelete(props.event.id, "event")}>Delete</button>
        </div>
    )
    return (
        <div className="list-div">
            {(editMode) ? editOnDiv : editOffDiv}
        </div>
    )

}

export default Event;