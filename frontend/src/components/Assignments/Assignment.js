import { useState } from "react";
import { useSelector } from "react-redux";
import { DotsHorizontalIcon, UserAddIcon } from "@heroicons/react/outline";
import EditAssignmentModal from "./EditAssignmentModal";

const Assignment = (props) => {

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
 
    // Edit and delete menu
    let edit_del_menu = (
        <div className="absolute right-0 top-11 w-28 z-10 bg-white rounded-md shadow-md shadow-gray-400">
            <div className="border-b-2 border-gray-300 w-full p-2 cursor-pointer" onClick={toggleEditMode}>
                Edit
            </div>
            <div className="w-full p-2 text-red-600 cursor-pointer" onClick={()=>props.handleDelete(props.assignment.id, "assignment")}>
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

    let assignment_div = (
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
    )

    return (
        <div className="list-div">
            {assignment_div}
            {(editMode) ? <EditAssignmentModal assignment={props.assignment} getClassInfo={props.getClassInfo} toggleEditMode={toggleEditMode} /> : null}
        </div>
    )

}

export default Assignment;