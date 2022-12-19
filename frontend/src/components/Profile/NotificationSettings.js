import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Spinner from "../Spinner/Spinner";
import {useMessage} from '../../Hooks/useMessage';
import { BellIcon } from "@heroicons/react/outline";

const NotificationSettings = (props) => {

    const token = useSelector((state)=>state.auth.token);
    const accountType = useSelector((state)=>state.auth.accountType);

    const [editSettingsMode, setEditSettingsMode] = useState(false);
    const [editedParentSettings, setEditedParentSettings] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useMessage();
    
    useEffect(()=>{
        setEditedParentSettings(props.settings);
    }, [props.settings])

    // Update settings state
    const editParentSettingsHandler = (setting, value) => {
        let settings = {...editedParentSettings};
        settings[setting] = value;
        setEditedParentSettings(settings);
    }

    // Cancel updating settings
    const cancelEditParentSettings = () => {
        setEditedParentSettings(props.profile.settings);
        setEditSettingsMode(false);
    }

    // Submit edit parents request
    const submitEditParentSettings = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };
        setLoading(true);
        axios.put(`${process.env.API_URL}/api/v1/school/settings-update/`, editedParentSettings, {headers: headers})
            .then(res => {
                console.log(res);
                props.getUserProfile();
                setEditSettingsMode(false);
                setMessage("Settings updated successfully.")
            })
            .catch(err => {
                console.log(err);
                setMessage("There was a problem updating settings.")
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    // EDIT MODE OFF
    let notification_settings = (
        <div className="rounded-md shadow-md bg-white mt-2 mb-4 p-2 pb-4">
            <h2 className="py-2 text-md">Notification Settings</h2>
            <div className="flex justify-center items-center">
                <p className="text-sm">All users receive App notifications. Press </p>
                <BellIcon className='h-6 w-6' />
                <p className="text-sm"> at top to view.</p>
            </div>
            
            <p className="mt-2 mb-4 text-sm">When would you like to receive <b>E-mails</b>?</p>
            <div>
                <h4 className="text-gray-700 text-sm">New Message</h4>
                <button disabled className={props.profile.settings.message_received_notification === true ? "selected" : "unselected"}>Yes</button>
                <button disabled className={props.profile.settings.message_received_notification === false ? "selected" : "unselected"}>No</button>
            </div>
            
            {(accountType === 'parent')
                && <>
                    <div>
                        <h4 className="text-gray-700 text-sm">New Announcement</h4>
                        <button disabled className={props.profile.settings.new_announcement_notification === true ? "selected" : "unselected"}>Yes</button>
                        <button disabled className={props.profile.settings.new_announcement_notification === false ? "selected" : "unselected"}>No</button>
                    </div>
                    
                    <div>
                        <h4 className="text-gray-700 text-sm">New Story</h4>
                        <button disabled className={props.profile.settings.new_story_notification === true ? "selected" : "unselected"}>Yes</button>
                        <button disabled className={props.profile.settings.new_story_notification === false ? "selected" : "unselected"}>No</button>
                    </div>
                    
                    <div className="mb-4">
                        <h4 className="text-gray-700 text-sm" >New Event</h4>
                        <button disabled className={props.profile.settings.new_event_notification === true ? "selected" : "unselected"}>Yes</button>
                        <button disabled className={props.profile.settings.new_event_notification === false ? "selected" : "unselected"}>No</button>
                    </div>
                </>
            }
            
            <button className="w-32 rounded bg-sky-500 hover:bg-indigo-500 px-2 py-2 text-white font-semibold my-4" onClick={()=>setEditSettingsMode(true)}>Edit Settings</button>
            <p className="text-sm">{message}</p>
        </div>
    )

    // SUBMIT BTN
    let submit_btn = (
        <button className="w-24 rounded bg-sky-500 hover:bg-indigo-500 py-2 text-white font-semibold m-2" onClick={submitEditParentSettings} disabled={false}>Submit</button>
    )
    if (loading) {
        submit_btn = (
            <button className="w-32 rounded bg-sky-500 hover:bg-indigo-500 p-2 text-white font-semibold m-2 flex justify-center mx-auto" type="submit" disabled={true}>
                <Spinner />
                Loading
            </button>
        )
    }

    // EDIT MODE ON
    if (editSettingsMode) {
        notification_settings = (
            <div className="rounded-md shadow-md bg-white mt-2 mb-4 p-2 pb-4">
                <h2 className="py-2 text-md">Notification Settings</h2>
                <div className="flex justify-center items-center">
                    <p className="text-sm">All users receive App notifications. Press </p>
                    <BellIcon className='h-6 w-6' />
                    <p className="text-sm"> at top to view.</p>
                </div>
                
                <p className="mt-2 mb-4 text-sm">When would you like to receive <b>E-mails</b>?</p>
                <div>
                    <h4 className="text-gray-700 text-sm">New Message</h4>
                    <button 
                        onClick={()=>editParentSettingsHandler("message_received_notification", true)}
                        className={editedParentSettings?.message_received_notification === true ? "selected" : "unselected"}>Yes</button>
                    <button 
                        onClick={()=>editParentSettingsHandler("message_received_notification", false)}
                        className={editedParentSettings?.message_received_notification === false ? "selected" : "unselected"}>No</button>
                </div>
                
                {(accountType === 'parent')
                    && 
                    <>
                        <div>
                            <h4 className="text-gray-700 text-sm">New Announcement</h4>
                            <button 
                                onClick={()=>editParentSettingsHandler("new_announcement_notification", true)}
                                className={editedParentSettings.new_announcement_notification === true ? "selected" : "unselected"}>Yes</button>
                            <button 
                                onClick={()=>editParentSettingsHandler("new_announcement_notification", false)}
                                className={editedParentSettings.new_announcement_notification === false ? "selected" : "unselected"}>No</button>
                        </div>
                        
                        <div>
                            <h4 className="text-gray-700 text-sm">New Story</h4>
                            <button 
                                onClick={()=>editParentSettingsHandler("new_story_notification", true)}
                                className={editedParentSettings.new_story_notification === true ? "selected" : "unselected"}>Yes</button>
                            <button 
                                onClick={()=>editParentSettingsHandler("new_story_notification", false)}
                                className={editedParentSettings.new_story_notification === false ? "selected" : "unselected"}>No</button>
                        </div>
                        
                        <div className="mb-4">
                            <h4 className="text-gray-700 text-sm">New Event</h4>
                            <button 
                                onClick={()=>editParentSettingsHandler("new_event_notification", true)}
                                className={editedParentSettings.new_event_notification === true ? "selected" : "unselected"}>Yes</button>
                            <button 
                                onClick={()=>editParentSettingsHandler("new_event_notification", false)}
                                className={editedParentSettings.new_event_notification === false ? "selected" : "unselected"}>No</button>
                        </div>
                    </>
                }
                {loading ? null : <button className="w-24 rounded bg-red-600 hover:bg-red-700 py-2 text-white font-semibold my-4" onClick={cancelEditParentSettings}>Cancel</button>}
                {submit_btn}
                <p className="text-sm">{message}</p>
            </div>
        );
    }

    return notification_settings;
}

export default NotificationSettings;