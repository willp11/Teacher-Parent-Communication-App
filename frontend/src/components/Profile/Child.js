import { Link } from "react-router-dom";
import { useState, useRef } from 'react';
import ProfileImg from '../../Assets/Images/blank-profile.png';
import Spinner from "../Spinner/Spinner";
import { UploadIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useSelector } from "react-redux";

const Child = (props) => {

    const token = useSelector(state=>state.auth.token);
    const [imageToUpload, setImageToUpload] = useState(null);
    const [loading, setLoading] = useState(false);

    const uploadButtonRef = useRef(null);

    // Upload image request handler
    const confirmUploadImageHandler = () => {
        console.log(imageToUpload);
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Token ' + token
        }
        const url = `${process.env.API_URL}/api/v1/school/student-image-upload/${props.child.id}/`;
        const data = {
            image: imageToUpload
        }
        setLoading(true);
        axios.put(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getUserProfile();
            })
            .catch(err=>{
                console.log(err);
            })
            .finally(()=>{
                setImageToUpload(null);
                setLoading(false);
            })
    }

    // Show upload modal handler
    const showUploadFile = () => {
        if (uploadButtonRef.current !== null) {
            uploadButtonRef.current.click();
        }
    }

    // Upload image confirmation modal
    let upload_profile_modal = (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-20 w-screen h-screen flex items-center justify-center">
            <div className="w-calc(100%-2rem) sm:w-[400px] bg-white rounded shadow-md p-4">
                <h2 className="mb-4">Upload File</h2>
                <button onClick={()=>setImageToUpload(null)} className="rounded bg-red-600 text-white font-semibold hover:bg-red-700 p-2 w-24 mr-2">Cancel</button>
                <button onClick={confirmUploadImageHandler} className="rounded bg-green-600 text-white font-semibold hover:bg-green-700 p-2 w-24">Confirm</button>
            </div>
        </div>
    )

    // Image source
    let profile_img_src = ProfileImg;
    if (props.child.image !== null) {
        profile_img_src = props.child.image
    }

    // Loading message
    let upload_loading = null;
    if (loading) {
        upload_loading = (
            <div className="w-full flex justify-center items-center mt-1">
                <p className="text-sm pr-2">Uploading image</p>
                <Spinner />
            </div>
        )
    }

    let school_info = null;
    if (props.child.school_class.school !== null) {
        school_info = <p>{props.child.school_class.school.name}</p>
    }

    return (
        <div key={props.child.id} className="border border-gray-300 rounded-md shadow-md w-64 mx-auto my-4 p-2 bg-sky-100">
            <Link to={"/studentProfile/"+props.child.id}><h4 className="text-blue-700 underline">{props.child.name}</h4></Link>
            {school_info}
            <p>{props.child.school_class.name}</p>

            <div className="relative">
                <UploadIcon className="h-[24px] w-[24px] absolute bottom-0 left-[calc(50%-12px)] cursor-pointer" onClick={showUploadFile}/>
                <img src={profile_img_src} className="h-[100px] w-[100px] mx-auto rounded-full mb-2" alt="" onClick={showUploadFile}/>
            </div>
            <input type="file" className="hidden" onChange={(e)=>setImageToUpload(e.currentTarget.files[0])} ref={uploadButtonRef}/>
            {upload_loading}

            {imageToUpload !== null ? upload_profile_modal : null}
        </div>
    )
}

export default Child;