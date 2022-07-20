import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ProfileImg from '../../Assets/Images/blank-profile.png';
import { PencilAltIcon, CheckIcon, XIcon, TrashIcon } from "@heroicons/react/outline";
import AwardSticker from "./AwardSticker";

const StudentModal = (props) => {

    const token = useSelector((state)=>state.auth.token);

    const [studentName, setStudentName] = useState("");

    // Load the student's name - so when update the UI when edit name
    useEffect(()=>{
        setStudentName(props.student.name);
    }, [props.student])

    // DELETE MODE
    const [showDelete, setShowDelete] = useState(false);

    // EDIT MODE
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
                setStudentName(newStudentName);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(()=>{
                toggleEditMode(null);
                setNewStudentName("");
            })
    }

    // DELETE STUDENT
    const toggleDeleteConfirmation = () => {
        setShowDelete(!showDelete);
    }
    const deleteStudentHandler = () => {
        setShowDelete(false);
        props.handleDelete(props.student.id, "student");
        props.hide();
    }

    // JSX
    let edit_on_div = (
        <div className="text-center pt-6">
            <h2 className="mr-2 truncate">{studentName}</h2>
            <div className="flex items-center justify-center">
                <input 
                    placeholder="Type new name..." 
                    value={newStudentName} 
                    onChange={(e)=>setNewStudentName(e.target.value)}
                    className="border border-gray-300 mt-2 mb-2 text-sm h-8"
                /> 
                <XIcon onClick={()=>toggleEditMode(null)} className="h-[24px] w-[24px] cursor-pointer stroke-red-500 hover:border hover:border-red-500 rounded-full mx-2" />
                <CheckIcon onClick={()=>handleEditStudentConfirm()} className="h-[24px] w-[24px] cursor-pointer stroke-green-500 hover:border hover:border-green-500 rounded-full" />
            </div>
        </div>
    )
    let edit_off_div = (
        <div className="flex items-center justify-center pt-6">
            <h2 className="mr-2 truncate">{studentName}</h2>
            <PencilAltIcon className="h-[24px] w-[24px] cursor-pointer" onClick={toggleEditMode}/>
        </div>
    )

    let student_modal_div = (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] w-screen h-screen flex items-center justify-center">
            <div className="relative bg-white rounded-md shadow-md w-[calc(100%-2rem)] sm:w-[600px] min-h-[340px] p-2">
                <XIcon 
                    className="absolute top-2 right-2 h-[24px] w-[24px] hover:border hover:border-gray-300 cursor-pointer"
                    onClick={props.hide}
                />
                <TrashIcon
                    className="absolute top-2 left-2 h-[24px] w-[24px] hover:border hover:border-gray-300 cursor-pointer"
                    onClick={toggleDeleteConfirmation}
                />
                <div className="w-full border-b-2 border-gray-400">
                    {editMode ? edit_on_div : edit_off_div}
                    <img src={ProfileImg} className="h-[100px] w-[100px] mx-auto rounded-full my-2"/>
                </div>
                <AwardSticker studentId={props.student.id} name={studentName}/>
            </div>
        </div>
    )

    let delete_confirmation_div = (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] w-screen h-screen flex items-center justify-center">
            <div className="relative bg-white rounded-md shadow-md w-[calc(100%-2rem)] min-h-[340px] sm:w-[600px] p-2 flex flex-col items-center justify-center">
                <h3>Delete Student</h3>
                <p className="mt-2">Are you sure you want to delete this student?</p>
                <div className="flex mt-2">
                    <XIcon onClick={()=>toggleDeleteConfirmation(null)} className="h-[24px] w-[24px] cursor-pointer stroke-red-500 hover:border hover:border-red-500 rounded-full mx-2" />
                    <CheckIcon onClick={deleteStudentHandler} className="h-[24px] w-[24px] cursor-pointer stroke-green-500 hover:border hover:border-green-500 rounded-full" />
                </div>
            </div>
        </div>
    )
    
    if (showDelete) {
        return delete_confirmation_div;
    } else {
        return student_modal_div;
    }
}

export default StudentModal;