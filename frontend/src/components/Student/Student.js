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
            <h3 className="text-blue-700 underline">{props.student.name}</h3>
            <input 
                placeholder="Type new name..." 
                value={newStudentName} 
                onChange={(e)=>setNewStudentName(e.target.value)}
                className="border border-gray-300 mt-2 h-10 mb-2"
            /> <br/>
            <button 
                onClick={()=>toggleEditMode(null)}
                className="w-32 rounded-full bg-red-500 hover:bg-red-600 px-2 py-1 my-1 mr-2 text-white font-bold border-2 border-black"
            >
                Cancel
            </button>
            <button 
                onClick={()=>handleEditStudentConfirm()}
                className="w-32 rounded-full bg-sky-500 hover:bg-indigo-500 px-2 py-1 my-1 text-white font-bold border-2 border-black"
            >
                Confirm
            </button>
        </div>
    )
    let editOffDiv = (
        <div>
            <Link to={"/studentProfile/"+props.student.id}><h3 className="text-blue-700 underline">{props.student.name}</h3></Link>
            <button 
                onClick={()=>toggleEditMode(props.student.id)}
                className="w-32 rounded-full bg-sky-500 hover:bg-indigo-500 px-2 py-1 mt-2 mb-1 text-white font-bold border-2 border-black"
            >
                Edit Name
            </button> <br/>
            <button 
                onClick={()=>props.handleDelete(props.student.id, "student")}
                className="w-32 rounded-full bg-red-500 hover:bg-red-600 px-2 py-1 my-1 text-white font-bold border-2 border-black"
            >
                Delete
            </button>
            <AwardSticker student={props.student} />
        </div>
    )

    return (
        <div className="border border-gray-100 shadow w-96 max-w-full mx-auto mb-4 p-2 bg-sky-100">
            {(editMode) ? editOnDiv : editOffDiv}
        </div>
    )
}

export default Student;