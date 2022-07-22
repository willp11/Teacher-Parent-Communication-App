import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const NotificationSettings = (props) => {

    const token = useSelector((state)=>state.auth.token);

    const [editSettingsMode, setEditSettingsMode] = useState(false);
    const [editedParentSettings, setEditedParentSettings] = useState(null);
    
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
        setEditedParentSettings(props.profile.parent.settings);
        setEditSettingsMode(false);
    }

    // Submit edit parents request
    const submitEditParentSettings = () => {
        console.log("submitting edit parent settings")
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };
        axios.put('http://localhost:8000/api/v1/school/parent-settings-update/', editedParentSettings, {headers: headers})
            .then(res => {
                console.log(res);
                props.getUserProfile();
                setEditSettingsMode(false);
            })
            .catch(err => {
                console.log(err);
            })
    }

    // EDIT MODE OFF
    let notification_settings = (
        <div className="rounded-md shadow-md bg-white mt-2 mb-4 p-2 pb-4">
            <h2 className="py-2 text-md text-gray-600">Notification Settings</h2>
            <p className="mb-2 text-sm">How would you like to receive notifications?</p>
            <div>
                <button disabled className={props.profile.parent.settings.notification_mode === "App" ? "selected" : "unselected"}>App</button>
                <button disabled className={props.profile.parent.settings.notification_mode === "Email" ? "selected" : "unselected"}>Email</button>
                <button disabled className={props.profile.parent.settings.notification_mode === "SMS" ? "selected" : "unselected"}>SMS</button>
            </div>

            <p className="mt-4 mb-2 text-sm">When would you like to receive notifications?</p>
            <div>
                <h4 className="text-gray-700 text-sm">New Message</h4>
                <button disabled className={props.profile.parent.settings.message_received_notification === true ? "selected" : "unselected"}>Yes</button>
                <button disabled className={props.profile.parent.settings.message_received_notification === false ? "selected" : "unselected"}>No</button>
            </div>
            
            <div>
                <h4 className="text-gray-700 text-sm">New Announcement</h4>
                <button disabled className={props.profile.parent.settings.new_announcement_notification === true ? "selected" : "unselected"}>Yes</button>
                <button disabled className={props.profile.parent.settings.new_announcement_notification === false ? "selected" : "unselected"}>No</button>
            </div>
            
            <div>
                <h4 className="text-gray-700 text-sm">New Story</h4>
                <button disabled className={props.profile.parent.settings.new_story_notification === true ? "selected" : "unselected"}>Yes</button>
                <button disabled className={props.profile.parent.settings.new_story_notification === false ? "selected" : "unselected"}>No</button>
            </div>
            
            <div className="mb-4">
                <h4 className="text-gray-700 text-sm" >New Event</h4>
                <button disabled className={props.profile.parent.settings.new_event_notification === true ? "selected" : "unselected"}>Yes</button>
                <button disabled className={props.profile.parent.settings.new_event_notification === false ? "selected" : "unselected"}>No</button>
            </div>
            <button className="w-32 rounded-full bg-sky-500 hover:bg-indigo-500 px-2 py-2 text-white font-bold m-2 border-2 border-black" onClick={()=>setEditSettingsMode(true)}>Edit Settings</button>
        </div>
    )

    // EDIT MODE ON
    if (editSettingsMode) {
        notification_settings = (
            <div className="rounded-md shadow-md bg-sky-50 mt-2 mb-4 p-4">
                <h2 className="py-2 text-md">Notification Settings</h2>
                <p className="mb-2 text-sm">How would you like to receive notifications?</p>
                <div>
                    <button 
                        onClick={()=>editParentSettingsHandler("notification_mode", "App")}
                        className={editedParentSettings.notification_mode === "App" ? "selected" : "unselected"}>App</button>
                    <button 
                        onClick={()=>editParentSettingsHandler("notification_mode", "Email")}    
                        className={editedParentSettings.notification_mode === "Email" ? "selected" : "unselected"}>Email</button>
                    <button 
                        onClick={()=>editParentSettingsHandler("notification_mode", "SMS")}
                        className={editedParentSettings.notification_mode === "SMS" ? "selected" : "unselected"}>SMS</button>
                </div>
                <p className="mt-4 mb-2 text-sm">When would you like to receive notifications?</p>
                <div>
                    <h4 className="text-gray-700 text-sm">New Message</h4>
                    <button 
                        onClick={()=>editParentSettingsHandler("message_received_notification", true)}
                        className={editedParentSettings.message_received_notification === true ? "selected" : "unselected"}>Yes</button>
                    <button 
                        onClick={()=>editParentSettingsHandler("message_received_notification", false)}
                        className={editedParentSettings.message_received_notification === false ? "selected" : "unselected"}>No</button>
                </div>
                
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
                <button className="w-24 rounded-full bg-red-600 hover:bg-red-700 py-2 text-white font-bold m-2 border-2 border-black" onClick={cancelEditParentSettings}>Cancel</button>
                <button className="w-24 rounded-full bg-sky-500 hover:bg-indigo-500 py-2 text-white font-bold m-2 border-2 border-black" onClick={submitEditParentSettings}>Submit</button>
            </div>
        );
    }

    return notification_settings;
}

export default NotificationSettings;