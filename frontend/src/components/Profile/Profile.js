import './Profile.css';
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

    // ON COMPONENT MOUNT, GET USER'S PROFILE DATA FROM API, GET LIST OF SCHOOLS
    useEffect(()=>{
        getUserProfile()
        getSchoolList()
    }, [getUserProfile, getSchoolList]);


    // JSX
    let profile_div = null;
    // USER MUST VERIFY EMAIL TO SEE PROFILE
    if (profile.email_verified === false) {
        profile_div = <VerifyEmail />
    } else if (profile.email_verified === true) {

        // NO ACCOUNT TYPE CHOSEN YET
        if (profile.teacher === null && profile.parent === null) {
            profile_div = (
                <div>
                    <h1 className="mb-4">Profile</h1>
                    <SelectAccountType getUserProfile={getUserProfile} />
                </div>
            )
        } 

        // TEACHER ACCOUNT
        else if (profile.teacher !== null) {
            profile_div = (
                <div>
                    <h1>Profile</h1>
                    <UserInfo profile={profile} />
                    <ChangePassword />
                    <SchoolInfo profile={profile} schools={schoolList} getUserProfile={getUserProfile} />
                    <ClassesInfo profile={profile} getUserProfile={getUserProfile} />
                </div>
            )
        } 

        // PARENT ACCOUNT 
        else if (profile.parent !== null) {
            profile_div = (
                <div>
                    <h1>Profile</h1>
                    <UserInfo profile={profile} />
                    <ChangePassword />
                    <NotificationSettings profile={profile} settings={notificationSettings} getUserProfile={getUserProfile} />
                    <ChildrenInfo profile={profile} />
                </div>
            )
        }
    }

    return (
        <div className="relative bg-white overflow-hidden min-h-screen">
            <div className="max-w-7xl mx-auto">
                <Navigation />
                <div className="w-full flex items-center justify-center p-2">
                    <div className="w-full sm:w-[600px] bg-sky-100 text-center rounded-md p-2 md:p-4 lg:p-8">
                        {profile_div}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;