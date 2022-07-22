import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { DotsHorizontalIcon, UserAddIcon } from "@heroicons/react/outline";
import EditAssignmentModal from "./EditAssignmentModal";

const Assignment = (props) => {

    const token = useSelector((state)=>state.auth.token);
    const accountType = useSelector((state)=>state.auth.accountType);

    const [showEditDelMenu, setShowEditDelMenu] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Turn on and off edit model to display edit modal
    const toggleEditMode = () => {
        setEditMode(!editMode)
        if (showEditDelMenu) toggleShowEditDelMenu()
    }

    // Toggle edit and delete menu
    const toggleShowEditDelMenu = () => {
        setShowEditDelMenu(!showEditDelMenu)
    }
    // use assignment id
    // const [assignmentToEdit, setAssignmentToEdit] = useState(null);
    // edited assignment new object
    // const [newAssignmentObj, setNewAssignmentObj] = useState({
    //     title: "",
    //     description: "",
    //     maximum_score: 0
    // });

    // // EDIT ASSIGNMENT FUNCTION
    // // Inputs 
    // const handleUpdateAssignmentObj = (field, value) => {
    //     let newObj = {...newAssignmentObj};
    //     newObj[field] = value;
    //     setNewAssignmentObj(newObj);
    // }
    // Turn on/off edit mode
    // const toggleEditMode = (assignment) => {
    //     if (editMode) {
    //         setEditMode(false);
    //         // setAssignmentToEdit(null);
    //         // setNewAssignmentObj({
    //         //     title: "",
    //         //     content: ""
    //         // });
    //     } else {
    //         setEditMode(true);
    //         // setAssignmentToEdit(assignment.id);
    //         // setNewAssignmentObj(assignment);
    //     }
    // }
    // Confirm button
    // const handleEditAssignmentConfirm = () => {
    //     const headers = {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Token ' + token
    //     }
    //     const data = newAssignmentObj;
    //     const url = 'http://localhost:8000/api/v1/school/assignment-update/' + props.assignment.id + '/';
    //     axios.put(url, data, {headers: headers})
    //         .then(res=>{
    //             console.log(res);
    //             props.getClassInfo();
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         })
    //         .finally(()=>{
    //             toggleEditMode(null);
    //             setNewAssignmentObj({
    //                 title: "",
    //                 content: ""
    //             });
    //         })
    // }

    // let editOnDiv = (
    //     <div>
    //         <h3>{props.assignment.title}</h3>
    //         <input type="text" placeholder="New Title" value={newAssignmentObj.title} onChange={(e)=>handleUpdateAssignmentObj("title", e.target.value)}/> <br/>
    //         <textarea placeholder="New Description" value={newAssignmentObj.description} onChange={(e)=>handleUpdateAssignmentObj("description", e.target.value)} rows="10"/> <br/>
    //         <input type="number" placeholder="New Maximum Score" value={newAssignmentObj.maximum_score} onChange={(e)=>handleUpdateAssignmentObj("maximum_score", e.target.value)}/> <br/>
    //         <button onClick={()=>toggleEditMode(null)}>Cancel</button>
    //         <button onClick={()=>handleEditAssignmentConfirm()}>Confirm</button>
    //     </div>
    // )

    // Edit and delete menu
    let edit_del_menu = (
        <div className="absolute right-0 top-11 w-28 z-10 bg-white rounded-md shadow-md shadow-gray-400">
            <div className="border-b-2 border-gray-300 w-full p-2 cursor-pointer" onClick={toggleEditMode}>
                Edit
            </div>
            <div className="w-full p-2 text-red-600 cursor-pointer" onClick={()=>props.handleDelete(props.event.id, "event")}>
                Delete
            </div>
        </div> 
    )

    let edit_del_btn = (
        <div 
            className="w-12 p-2 border-2 border-gray-300 bg-white cursor-pointer rounded-md flex items-center justify-center"
            onClick={toggleShowEditDelMenu}
        >
            <span><DotsHorizontalIcon className="h-[24px] w-[24px]" /></span>
        </div>
    )

    let editOffDiv = (
        <div className="w-full sm:w-[500px] p-4 mx-auto bg-sky-200 rounded-md shadow-md shadow-gray-300 border-2 border-gray-300" >
            <div className="bg-white p-2 rounded-md">
                <div className="flex justify-between pb-2">
                    <h3 className="text-left">{props.assignment.title}</h3>
                    {/* <p className="text-sm">{new Date(assignment.date).toLocaleDateString()}</p> */}
                </div>
                <p className="pb-2">{props.assignment.description}</p>
                <p className="pb-2 text-sm"><b>Max. Score: </b>{props.assignment.maximum_score}</p>
            </div>
            <div className="my-2 border-b-2 border-gray-600">
                
            </div>
            <div className="relative flex justify-between">
                <div 
                    className="w-32 p-2 border-2 border-gray-300 bg-white cursor-pointer rounded-md flex items-center justify-center"
                    onClick={()=>props.toggleAssignMode(props.assignment)}
                >
                    <span className="pr-2"><UserAddIcon className="h-[24px] w-[24px]" /></span>
                    <span>Assign</span>
                </div>
                {accountType === "teacher" ? edit_del_btn : null}
                {showEditDelMenu ? edit_del_menu : null}
            </div>
        </div>
        // <div>
        //     <h3>{props.assignment.title}</h3>
        //     <p>{props.assignment.content}</p>
        //     <p>{props.assignment.description}</p>
        //     <p>Maximum score: {props.assignment.maximum_score}</p>
        //     <button onClick={()=>toggleEditMode(props.assignment)}>Edit</button> <br/>
        //     <button onClick={()=>props.handleDelete(props.assignment.id, "assignment")}>Delete</button> <br />

        //     <button style={{marginTop: "20px"}} onClick={()=>props.toggleAssignMode(props.assignment)}>Assign</button> <br/>
        // </div>
    )

    return (
        <div className="list-div">
            {editOffDiv}
            {(editMode) ? <EditAssignmentModal assignment={props.assignment} getClassInfo={props.getClassInfo} toggleEditMode={toggleEditMode} /> : null}
        </div>
    )

}

export default Assignment;