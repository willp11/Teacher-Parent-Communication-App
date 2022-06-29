import './Profile.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Navigation from '../Navigation/Navigation';
import { useDispatch } from 'react-redux';
import authSlice from "../../store/slices/auth";

const Profile = () => {

    const dispatch = useDispatch();

    const token = useSelector((state) => state.auth.token);

    const [profile, setProfile] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        email_verified: null,
        parent: null,
        teacher: null
    });

    useEffect(()=>{
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };

        axios.get('http://localhost:8000/api/v1/dj-rest-auth/user/', {headers: headers})
            .then(res=>{
                console.log(res);
                setProfile(res.data);
                dispatch(authSlice.actions.setAccount({account: res.data}));
            })
            .catch(err=>{
                console.log(err);
            })
        
    }, [token, dispatch]);

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
        if (profile.teacher === null && profile.parent === null) {
            select_account_type_div = (
                <div>
                    <h2>Select account type</h2>
                    <div className="select-account-type-div-inner">
                        <div className="select-account-type-btn">Teacher</div>
                        <div className="select-account-type-btn">Parent</div>
                    </div>
                </div>
            )
        } else if (profile.teacher !== null) {
            account_type_div = (
                <div>
                    <h2>Account Type</h2>
                    <p>Teacher</p>
                </div>
            )
        } else if (profile.parent !== null) {
            account_type_div = (
                <div>
                    <h2>Account Type</h2>
                    <p>Parent</p>
                </div>
            )
        }
    }

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
        </div>
    );
}

export default Profile;