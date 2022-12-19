import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import EditEventsModal from "./EditEventsModal";
import axios from "axios";
import Spinner from "../Spinner/Spinner";
import HelperList from "./HelperList";

const Event = (props) => {

    const token = useSelector((state)=>state.auth.token);
    const account = useSelector((state)=>state.auth.account);
    const accountType = useSelector((state)=>state.auth.accountType);

    const [showEditDelMenu, setShowEditDelMenu] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isHelper, setIsHelper] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showHelperList, setShowHelperList] = useState(false);

    // On component mount - for parents check if user is in helpers array
    useEffect(()=>{
        if (accountType === 'parent') {
            let helpers = props.event.helpers;
            let isHelper = false;
            helpers.forEach((helper)=>{
                if (helper.parent.user.id === account.id) isHelper = true;
            })
            setIsHelper(isHelper);
        }
    }, [account, accountType, props.event.helpers]);

    // Turn on and off edit model to display edit modal
    const toggleEditMode = () => {
        setEditMode(!editMode)
        if (showEditDelMenu) toggleShowEditDelMenu()
    }

    // Toggle edit and delete menu
    const toggleShowEditDelMenu = () => {
        setShowEditDelMenu(!showEditDelMenu)
    }

    // Register as helper for Event (parent accounts only)
    const registerHelper = () => {
        if (props.event.helpers_required - props.event.helpers.length > 0 ) {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            }
            const data = {
                event: props.event.id
            }
            const url = `${process.env.API_URL}/api/v1/school/helper-create/`;
            setLoading(true);
            axios.post(url, data, {headers: headers})
                .then(res=>{
                    console.log(res);
                    props.getClassInfo();
                })
                .catch(err=>{
                    console.log(err);
                })
                .finally(()=>{
                    setLoading(false);
                })
        }
    }

    // Unregister as helper for Event (parent accounts only)
    const unregisterHelper = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = `${process.env.API_URL}/api/v1/school/helper-delete/${props.event.id}`
        setLoading(true);
        axios.delete(url, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
            })
            .catch(err=>{
                console.log(err);
            })
            .finally(()=>{
                setLoading(false);
            })
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

    let edit_del_btn = (
        <div 
            className="w-12 p-2 border-2 border-gray-300 bg-white cursor-pointer rounded-md flex items-center justify-center"
            onClick={toggleShowEditDelMenu}
        >
            <span><DotsHorizontalIcon className="h-[24px] w-[24px]" /></span>
        </div>
    )
    let register_help_btn = null;
    if (!props.finished) {
        if (loading) {
            if (isHelper) {
                register_help_btn = (
                    <button
                        onClick={registerHelper}
                        className="text-sm ml-2 p-2 border-2 border-gray-300 font-semibold rounded h-8 bg-indigo-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-800 flex justify-center items-center"
                    >
                        <Spinner />
                        Loading
                    </button>
                )
            } else {
                register_help_btn = (
                    <button
                        onClick={registerHelper}
                        className="text-sm ml-2 p-2 border-2 border-gray-300 bg-white font-semibold rounded h-8 hover:bg-indigo-500 hover:text-white hover:border-indigo-800 flex justify-center items-center"
                    >
                        <Spinner />
                        Loading
                    </button>
                )
            }
        } else {
            if (isHelper) {
                register_help_btn = (
                    <button
                        onClick={unregisterHelper}
                        className="text-sm ml-2 p-1 border-2 border-gray-300 font-semibold rounded h-8 bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-800"
                    >Unregister</button>
                )
            } else {
                register_help_btn = (
                    <button
                        onClick={registerHelper}
                        className="text-sm ml-2 p-1 border-2 border-gray-300 bg-white font-semibold rounded h-8 hover:bg-indigo-500 hover:text-white hover:border-indigo-800"
                    >
                        Register
                    </button>
                )
            }
        }
    }

    let event_div = (
        <div className="w-full sm:w-[500px] p-4 mx-auto bg-sky-200 rounded-md shadow-md shadow-gray-300 border-2 border-gray-300" >
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
                <div className="flex justify-start items-center">
                    {!props.finished ? <p className="text-gray-600 text-sm font-semibold pl-2 w-fit">{props.event.helpers_required - props.event.helpers.length} 
                        <span className="text-blue-600 underline cursor-pointer px-1" onClick={()=>setShowHelperList(true)}>helpers</span> 
                        required
                    </p> : null}
                    {accountType === "parent" ? register_help_btn : null}
                </div>
                {accountType === "teacher" ? edit_del_btn : null}
                {showEditDelMenu ? edit_del_menu : null}
            </div>
        </div>
    )
    
    return (
        <div className="mb-4">
            {event_div}
            {(editMode) ? <EditEventsModal event={props.event} getClassInfo={props.getClassInfo} toggleEditMode={toggleEditMode} /> : null}
            {(showHelperList) ? <HelperList helpers={props.event.helpers} setShowHelperList={setShowHelperList} /> : null}
        </div>
    )

}

export default Event;