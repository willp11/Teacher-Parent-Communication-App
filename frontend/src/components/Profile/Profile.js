import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Navigation from '../Navigation/Navigation';
import { useDispatch } from 'react-redux';
import authSlice from "../../store/slices/auth";
import UserInfo from './UserInfo';
import ChangePassword from './ChangePassword';
import NotificationSettings from './NotificationSettings';
import SchoolInfo from './SchoolInfo';
import ClassesInfo from './ClassesInfo';
import ChildrenInfo from './ChildrenInfo';
import SelectAccountType from './SelectAccountType';
import VerifyEmail from './VerifyEmail';

const teacher_menu_items = ["User Details", "Change Password", "School", "Classes"]
const parent_menu_items = ["User Details", "Change Password", "Notifications", "Children"]

const Profile = () => {

    const dispatch = useDispatch();

    // STATE
    const token = useSelector((state) => state.auth.token);

    const [schoolList, setSchoolList] = useState([]);
    const [profile, setProfile] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        email_verified: null,
        parent: null,
        teacher: null
    });
    const [notificationSettings, setNotificationSettings] = useState(null);

    // menu - which component to show
    const [componentToShow, setComponentToShow] = useState("User Details");

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
                    setNotificationSettings(res.data.parent.settings);
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

    // FUNCTION TO CREATE MENU
    const createMenuDiv = (arr) => {
        let menu_div_items = arr.map(item=>{
            return (
                <span 
                    className={componentToShow === item ? "classMenuSelected": "classMenuUnselected"}
                    onClick={()=>setComponentToShow(item)}
                >
                    {item}
                </span>
            )
        })

        menu_div = (
            <div className="w-full text-center text-center py-2 overflow-y-auto">
                {menu_div_items}
            </div>
        )

        return menu_div;
    }

    // ON COMPONENT MOUNT, GET USER'S PROFILE DATA FROM API, GET LIST OF SCHOOLS
    useEffect(()=>{
        getUserProfile()
        getSchoolList()
    }, [getUserProfile, getSchoolList]);


    // JSX
    let profile_div = null;
    let menu_div = null;
    // USER MUST VERIFY EMAIL TO SEE PROFILE
    if (profile.email_verified === false) {
        profile_div = <VerifyEmail />
    } else if (profile.email_verified === true) {

        // NO ACCOUNT TYPE CHOSEN YET
        if (profile.teacher === null && profile.parent === null) {
            profile_div = (
                <div>
                    <SelectAccountType getUserProfile={getUserProfile} />
                </div>
            )
        } 

        // TEACHER ACCOUNT
        else if (profile.teacher !== null) {

            menu_div = createMenuDiv(teacher_menu_items)

            profile_div = (
                <div>
                    {componentToShow === "User Details" ? <UserInfo profile={profile} /> : null}
                    {componentToShow === "Change Password" ? <ChangePassword /> : null}
                    {componentToShow === "School" ? <SchoolInfo profile={profile} schools={schoolList} getUserProfile={getUserProfile} /> : null}
                    {componentToShow === "Classes" ? <ClassesInfo profile={profile} getUserProfile={getUserProfile} /> : null}
                </div>
            )
        } 

        // PARENT ACCOUNT 
        else if (profile.parent !== null) {

            menu_div = createMenuDiv(parent_menu_items)

            profile_div = (
                <div>
                    {componentToShow === "User Details" ? <UserInfo profile={profile} /> : null}
                    {componentToShow === "Change Password" ? <ChangePassword /> : null}
                    {componentToShow === "Notifications" ? <NotificationSettings profile={profile} settings={notificationSettings} getUserProfile={getUserProfile} /> : null}
                    {componentToShow === "Children" ? <ChildrenInfo profile={profile} /> : null}
                </div>
            )
        }
    }

    return (
        <div className="relative bg-white overflow-auto min-h-screen">
            <Navigation />
            <div className="w-full flex flex-col items-center justify-center p-2">
                <div className="w-full bg-sky-200 text-center py-2 mb-2">
                    <h1>Profile</h1>
                </div>
                {menu_div}
                <div className="w-full sm:w-[600px] bg-white text-center">
                    {profile_div}
                </div>
            </div>
        </div>
    );
}

export default Profile;