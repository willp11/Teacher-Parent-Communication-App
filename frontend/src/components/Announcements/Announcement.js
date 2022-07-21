import { useState } from "react";
import { useSelector } from "react-redux";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import EditAnnouncementModal from "./EditAnnouncementModal";

const Announcement = (props) => {

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

    // JSX
    // Edit and delete menu
    let edit_del_menu = (
        <div className="absolute right-0 top-11 w-28 z-10 bg-white rounded-md shadow-md shadow-gray-400">
            <div className="border-b-2 border-gray-300 w-full p-2 cursor-pointer" onClick={toggleEditMode}>
                Edit
            </div>
            <div className="w-full p-2 text-red-600 cursor-pointer" onClick={()=>props.handleDelete(props.announcement.id, "announcement")}>
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
    
    let announcement_div = (
        <div className="w-full sm:w-[500px] p-4 mx-auto bg-sky-100 rounded-md shadow-md" >
            <div className="bg-white p-2 rounded-md">
                <div className="flex justify-between pb-2">
                    <h3 className="text-left">{props.announcement.title}</h3>
                    <p className="text-sm">{new Date(props.announcement.date).toLocaleDateString()}</p>
                </div>
                <div className="relative flex justify-between">
                    <p className="pb-2">{props.announcement.content}</p>
                    {accountType === "teacher" ? edit_del_btn : null}
                    {showEditDelMenu ? edit_del_menu : null}
                </div>
            </div>
        </div>
    )
    
    return (
        <div className="mb-4">
            {announcement_div}
            {(editMode) ? <EditAnnouncementModal announcement={props.announcement} getClassInfo={props.getClassInfo} toggleEditMode={toggleEditMode} /> : null}
        </div>
    )

}

export default Announcement;