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

const Profile = () => {

    const dispatch = useDispatch();

    // STATE
    const token = useSelector((state) => state.auth.token);
    const [selectedAccountType, setSelectedAccountType] = useState(null);
    const [showInviteCodeInput, setShowInviteCodeInput] = useState(false);
    const [showSelectAccountType, setShowSelectAccountType] = useState(true);
    const [loading, setLoading] = useState(false);
    const [changePwordMsg, setChangePwordMsg] = useState("");
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
                let msg = (
                    <div>Password Changed Successfully!</div>
                )
                setChangePwordMsg(msg)
            })
            .catch(err=>{
                console.log(err);
                setChangePwordMsg("There was a problem changing your password!");
                if (err.response.status === 400 && ('new_password2' in err.response.data)) {
                    let err_msg = "<div>";
                    err.response.data.new_password2.forEach((msg)=>{
                        err_msg += msg + "<br/>"
                    });
                    err_msg += "</div>"
                    let err_div = <div dangerouslySetInnerHTML={{__html: err_msg}}></div>
                    setChangePwordMsg(err_div);
                }
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
        <select value={selectedSchool} onChange={e=>setSelectedSchool(e.target.value)}>
            <option value={null}>Select School</option>
            {schoolListDropdownItems}
        </select>
    )
    let selectSchoolDiv = (
        <div>
            <h3>Change School</h3>
            {schoolListDropdown}
            <button onClick={submitSelectSchoolHandler}>Submit</button>
        </div>
    )

    let email_verified_div = null;
    let select_account_type_div = null;
    let account_type_div = null;
    if (profile.email_verified === false) {
        email_verified_div = (
            <div className="modal-dark-bg">
                <div className="email-verified-div">
                    <h2>Email Not Verified</h2>
                    <p>Check your email and click the link to verify your account.</p>
                    <p>Once verified, refresh the page to continue.</p>
                </div>
            </div>
        )
    } else if (profile.email_verified === true) {
        if (profile.teacher === null && profile.parent === null && showSelectAccountType) {
            select_account_type_div = (
                <div className="select-account-type-div">
                    <h2>Select account type</h2>
                    <div className="select-account-type-div-inner">
                        <div 
                            className="select-account-type-btn" 
                            style={selectedAccountType === 'teacher' ? {'backgroundColor': '#72CC50'} : {} }
                            onClick={()=>setSelectedAccountType('teacher')}>Teacher</div>
                        <div 
                            className="select-account-type-btn" 
                            style={selectedAccountType === 'parent' ? {'backgroundColor': '#72CC50'} : {} }
                            onClick={()=>setSelectedAccountType('parent')}>Parent</div>
                    </div>
                    <button className="account-type-submit" onClick={handleSelectAccountType}>Submit</button>
                </div>
            )
        } // TEACHER ACCOUNT
        else if (profile.teacher !== null) {
            // CLASS LIST
            let school_class_list = profile.teacher.school_classes.map((school_class) => {
                return (
                    <div key={school_class.id} className="school-class-list-div">
                        <Link to={"/class/"+school_class.id}><h4>{school_class.name}</h4></Link>
                    </div>
                )
            })

            account_type_div = (
                <div>
                    <h2>Account Type</h2>
                    <p>Teacher</p>
                    <h3>School</h3>
                    <p>{profile.teacher.school === null ? "You do not have a school yet!" : profile.teacher.school.name}</p>
                    {selectSchoolDiv}
                    <h3>My Classes</h3>
                    {school_class_list}
                    <h3>Create Class</h3>
                    <input value={newClassName} onChange={(e)=>setNewClassName(e.target.value)} placeholder="Name"/>
                    <button onClick={createClassHandler}>Create new class</button>
                </div>
            )
        } // PARENT ACCOUNT 
        else if (profile.parent !== null) {
            // CHILDREN LIST 
            let children_list = profile.parent.children.map(child => {
                return (
                    <div key={child.id} className="children-list-div">
                        <h4>{child.name}</h4>
                        <p>{child.school_class.school.name}</p>
                        <p>{child.school_class.name}</p>
                    </div>
                )
            })
            // PARENT SETTINGS
            let parent_settings = (
                <div className="parent-settings-div">
                    <h3>Settings</h3>
                    <h4>Notification Mode</h4>
                    <div className="parent-settings">
                        <button className={profile.parent.settings.notification_mode === "App" ? "selected" : ""}>App</button>
                        <button className={profile.parent.settings.notification_mode === "Email" ? "selected" : ""}>Email</button>
                        <button className={profile.parent.settings.notification_mode === "SMS" ? "selected" : ""}>SMS</button>
                    </div>
                    <h4>Message Received</h4>
                    <div className="parent-settings">
                        <button className={profile.parent.settings.message_received_notification === true ? "selected" : ""}>Yes</button>
                        <button className={profile.parent.settings.message_received_notification === false ? "selected" : ""}>No</button>
                    </div>
                    <h4>New Announcement</h4>
                    <div className="parent-settings">
                        <button className={profile.parent.settings.new_announcement_notification === true ? "selected" : ""}>Yes</button>
                        <button className={profile.parent.settings.new_announcement_notification === false ? "selected" : ""}>No</button>
                    </div>
                    <h4>New Story</h4>
                    <div className="parent-settings">
                        <button className={profile.parent.settings.new_story_notification === true ? "selected" : ""}>Yes</button>
                        <button className={profile.parent.settings.new_story_notification === false ? "selected" : ""}>No</button>
                    </div>
                    <h4>New Event</h4>
                    <div className="parent-settings">
                        <button className={profile.parent.settings.new_event_notification === true ? "selected" : ""}>Yes</button>
                        <button className={profile.parent.settings.new_event_notification === false ? "selected" : ""}>No</button>
                    </div>
                    <button className="parent-settings-edit-btn" onClick={()=>setEditSettingsMode(true)}>Edit Settings</button>
                </div>
            )
            if (editSettingsMode) {
                parent_settings = (
                    <div className="parent-settings-div">
                        <h3>Settings</h3>
                        <h4>Notification Mode</h4>
                        <div className="parent-settings-edit-mode">
                            <button 
                                onClick={()=>editParentSettingsHandler("notification_mode", "App")}
                                className={editedParentSettings.notification_mode === "App" ? "selected" : ""}>App</button>
                            <button 
                                onClick={()=>editParentSettingsHandler("notification_mode", "Email")}    
                                className={editedParentSettings.notification_mode === "Email" ? "selected" : ""}>Email</button>
                            <button 
                                onClick={()=>editParentSettingsHandler("notification_mode", "SMS")}
                                className={editedParentSettings.notification_mode === "SMS" ? "selected" : ""}>SMS</button>
                        </div>
                        <h4>Message Received</h4>
                        <div className="parent-settings-edit-mode">
                            <button 
                                onClick={()=>editParentSettingsHandler("message_received_notification", true)}
                                className={editedParentSettings.message_received_notification === true ? "selected" : ""}>Yes</button>
                            <button 
                                onClick={()=>editParentSettingsHandler("message_received_notification", false)}
                                className={editedParentSettings.message_received_notification === false ? "selected" : ""}>No</button>
                        </div>
                        <h4>New Announcement</h4>
                        <div className="parent-settings-edit-mode">
                            <button 
                                onClick={()=>editParentSettingsHandler("new_announcement_notification", true)}
                                className={editedParentSettings.new_announcement_notification === true ? "selected" : ""}>Yes</button>
                            <button 
                                onClick={()=>editParentSettingsHandler("new_announcement_notification", false)}
                                className={editedParentSettings.new_announcement_notification === false ? "selected" : ""}>No</button>
                        </div>
                        <h4>New Story</h4>
                        <div className="parent-settings-edit-mode">
                            <button 
                                onClick={()=>editParentSettingsHandler("new_story_notification", true)}
                                className={editedParentSettings.new_story_notification === true ? "selected" : ""}>Yes</button>
                            <button 
                                onClick={()=>editParentSettingsHandler("new_story_notification", false)}
                                className={editedParentSettings.new_story_notification === false ? "selected" : ""}>No</button>
                        </div>
                        <h4>New Event</h4>
                        <div className="parent-settings-edit-mode">
                            <button 
                                onClick={()=>editParentSettingsHandler("new_event_notification", true)}
                                className={editedParentSettings.new_event_notification === true ? "selected" : ""}>Yes</button>
                            <button 
                                onClick={()=>editParentSettingsHandler("new_event_notification", false)}
                                className={editedParentSettings.new_event_notification === false ? "selected" : ""}>No</button>
                        </div>
                        <button className="parent-settings-edit-btn" onClick={cancelEditParentSettings}>Cancel</button>
                        <button className="parent-settings-edit-btn" onClick={submitEditParentSettings}>Submit</button>
                    </div>
                );
            }
            account_type_div = (
                <div>
                    <h2>Account Type</h2>
                    <p>Parent</p>
                    {parent_settings}
                    <h3>My Children</h3>
                    {children_list}
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
    let change_password_div = (
        <div>
            <h2>Change Password</h2>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="RegisterInput"
                    /> <br/>
                    {formik.errors.password ? <div className="RegisterWarning">{formik.errors.password} </div> : null}

                    <input
                        id="passwordConfirmation"
                        type="password"
                        placeholder="Password Confirmation"
                        name="passwordConfirmation"
                        value={formik.values.passwordConfirmation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="RegisterInput"
                    />
                    {formik.errors.passwordConfirmation ? <div className="RegisterWarning">{formik.errors.passwordConfirmation} </div> : null}
                </div>
                <div className="RegisterBtn">
                    <button type="submit" disabled={loading}>Submit</button>
                </div>
                {changePwordMsg}
            </form>
        </div>
    )

    return (
        <div className="Profile">
            <Navigation />
            <h1>Profile</h1>
            <h2>Name</h2>
            <p>{profile.first_name} {profile.last_name}</p>
            <h2>Email</h2>
            <p>{profile.email}</p>
            {email_verified_div}
            {select_account_type_div}
            {account_type_div}
            {inviteCodeInputDiv}
            {change_password_div}
        </div>
    );
}

export default Profile;