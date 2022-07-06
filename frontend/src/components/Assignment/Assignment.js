import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Assignment = (props) => {

    const token = useSelector((state)=>state.auth.token);

    // EDIT MODE - when on, all edit buttons disappear. On assignment being edited, show cancel and confirm buttons.
    const [editMode, setEditMode] = useState(false);
    // use assignment id
    // const [assignmentToEdit, setAssignmentToEdit] = useState(null);
    // edited assignment new object
    const [newAssignmentObj, setNewAssignmentObj] = useState({
        title: "",
        description: "",
        maximum_score: 0
    });

    // EDIT ASSIGNMENT FUNCTION
    // Inputs 
    const handleUpdateAssignmentObj = (field, value) => {
        let newObj = {...newAssignmentObj};
        newObj[field] = value;
        setNewAssignmentObj(newObj);
    }
    // Turn on/off edit mode
    const toggleEditMode = (assignment) => {
        if (editMode) {
            setEditMode(false);
            // setAssignmentToEdit(null);
            setNewAssignmentObj({
                title: "",
                content: ""
            });
        } else {
            setEditMode(true);
            // setAssignmentToEdit(assignment.id);
            setNewAssignmentObj(assignment);
        }
    }
    // Confirm button
    const handleEditAssignmentConfirm = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = newAssignmentObj;
        const url = 'http://localhost:8000/api/v1/school/assignment-update/' + props.assignment.id + '/';
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
                setNewAssignmentObj({
                    title: "",
                    content: ""
                });
            })
    }

    let editOnDiv = (
        <div>
            <h3>{props.assignment.title}</h3>
            <input type="text" placeholder="New Title" value={newAssignmentObj.title} onChange={(e)=>handleUpdateAssignmentObj("title", e.target.value)}/> <br/>
            <textarea placeholder="New Description" value={newAssignmentObj.description} onChange={(e)=>handleUpdateAssignmentObj("description", e.target.value)} rows="10"/> <br/>
            <input type="number" placeholder="New Maximum Score" value={newAssignmentObj.maximum_score} onChange={(e)=>handleUpdateAssignmentObj("maximum_score", e.target.value)}/> <br/>
            <button onClick={()=>toggleEditMode(null)}>Cancel</button>
            <button onClick={()=>handleEditAssignmentConfirm()}>Confirm</button>
        </div>
    )
    let editOffDiv = (
        <div>
            <h3>{props.assignment.title}</h3>
            <p>{props.assignment.content}</p>
            <p>{props.assignment.description}</p>
            <p>Maximum score: {props.assignment.maximum_score}</p>
            <button onClick={()=>toggleEditMode(props.assignment)}>Edit</button> <br/>
            <button onClick={()=>props.handleDelete(props.assignment.id, "assignment")}>Delete</button> <br />

            <button style={{marginTop: "20px"}} onClick={()=>props.toggleAssignMode(props.assignment)}>Assign</button> <br/>
        </div>
    )

    return (
        <div className="list-div">
            {(editMode) ? editOnDiv : editOffDiv}
        </div>
    )

}

export default Assignment;