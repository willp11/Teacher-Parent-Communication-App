import ProfileImg from '../../Assets/Images/blank-profile.png';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { UploadIcon } from "@heroicons/react/outline";

const UserInfo = (props) => {

    const token = useSelector((state)=>state.auth.token);

    const [profileToUpload, setProfileToUpload] = useState(null);

    const uploadButtonRef = useRef(null);

    const showUploadFile = () => {
        if (uploadButtonRef.current !== null) {
            uploadButtonRef.current.click();
        }
    }

    const confirmUploadProfileHandler = () => {
        console.log(profileToUpload);
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/profile-upload/';
        const data = {
            profile_picture: profileToUpload
        }
        axios.put(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getUserProfile();
            })
            .catch(err=>{
                console.log(err);
            })
            .finally(()=>{
                setProfileToUpload(null);
            })
    }

    let account_type = null;
    if (props.profile.teacher !== null) {
        account_type = "Teacher"
    } else if (props.profile.parent !== null) {
        account_type = "Parent"
    }

    let upload_profile_modal = (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-20 w-screen h-screen flex items-center justify-center">
            <div className="w-calc(100%-2rem) sm:w-[400px] bg-white rounded shadow-md p-4">
                <h2 className="mb-4">Upload File</h2>
                <button onClick={()=>setProfileToUpload(null)} className="rounded bg-red-600 text-white font-semibold hover:bg-red-700 p-2 w-24 mr-2">Cancel</button>
                <button onClick={confirmUploadProfileHandler} className="rounded bg-green-600 text-white font-semibold hover:bg-green-700 p-2 w-24">Confirm</button>
            </div>
        </div>
    )

    let profile_img_src = ProfileImg;
    if (props.profile.profile_picture !== null) {
        profile_img_src = props.profile.profile_picture
    }

    const user_info_div = (
        <div className="rounded-md bg-white shadow-md mt-2 mb-4 p-4 min-h-[250px]">
            <h2 className="pb-2 text-md">User Details</h2>
            <div className="flex flex-row">
                <div className="w-1/2 flex flex-col items-center justify-center">
                    <div className="relative">
                        <UploadIcon className="h-[24px] w-[24px] absolute bottom-0 left-[calc(50%-12px)] cursor-pointer" onClick={showUploadFile}/>
                        <img src={profile_img_src} className="w-[130px] h-[130px] rounded-full cursor-pointer" alt="" onClick={showUploadFile}/>
                    </div>
                    <input type="file" className="hidden" onChange={(e)=>setProfileToUpload(e.currentTarget.files[0])} ref={uploadButtonRef}/>
                </div>
                <div className="text-left w-1/2">
                    <h2 className="text-gray-600 text-sm text-left">Name</h2>
                    <p className="pb-2">{props.profile.first_name} {props.profile.last_name}</p>
                    <h2 className="text-gray-600 text-sm text-left">Email</h2>
                    <p className="pb-2">{props.profile.email}</p>
                    <h2 className="text-gray-600 text-sm text-left">Account Type</h2>
                    <p className="pb-2">{account_type}</p>
                </div>
            </div>

            {profileToUpload !== null ? upload_profile_modal : null}
        </div>
    )

    return user_info_div;
}

export default UserInfo;