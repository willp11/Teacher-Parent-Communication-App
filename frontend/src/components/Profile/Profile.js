import './Profile.css';
import { useCallback, useEffect, useState, Fragment } from 'react';
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
import ProfileImg from '../../Assets/Images/blank-profile.png';
import { Popover, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

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
            <div className="bg-sky-50 rounded-md shadow-md p-4">
                <h2 className="pb-2">Invite Code</h2>
                <input 
                    placeholder="Type invite code..." 
                    onChange={(e)=>setInviteCode(e.target.value)}
                    className="p-2 border border-gray-300 h-10"
                />
                <button 
                    onClick={()=>handleSubmitInviteCode(inviteCode)}
                    className="rounded-full border-2 border-black bg-sky-500 hover:bg-indigo-500 px-4 py-2 text-white text-sm font-bold ml-2"
                >
                    Submit
                </button>
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
            {schoolListDropdown}
            <button className="border-2 border-black rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-2 text-white text-sm font-bold" onClick={submitSelectSchoolHandler}>Submit</button>
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
                    <button className="border-2 border-black rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-2 text-white font-bold" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        )
    } else if (profile.email_verified === true) {
        if (profile.teacher === null && profile.parent === null && showSelectAccountType) {
            select_account_type_div = (
                <div className="shadow-md mb-2 bg-sky-50 p-2">
                    <h2>Select Account Type</h2>
                    <div className="flex items-center justify-center m-2">
                        <div 
                            className={selectedAccountType === 'teacher' ? "selected" : "unselected cursor-pointer hover:bg-indigo-100"}
                            onClick={()=>setSelectedAccountType('teacher')}>Teacher</div>
                        <div 
                            className={selectedAccountType === 'parent' ? "selected" : "unselected cursor-pointer hover:bg-indigo-100"}
                            onClick={()=>setSelectedAccountType('parent')}>Parent</div>
                    </div>
                    <button className="w-32 border-p2 border-black rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-2 text-white font-bold" onClick={handleSelectAccountType}>Submit</button>
                </div>
            )
        } // TEACHER ACCOUNT
        else if (profile.teacher !== null) {
            // CLASS LIST
            let school_class_list = profile.teacher.school_classes.map((school_class) => {
                return (
                    <div key={school_class.id} className="p-2 border border-gray-300 w-64 m-auto shadow-lg bg-white hover:bg-sky-100 font-bold">
                        <Link to={"/class/"+school_class.id}><h4 className="text-sm">{school_class.name}</h4></Link>
                    </div>
                )
            })

            account_type_info = (
                <div>
                    <h2 className="text-gray-600 text-sm text-left">Account Type</h2>
                    <p className="pb-2">Teacher</p>
                </div>
            )

            account_type_div = (
                <div>
                    <div className="rounded-md shadow-md bg-sky-50 mt-2 mb-4 p-2">
                        <h2 className="text-gray-600 text-sm">School</h2>
                        <p className="pb-2">{profile.teacher.school === null ? "You do not have a school yet!" : profile.teacher.school.name}</p>
                        {selectSchoolDiv}
                    </div>
                    <div className="rounded-md bg-sky-50 shadow-md mt-2 mb-4 p-2 pb-4">
                        <h2 className="pb-1 text-gray-600 text-sm">Classes</h2>
                        <div className="mb-4">
                            <input 
                                className="p-2 border border-gray-300 w-48 sm:w-64 mr-2 h-10" 
                                value={newClassName} 
                                onChange={(e)=>setNewClassName(e.target.value)} 
                                placeholder="Type class name..."
                            />
                            <button 
                                className="rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-2 text-white font-bold border-2 border-black text-sm" 
                                onClick={createClassHandler}
                            >
                                Create
                            </button>
                        </div>
                        
                        {school_class_list}
                    </div>
                </div>
            )
        } // PARENT ACCOUNT 
        else if (profile.parent !== null) {
            // CHILDREN LIST 
            let children_list = profile.parent.children.map(child => {
                return (
                    <div key={child.id} className="border border-gray-500 rounded-md shadow-md w-64 mx-auto my-2 bg-white">
                        <Link to={"/studentProfile/"+child.id}><h4 className="text-blue-700 underline">{child.name}</h4></Link>
                        <p>{child.school_class.school.name}</p>
                        <p>{child.school_class.name}</p>
                    </div>
                )
            })
            // PARENT SETTINGS
            let parent_settings = (
                <div className="rounded-md shadow-md bg-sky-50 mt-2 mb-4 p-2 pb-4">
                    <h2 className="py-2">Notification Settings</h2>
                    <p className="mb-2 text-sm">How would you like to receive notifications?</p>
                    <div>
                        <button disabled className={profile.parent.settings.notification_mode === "App" ? "selected" : "unselected"}>App</button>
                        <button disabled className={profile.parent.settings.notification_mode === "Email" ? "selected" : "unselected"}>Email</button>
                        <button disabled className={profile.parent.settings.notification_mode === "SMS" ? "selected" : "unselected"}>SMS</button>
                    </div>

                    <p className="mt-4 mb-2 text-sm">When would you like to receive notifications?</p>
                    <div>
                        <h4 className="text-gray-700 text-sm">New Message</h4>
                        <button disabled className={profile.parent.settings.message_received_notification === true ? "selected" : "unselected"}>Yes</button>
                        <button disabled className={profile.parent.settings.message_received_notification === false ? "selected" : "unselected"}>No</button>
                    </div>
                    
                    <div>
                        <h4 className="text-gray-700 text-sm">New Announcement</h4>
                        <button disabled className={profile.parent.settings.new_announcement_notification === true ? "selected" : "unselected"}>Yes</button>
                        <button disabled className={profile.parent.settings.new_announcement_notification === false ? "selected" : "unselected"}>No</button>
                    </div>
                    
                    <div>
                        <h4 className="text-gray-700 text-sm">New Story</h4>
                        <button disabled className={profile.parent.settings.new_story_notification === true ? "selected" : "unselected"}>Yes</button>
                        <button disabled className={profile.parent.settings.new_story_notification === false ? "selected" : "unselected"}>No</button>
                    </div>
                    
                    <div className="mb-4">
                        <h4 className="text-gray-700 text-sm" >New Event</h4>
                        <button disabled className={profile.parent.settings.new_event_notification === true ? "selected" : "unselected"}>Yes</button>
                        <button disabled className={profile.parent.settings.new_event_notification === false ? "selected" : "unselected"}>No</button>
                    </div>
                    <button className="w-32 rounded-full bg-sky-500 hover:bg-indigo-500 px-2 py-2 text-white font-bold m-2 border-2 border-black" onClick={()=>setEditSettingsMode(true)}>Edit Settings</button>
                </div>
            )
            if (editSettingsMode) {
                parent_settings = (
                    <div className="rounded-md shadow-md bg-sky-50 mt-2 mb-4 p-2 pb-4">
                        <h2 className="py-2">Notification Settings</h2>
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

            account_type_info = (
                <div>
                    <h2 className="text-gray-600 text-sm text-left">Account Type</h2>
                    <p className="pb-2">Teacher</p>
                </div>
            )

            account_type_div = (
                <div>
                    {parent_settings}
                    <div className="rounded-md shadow-md bg-sky-50 mt-2 mb-4 p-2">
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
            password: Yup.string().trim().required("Password is required"),
            passwordConfirmation: Yup.string().required("Password confirmation is required").oneOf([Yup.ref('password'), null], 'Passwords must match')
        })
    });

    // CHANGE PASSWORD ERRORS
    let errors_div = errors.map(err=>{
        return (
            <div className="text-sm pl-2 py-1 font-bold w-full text-center">{err}</div>
        )
    })

    let change_password_div = (
        <div className="w-[calc(100%-1rem)] sm:w-[600px] min-h-[350px] rounded-md shadow-md bg-sky-100 mt-2 mb-4 mx-auto p-2 pb-4 border border-gray-600">
            <Popover.Button 
                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 border border-gray-600 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
                <span className="sr-only">Close Change Password</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
            <h2 className="my-4">Change Password</h2>
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
                        className="p-2 border border-gray-300 h-10"
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
                        className="p-2 border border-gray-300 h-10"
                    />
                    {formik.errors.passwordConfirmation ? <div className="text-sm pl-2 py-1">{formik.errors.passwordConfirmation} </div> : null}
                </div>
                <div>
                    <button className="w-32 shadow-md rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-2 text-white font-bold border-2 border-black mt-4" type="submit" disabled={loading}>Submit</button>
                </div>
            </form>
            {errors_div}
        </div>
    )

    return (
        <div className="relative bg-white overflow-hidden min-h-screen">
            <div className="max-w-7xl mx-auto">
                <Navigation />
                <div className="w-full flex items-center justify-center p-2">
                    <div className="w-full sm:w-[600px] bg-sky-100 text-center rounded-md p-2 md:p-4 lg:p-8">
                        <h1 className="">Profile</h1>
                        <div className="rounded-md bg-sky-50 shadow-md mt-2 mb-4 p-4">
                            <div className="flex flex-row">
                                <div className="w-1/2 flex items-center justify-center">
                                    <img src={ProfileImg} className="w-[130px] h-[130px] rounded-full" />
                                </div>
                                <div className="text-left w-1/2">
                                    <h2 className="text-gray-600 text-sm text-left">Name</h2>
                                    <p className="pb-2">{profile.first_name} {profile.last_name}</p>
                                    <h2 className="text-gray-600 text-sm text-left">Email</h2>
                                    <p className="pb-2">{profile.email}</p>
                                    {account_type_info}
                                </div>
                            </div>
                            <Popover>
                                <Popover.Button 
                                    className="rounded-full bg-sky-500 hover:bg-indigo-500 text-white text-sm font-bold border-2 border-black p-2 m-2"
                                >
                                    Change Password
                                </Popover.Button>
                                <Transition
                                    as={Fragment}
                                    enter="duration-150 ease-out"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="duration-100 ease-in"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Popover.Panel
                                        focus
                                        className="absolute z-10 top-[80px] inset-x-0 transition transform origin-top-right"    
                                    >
                                        {change_password_div}
                                    </Popover.Panel>
                                </Transition>
                            </Popover>
                        </div>
                        {email_verified_div}
                        {select_account_type_div}
                        {account_type_div}
                        {inviteCodeInputDiv}
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;