import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import StoryComments from "./StoryComments";
import { ChatIcon, DotsHorizontalIcon } from "@heroicons/react/outline";
import EditStoryModal from "./EditStoryModal";

const Story = (props) => {

    const token = useSelector((state) => state.auth.token);
    const accountType = useSelector((state) => state.auth.accountType);

    // COMMENTS LIST
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [writeComment, setWriteComment] = useState(false);
    const [showEditDelMenu, setShowEditDelMenu] = useState(false);

    // Toggle comments
    const toggleShowComments = () => {
        setShowComments(!showComments);
    }

    // Toggle write comment input
    const toggleWriteComment = () => {
        setWriteComment(!writeComment);
    }

    // Toggle edit and delete menu
    const toggleShowEditDelMenu = () => {
        setShowEditDelMenu(!showEditDelMenu)
    }

    // GET ALL COMMENTS FOR THIS STORY
    const getStoryComments = useCallback(()=>{
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/story-comment-list/' + props.story.id + '/';
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setComments(res.data);
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token, props.story.id])

    // ON MOUNT - GET STORY'S COMMENTS
    useEffect(()=>{
        getStoryComments();
    }, [getStoryComments]);

    // EDIT MODE 
    const [editMode, setEditMode] = useState(false);
    const toggleEditMode = () => {
        setEditMode(!editMode)
        if (showEditDelMenu) toggleShowEditDelMenu()
    }

    // JSX
    // Edit and delete menu
    let edit_del_menu = (
        <div className="absolute right-0 top-11 w-28 z-10 bg-white rounded-md shadow-md shadow-gray-400">
            <div className="border-b-2 border-gray-300 w-full p-2 cursor-pointer" onClick={toggleEditMode}>
                Edit
            </div>
            <div className="w-full p-2 text-red-600 cursor-pointer" onClick={()=>props.handleDelete(props.story.id, "story")}>
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

    // Main story div
    let story_div = (
        <div className="w-full sm:w-[500px] p-4 mx-auto bg-sky-100 rounded-md shadow-md ">
            <div className="bg-white p-2 rounded-md">
                <div className="flex justify-between items-center pb-2">
                    <h3 className="text-left">{props.story.title}</h3>
                    <p className="text-sm">{new Date(props.story.date).toLocaleDateString()}</p>
                </div>
                <p className="pb-2">{props.story.content}</p>
            </div>
            <p className="text-gray-600 text-sm pl-2 pt-2 cursor-pointer w-fit" onClick={toggleShowComments}>{comments.length} comments</p>
            <div className="my-2 border-b-2 border-gray-600">
                
            </div>
            <div className="relative flex justify-between">
                <div 
                    className="w-32 p-2 border-2 border-gray-300 bg-white cursor-pointer rounded-md flex items-center justify-center"
                    onClick={toggleWriteComment}
                >
                    <span className="pr-2"><ChatIcon className="h-[24px] w-[24px]" /></span>
                    <span>Comment</span>
                </div>
                {accountType === "teacher" ? edit_del_btn : null}
                {showEditDelMenu ? edit_del_menu : null}
            </div>
            
            <StoryComments story={props.story} comments={comments} getStoryComments={getStoryComments} showComments={showComments} writeComment={writeComment}/>
        </div>
    )
    return (
        <div className="mb-4">
            {story_div}
            {(editMode) ? <EditStoryModal story={props.story} getClassInfo={props.getClassInfo} toggleEditMode={toggleEditMode} /> : null}
        </div>
    )
}

export default Story;