import './Student.css';
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import AwardSticker from '../AwardSticker/AwardSticker';

const Student = (props) => {
    
    const token = useSelector((state)=>state.auth.token);

    // EDIT MODE - when on, all edit buttons disappear. On student being edited, show cancel and confirm buttons.
    const [editMode, setEditMode] = useState(false);
    // edited student's new name
    const [newStudentName, setNewStudentName] = useState("");

    // EDIT STUDENT FUNCTIONS
    // Turn on/off edit mode
    const toggleEditMode = () => {
        if (editMode) {
            setEditMode(false);
            setNewStudentName("")
        } else {
            setEditMode(true);
        }
    }
    // Confirm button
    const handleEditStudentConfirm = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            name: newStudentName
        }
        const url = 'http://localhost:8000/api/v1/school/student-update/' + props.student.id + '/';
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
                setNewStudentName("");
            })
    }

    // JSX
    let editOnDiv = (
        <div>
            <h3>{props.student.name}</h3>
            <input placeholder="New Name" value={newStudentName} onChange={(e)=>setNewStudentName(e.target.value)}/>
            <button onClick={()=>toggleEditMode(null)}>Cancel</button>
            <button onClick={()=>handleEditStudentConfirm()}>Confirm</button>
        </div>
    )
    let editOffDiv = (
        <div>
            <Link to={"/studentProfile/"+props.student.id}><h3>{props.student.name}</h3></Link>
            <button onClick={()=>toggleEditMode(props.student.id)}>Edit</button> <br/>
            <button onClick={()=>props.handleDelete(props.student.id, "student")}>Delete</button>
            <AwardSticker student={props.student} />
        </div>
    )

    return (
        <div className="list-div">
            {(editMode) ? editOnDiv : editOffDiv}
        </div>
    )
}

export default Student;