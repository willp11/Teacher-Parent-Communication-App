import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import StoryComments from "./StoryComments";
import { ChatIcon, DotsHorizontalIcon, UploadIcon, XIcon } from "@heroicons/react/outline";
import EditStoryModal from "./EditStoryModal";

const Story = (props) => {

    const token = useSelector((state) => state.auth.token);
    const accountType = useSelector((state) => state.auth.accountType);

    // Image modal
    const [imageToShow, setImageToShow] = useState(null);

    // Image upload
    const [imageToUpload, setImageToUpload] = useState(null);

    const uploadButtonRef = useRef(null);

    const showUploadFile = () => {
        if (uploadButtonRef.current !== null) {
            uploadButtonRef.current.click();
        }
    }

    const confirmUploadImageHandler = () => {
        console.log(imageToUpload);
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/story-media-create/';
        const data = {
            image: imageToUpload,
            story: props.story.id
        }
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
            })
            .catch(err=>{
                console.log(err);
            })
            .finally(()=>{
                setImageToUpload(null);
            })
    }

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

    // upload file confirm modal
    let upload_image_modal = (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-20 w-screen h-screen flex items-center justify-center">
            <div className="w-calc(100%-2rem) sm:w-[400px] bg-white rounded shadow-md p-4 text-center">
                <h2 className="mb-4">Upload File</h2>
                <button onClick={()=>setImageToUpload(null)} className="rounded bg-red-600 text-white font-semibold hover:bg-red-700 p-2 w-24 mr-2">Cancel</button>
                <button onClick={confirmUploadImageHandler} className="rounded bg-green-600 text-white font-semibold hover:bg-green-700 p-2 w-24">Confirm</button>
            </div>
        </div>
    )

    // story images
    let story_images = props.story.story_images.map((img)=>{
        return (
            <img key={img.id} src={img.image} alt="" className="h-[50px] cursor-pointer mr-1" onClick={()=>setImageToShow(img)}/>
        )
    })

    // image modal - on click show large image
    let image_modal = null; 
    if (imageToShow !== null) {
        image_modal = (
            <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-20 w-screen h-screen flex items-center justify-center">
                <div className="relative w-calc(100%-2rem) sm:w-[400px] bg-white rounded shadow-md p-8 text-center">
                    <XIcon 
                        className="absolute top-2 right-2 h-[24px] w-[24px] hover:border hover:border-gray-300 cursor-pointer"
                        onClick={()=>setImageToShow(null)}
                    />
                    <img src={imageToShow.image} alt="" className="max-h-[500px] max-w-full"/>
                </div>
            </div>
        )
    }

    // Main story div
    let story_div = (
        <div className="w-full sm:w-[500px] p-4 mx-auto bg-sky-200 rounded-md shadow-md shadow-gray-300 border-2 border-gray-300">
            <div className="bg-white p-2 rounded-md">
                <div className="flex justify-between items-center pb-2">
                    <h3 className="text-left">{props.story.title}</h3>
                    <p className="text-sm">{new Date(props.story.date).toLocaleDateString()}</p>
                </div>
                <p className="pb-2">{props.story.content}</p>
                <div className="flex flex-wrap">
                    {story_images}
                </div>
            </div>
            <div className="flex justify-between items-center pt-2">
                <p className="text-gray-600 text-sm font-semibold pl-2 cursor-pointer w-fit" onClick={toggleShowComments}>{comments.length} comments</p>
                {accountType === "teacher" ? <UploadIcon className="h-[24px] w-[24px] cursor-pointer mr-2" onClick={showUploadFile}/> : null}
                <input type="file" className="hidden" onChange={(e)=>setImageToUpload(e.currentTarget.files[0])} ref={uploadButtonRef}/>
            </div>
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
            {imageToUpload !== null ? upload_image_modal : null}
            {image_modal}
        </div>
    )
}

export default Story;