import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DotsHorizontalIcon, UserAddIcon, LinkIcon } from "@heroicons/react/outline";
import EditAssignmentModal from "./EditAssignmentModal";
import ResponsesModal from "./ResponsesModal";

const Assignment = (props) => {

    const accountType = useSelector((state)=>state.auth.accountType);

    const [showEditDelMenu, setShowEditDelMenu] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [showCopiedNotification, setShowCopiedNotification] = useState(false);

    const [showResponsesModal, setShowResponsesModal] = useState(false);

    useEffect(()=>{
        const reset = setTimeout(()=>{
            setShowCopiedNotification(false)
        }, 3000)

        return () => {
            clearTimeout(reset)
        }
    }, [showCopiedNotification])

    // Turn on and off to display response modal
    const toggleResponsesModal = () => {
        setShowResponsesModal(!showResponsesModal);
    }

    // Turn on and off edit model to display edit modal
    const toggleEditMode = () => {
        setEditMode(!editMode)
        if (showEditDelMenu) toggleShowEditDelMenu()
    }

    // Toggle edit and delete menu
    const toggleShowEditDelMenu = () => {
        setShowEditDelMenu(!showEditDelMenu)
    }

    // Copy response link to clipboard
    const copyLink = () => {
        navigator.clipboard.writeText(`${process.env.FRONTEND_URL}/assignment/${props.assignment.code}`);
        setShowCopiedNotification(true);
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
        <div className="w-full sm:w-[500px] p-4 mx-auto my-2 bg-sky-200 rounded-md shadow-md shadow-gray-300 border-2 border-gray-300" >
            <div className="bg-white p-2 rounded-md">
                <div className="flex justify-between pb-2">
                    <h3 className="text-left">{props.assignment.title}</h3>
                    {/* <p className="text-sm">{new Date(assignment.date).toLocaleDateString()}</p> */}
                </div>
                <p className="pb-2">{props.assignment.description}</p>
                <p className="pb-2 text-sm"><b>Max. Score: </b>{props.assignment.maximum_score}</p>
                <div className="w-full flex justify-between">
                    <p className="pb-2 text-sm"><b>Response format: </b>{props.assignment.response_format}</p>
                    <div className="flex justify-center items-start">
                        <p className="text-sm font-bold">Student Link: </p>
                        <LinkIcon className="h-[24px] w-[24px] cursor-pointer stroke-gray-600 ml-1 hover:stroke-indigo-500" onClick={copyLink}/>
                        {showCopiedNotification ? <div className="relative">
                            <div className="absolute right-0 top-0 bg-white rounded border border-gray-300 p-2 w-24 text-center z-20">
                                <p className="text-sm">Copied to clipboard</p>
                            </div>
                        </div> : null}
                    </div>
                </div>
            </div>
            <div className="my-2 border-b-2 border-gray-600">
                
            </div>
            <div className="relative flex justify-between">
                <div className="flex justify-start items-center">
                    <div 
                        className="w-28 p-2 border-2 border-gray-300 bg-white cursor-pointer rounded-md flex items-center justify-center"
                        onClick={()=>props.toggleAssignMode(props.assignment)}
                    >
                        <span className="pr-2"><UserAddIcon className="h-[24px] w-[24px]" /></span>
                        <span>Assign</span>
                    </div>
                    <div 
                        className="w-28 ml-2 p-2 border-2 border-gray-300 bg-white cursor-pointer rounded-md flex items-center justify-center"
                        onClick={toggleResponsesModal}
                    >
                        <span>Responses</span>
                    </div>
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
            {(showResponsesModal) ? <ResponsesModal assignment={props.assignment} toggleResponsesModal={toggleResponsesModal} /> : null}
        </div>
    )

}

export default Assignment;