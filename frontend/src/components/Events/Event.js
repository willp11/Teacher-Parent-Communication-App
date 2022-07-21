import { useState } from "react";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import EditEventsModal from "./EditEventsModal";

const Event = (props) => {

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

    // JSX
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

    let event_div = (
        <div className="w-full sm:w-[500px] p-4 mx-auto bg-sky-100 rounded-md shadow-md" >
            <div className="bg-white p-2 rounded-md">
                <div className="flex justify-between pb-2">
                    <h3 className="text-left">{props.event.name}</h3>
                    <p className="text-sm">{new Date(props.event.date).toLocaleDateString()}</p>
                </div>
                <p className="pb-2">{props.event.description}</p>
            </div>
            <div className="my-2 border-b-2 border-gray-600">
                
            </div>
            <div className="relative flex justify-between">
                <p className="text-gray-600 text-sm pl-2 pt-2 cursor-pointer w-fit">{props.event.helpers_required} helpers required</p>
                <div 
                    className="w-12 p-2 border-2 border-gray-300 bg-white cursor-pointer rounded-md flex items-center justify-center"
                    onClick={toggleShowEditDelMenu}
                >
                    <span><DotsHorizontalIcon className="h-[24px] w-[24px]" /></span>
                </div>
                {showEditDelMenu ? edit_del_menu : null}
            </div>
        </div>
    )
    
    return (
        <div className="mb-4">
            {event_div}
            {(editMode) ? <EditEventsModal event={props.event} getClassInfo={props.getClassInfo} toggleEditMode={toggleEditMode} /> : null}
        </div>
    )

}

export default Event;