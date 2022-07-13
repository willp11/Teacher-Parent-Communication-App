import './Profile.css';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Navigation from '../Navigation/Navigation';
import { useDispatch } from 'react-redux';
import authSlice from "../../store/slices/auth";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import {extractErrors} from '../../Utils/utils';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // STATE
    const token = useSelector((state) => state.auth.token);
    const [selectedAccountType, setSelectedAccountType] = useState(null);
    const [showInviteCodeInput, setShowInviteCodeInput] = useState(false);
    const [showSelectAccountType, setShowSelectAccountType] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [inviteCode, setInviteCode] = useState("");
    const [schoolList, setSchoolList] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState("");
    const [editSettingsMode, setEditSettingsMode] = useState(false);
    const [editedParentSettings, setEditedParentSettings] = useState(null);
    const [newClassName, setNewClassName] = useState("");
    const [profile, setProfile] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        email_verified: null,
        parent: null,
        teacher: null
    });

    // GET USER PROFILE REQUEST
    const getUserProfile = useCallback(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };

        axios.get('http://localhost:8000/api/v1/dj-rest-auth/user/', {headers: headers})
            .then(res=>{
                setProfile(res.data);
                dispatch(authSlice.actions.setAccount({account: res.data}));
                if (res.data.parent !== null) {
                    setEditedParentSettings(res.data.parent.settings);
                }
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token, dispatch]);

    // GET SCHOOLS LIST REQUEST
    const getSchoolList = useCallback(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };

        axios.get('http://localhost:8000/api/v1/school/school-list-create/', {headers: headers})
            .then(res=>{
                setSchoolList(res.data);
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token])

    // BUTTON AND INPUT HANDLER FUNCTIONS
    const handleShowInviteCodeInput = () => {
        setShowInviteCodeInput(true);
        setShowSelectAccountType(false);
    }

    // CREATE PARENT - SUBMIT INVITE CODE
    const handleSubmitInviteCode = (invite_code) => {
        setShowInviteCodeInput(false);
        
        // send POST request to create parent account
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };
        const data = {
            invite_code
        }
        axios.post('http://localhost:8000/api/v1/school/parent-create/', data, {headers: headers})
            .then(res=>{
                console.log(res);
                if (res.status === 201) {
                    getUserProfile()
                    console.log("Created parent account")
                }
            })
            .catch(err=>{
                console.log(err);
            })
    }

    const handleSubmitCreateTeacher = () => {
        // send POST request to create teacher account
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };
        const data = {
            school: null
        }
        axios.post('http://localhost:8000/api/v1/school/teacher-create/', data, {headers: headers})
            .then(res=>{
                console.log(res);
                if (res.status === 201) {
                    getUserProfile()
                }
            })
            .catch(err=>{
                console.log(err);
            })
    }

    const createClassHandler = () => {
        // send POST request to create a new class
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };
        const data = {
            name: newClassName
        }
        axios.post('http://localhost:8000/api/v1/school/class-create/', data, {headers: headers})
            .then(res=>{
                console.log(res);
                if (res.status === 201) {
                    getUserProfile()
                }
            })
            .catch(err=>{
                console.log(err);
            })
    }

    const handleSelectAccountType = () => {
        if (selectedAccountType === 'parent') {
            handleShowInviteCodeInput()
        } else if (selectedAccountType === 'teacher') {
            handleSubmitCreateTeacher()
        }
    }

    const handleSendPwordReset = (new_password1, new_password2) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };
        const data = {
            new_password1, 
            new_password2
        };

        setLoading(true);

        axios.post('http://localhost:8000/api/v1/dj-rest-auth/password/change/', data, {headers: headers})
            .then(res=>{
                console.log(res);
                setErrors(["Password changed successfully."])
            })
            .catch(err=>{
                console.log(err);
                setErrors(extractErrors(err));
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    const submitSelectSchoolHandler = () => {
        if (selectedSchool !== "" && profile.teacher !== null) {
            // Send POST request to change teacher's school
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            };
            const data = {
                school: selectedSchool,
            };
            axios.put('http://localhost:8000/api/v1/school/teacher-school-update/', data, {headers: headers})
                .then(res => {
                    console.log(res);
                    getUserProfile();
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    // LOGOUT BUTTON - WHEN VERIFYING EMAIL
    const handleLogout = () => {
        dispatch(authSlice.actions.logout());
        navigate('/login');
    }

    // PARENT SETTINGS HANDLERS
    const editParentSettingsHandler = (setting, value) => {
        let settings = {...editedParentSettings};
        settings[setting] = value;
        setEditedParentSettings(settings);
    }
    const cancelEditParentSettings = () => {
        setEditedParentSettings(profile.parent.settings);
        setEditSettingsMode(false);
    }
    const submitEditParentSettings = () => {
        console.log("submitting edit parent settings")
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };
        axios.put('http://localhost:8000/api/v1/school/parent-settings-update/', editedParentSettings, {headers: headers})
            .then(res => {
                console.log(res);
                getUserProfile();
                setEditSettingsMode(false);
            })
            .catch(err => {
                console.log(err);
            })
    }

    // ON COMPONENT MOUNT, GET USER'S PROFILE DATA FROM API, GET LIST OF SCHOOLS
    useEffect(()=>{
        getUserProfile()
        getSchoolList()
    }, [getUserProfile, getSchoolList]);

    // CHOOSE ACCOUNT TYPE AND VERIFY EMAIL DIVS
    let inviteCodeInputDiv = null;
    if (showInviteCodeInput) {
        inviteCodeInputDiv = (
            <div className="invite-code-input-div">
                <h2>Invite Code</h2>
                <input placeholder="Invite Code" onChange={(e)=>setInviteCode(e.target.value)}/>
                <button onClick={()=>handleSubmitInviteCode(inviteCode)}>Submit</button>
            </div>
        )
    }

    // SCHOOL LIST DROPDOWN (TEACHER ACCOUNT ONLY)
    let schoolListDropdownItems = schoolList.map((school)=>{
        return (
            <option key={school.id} value={school.id}>{school.name}</option>
        );
    })
    let schoolListDropdown = (
        <select className="border border-gray-300 cursor-pointer mr-2" value={selectedSchool} onChange={e=>setSelectedSchool(e.target.value)}>
            <option value={null}>Select School</option>
            {schoolListDropdownItems}
        </select>
    )
    let selectSchoolDiv = (
        <div className="pb-2">
            <h4 className="pb-1">Change School</h4>
            {schoolListDropdown}
            <button className="border-px shadow-md shadow-gray-500 rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-2 text-white font-bold" onClick={submitSelectSchoolHandler}>Submit</button>
        </div>
    )

    let email_verified_div = null;
    let select_account_type_div = null;
    let account_type_div = null;
    let account_type_info = null;
    if (profile.email_verified === false) {
        email_verified_div = (
            <div className="fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.9)] flex items-center justify-center">
                <div className="w-full sm:w-[600px] border border-gray-500 shadow-md mb-2 bg-white">
                    <h2 className="pt-4 pb-2">Email Not Verified</h2>
                    <p>Check your email and click the link to verify your account.</p>
                    <p className="pb-4">Once verified, refresh the page to continue.</p>
                    <button className="border-px shadow-md shadow-gray-500 rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-2 text-white font-bold" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        )
    } else if (profile.email_verified === true) {
        if (profile.teacher === null && profile.parent === null && showSelectAccountType) {
            select_account_type_div = (
                <div className="border border-gray-500 shadow-md mb-2 bg-white">
                    <h2>Select Account Type</h2>
                    <div className="flex items-center justify-center m-2">
                        <div 
                            className={selectedAccountType === 'teacher' ? "selected" : "unselected cursor-pointer hover:bg-sky-100"}
                            onClick={()=>setSelectedAccountType('teacher')}>Teacher</div>
                        <div 
                            className={selectedAccountType === 'parent' ? "selected" : "unselected cursor-pointer hover:bg-sky-100"}
                            onClick={()=>setSelectedAccountType('parent')}>Parent</div>
                    </div>
                    <button className="w-32 border-px shadow-md shadow-gray-500 rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-2 text-white font-bold" onClick={handleSelectAccountType}>Submit</button>
                </div>
            )
        } // TEACHER ACCOUNT
        else if (profile.teacher !== null) {
            // CLASS LIST
            let school_class_list = profile.teacher.school_classes.map((school_class) => {
                return (
                    <div key={school_class.id} className="p-2 border border-gray-300 w-64 m-auto shadow-md bg-sky-50 hover:bg-sky-100 font-bold">
                        <Link to={"/class/"+school_class.id}><h4>{school_class.name}</h4></Link>
                    </div>
                )
            })

            account_type_info = (
                <div>
                    <h2>Account Type</h2>
                    <p className="pb-2">Teacher</p>
                </div>
            )

            account_type_div = (
                <div>
                    <div className="rounded-md shadow-md shadow-gray-500 bg-sky-200 mt-2 mb-4 p-2">
                        <h2>School</h2>
                        <p className="pb-2">{profile.teacher.school === null ? "You do not have a school yet!" : profile.teacher.school.name}</p>
                        {selectSchoolDiv}
                    </div>
                    <div className="rounded-md shadow-md shadow-gray-500 bg-sky-200 mt-2 mb-4 p-2 pb-4">
                        <h2 className="pb-1">Classes</h2>
                        {school_class_list}
                        <h4 className="pt-2">Create Class</h4>
                        <input className="p-2 border border-gray-300 w-48 sm:w-64 mr-2" value={newClassName} onChange={(e)=>setNewClassName(e.target.value)} placeholder="Type class name..."/>
                        <button className="border-px shadow-md shadow-gray-500 rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-2 text-white font-bold" onClick={createClassHandler}>Create</button>
                    </div>   
                </div>
            )
        } // PARENT ACCOUNT 
        else if (profile.parent !== null) {
            // CHILDREN LIST 
            let children_list = profile.parent.children.map(child => {
                return (
                    <div key={child.id} className="border border-gray-500 rounded-md shadow-md w-64 mx-auto my-2 bg-sky-50">
                        <Link to={"/studentProfile/"+child.id}><h4 className="text-blue-700 underline">{child.name}</h4></Link>
                        <p>{child.school_class.school.name}</p>
                        <p>{child.school_class.name}</p>
                    </div>
                )
            })
            // PARENT SETTINGS
            let parent_settings = (
                <div className="rounded-md shadow-md shadow-gray-500 bg-sky-200 mt-2 mb-4 p-2 pb-4">
                    <h2 className="pb-2">Settings</h2>
                    <h4>Notification Mode</h4>
                    <div className="parent-settings">
                        <button className={profile.parent.settings.notification_mode === "App" ? "selected" : "unselected"}>App</button>
                        <button className={profile.parent.settings.notification_mode === "Email" ? "selected" : "unselected"}>Email</button>
                        <button className={profile.parent.settings.notification_mode === "SMS" ? "selected" : "unselected"}>SMS</button>
                    </div>
                    <h4>Message Received</h4>
                    <div className="parent-settings">
                        <button className={profile.parent.settings.message_received_notification === true ? "selected" : "unselected"}>Yes</button>
                        <button className={profile.parent.settings.message_received_notification === false ? "selected" : "unselected"}>No</button>
                    </div>
                    <h4>New Announcement</h4>
                    <div className="parent-settings">
                        <button className={profile.parent.settings.new_announcement_notification === true ? "selected" : "unselected"}>Yes</button>
                        <button className={profile.parent.settings.new_announcement_notification === false ? "selected" : "unselected"}>No</button>
                    </div>
                    <h4>New Story</h4>
                    <div className="parent-settings">
                        <button className={profile.parent.settings.new_story_notification === true ? "selected" : "unselected"}>Yes</button>
                        <button className={profile.parent.settings.new_story_notification === false ? "selected" : "unselected"}>No</button>
                    </div>
                    <h4>New Event</h4>
                    <div className="parent-settings">
                        <button className={profile.parent.settings.new_event_notification === true ? "selected" : "unselected"}>Yes</button>
                        <button className={profile.parent.settings.new_event_notification === false ? "selected" : "unselected"}>No</button>
                    </div>
                    <button className="w-32 rounded-full bg-sky-500 hover:bg-indigo-500 px-2 py-2 text-white font-bold m-2 border-px shadow-md shadow-gray-500" onClick={()=>setEditSettingsMode(true)}>Edit Settings</button>
                </div>
            )
            if (editSettingsMode) {
                parent_settings = (
                    <div className="rounded-md shadow-md shadow-gray-500 bg-sky-200 mt-2 mb-4 p-2 pb-4">
                        <h2 className="pb-2">Settings</h2>
                        <h4>Notification Mode</h4>
                        <div className="parent-settings-edit-mode">
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
                        <h4>Message Received</h4>
                        <div className="parent-settings-edit-mode">
                            <button 
                                onClick={()=>editParentSettingsHandler("message_received_notification", true)}
                                className={editedParentSettings.message_received_notification === true ? "selected" : "unselected"}>Yes</button>
                            <button 
                                onClick={()=>editParentSettingsHandler("message_received_notification", false)}
                                className={editedParentSettings.message_received_notification === false ? "selected" : "unselected"}>No</button>
                        </div>
                        <h4>New Announcement</h4>
                        <div className="parent-settings-edit-mode">
                            <button 
                                onClick={()=>editParentSettingsHandler("new_announcement_notification", true)}
                                className={editedParentSettings.new_announcement_notification === true ? "selected" : "unselected"}>Yes</button>
                            <button 
                                onClick={()=>editParentSettingsHandler("new_announcement_notification", false)}
                                className={editedParentSettings.new_announcement_notification === false ? "selected" : "unselected"}>No</button>
                        </div>
                        <h4>New Story</h4>
                        <div className="parent-settings-edit-mode">
                            <button 
                                onClick={()=>editParentSettingsHandler("new_story_notification", true)}
                                className={editedParentSettings.new_story_notification === true ? "selected" : "unselected"}>Yes</button>
                            <button 
                                onClick={()=>editParentSettingsHandler("new_story_notification", false)}
                                className={editedParentSettings.new_story_notification === false ? "selected" : "unselected"}>No</button>
                        </div>
                        <h4>New Event</h4>
                        <div className="parent-settings-edit-mode">
                            <button 
                                onClick={()=>editParentSettingsHandler("new_event_notification", true)}
                                className={editedParentSettings.new_event_notification === true ? "selected" : "unselected"}>Yes</button>
                            <button 
                                onClick={()=>editParentSettingsHandler("new_event_notification", false)}
                                className={editedParentSettings.new_event_notification === false ? "selected" : "unselected"}>No</button>
                        </div>
                        <button className="w-24 rounded-full bg-red-600 hover:bg-red-700 py-2 text-white font-bold m-2 border-px shadow-md shadow-gray-500" onClick={cancelEditParentSettings}>Cancel</button>
                        <button className="w-24 rounded-full bg-sky-500 hover:bg-indigo-500 py-2 text-white font-bold m-2 border-px shadow-md shadow-gray-500" onClick={submitEditParentSettings}>Submit</button>
                    </div>
                );
            }

            account_type_info = (
                <div>
                    <h2>Account Type</h2>
                    <p className="pb-2">Teacher</p>
                </div>
            )

            account_type_div = (
                <div>
                    {parent_settings}
                    <div className="rounded-md shadow-md shadow-gray-500 bg-sky-200 mt-2 mb-4 p-2">
                        <h2 className="pb-2">Children</h2>
                        {children_list}
                    </div>
                </div>
            )
        }
    }

    // CHANGE PASSWORD
    const formik = useFormik({
        initialValues: {
            password: "",
            passwordConfirmation: ""
        },
        onSubmit: (values) =>  {
            handleSendPwordReset(values.password, values.passwordConfirmation);
        },
        validationSchema: Yup.object({
            password: Yup.string().trim().required("password is required"),
            passwordConfirmation: Yup.string().required("password confirmation is required").oneOf([Yup.ref('password'), null], 'Passwords must match')
        })
    });

    // CHANGE PASSWORD ERRORS
    let errors_div = errors.map(err=>{
        return (
            <div className="text-sm pl-2 py-1 font-bold w-full text-center">{err}</div>
        )
    })

    let change_password_div = (
        <div className="rounded-md shadow-md shadow-gray-500 bg-sky-200 mt-2 mb-4 p-2 pb-4">
            <h2 className="mb-4">Change Password</h2>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <input
                        id="password"
                        type="password"
                        placeholder="Type new password..."
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="p-2 border border-gray-300"
                    /> <br/>
                    {formik.errors.password ? <div className="text-sm pl-2 py-1">{formik.errors.password} </div> : null}

                    <input
                        id="passwordConfirmation"
                        type="password"
                        placeholder="Repeat password..."
                        name="passwordConfirmation"
                        value={formik.values.passwordConfirmation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="p-2 border border-gray-300"
                    />
                    {formik.errors.passwordConfirmation ? <div className="text-sm pl-2 py-1">{formik.errors.passwordConfirmation} </div> : null}
                </div>
                <div className="RegisterBtn">
                    <button className="w-32 border-px shadow-md shadow-gray-500 rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-2 text-white font-bold" type="submit" disabled={loading}>Submit</button>
                </div>
            </form>
            {errors_div}
        </div>
    )

    return (
        <div className="relative bg-white overflow-hidden min-h-screen">
            <div className="max-w-7xl mx-auto">
                <Navigation />
                <div className="w-full p-2 flex items-center justify-center md:px-4 lg:px-8">
                    <div className="w-full sm:w-[600px] bg-white text-center">
                        <h1 className="pb-4">Profile</h1>
                        <div className="rounded-md shadow-md shadow-gray-500 bg-sky-200 mt-2 mb-4 p-2">
                            <h2>Name</h2>
                            <p className="pb-2">{profile.first_name} {profile.last_name}</p>
                            <h2>Email</h2>
                            <p className="pb-2">{profile.email}</p>
                            {account_type_info}
                        </div>
                        
                        {email_verified_div}
                        {select_account_type_div}
                        {account_type_div}
                        {inviteCodeInputDiv}
                        {change_password_div}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;