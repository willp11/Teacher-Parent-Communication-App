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
        pk: null,
        username: "",
        email: "",
        email_verified: null
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

    return (
        <div className="Profile">
            <Navigation />
            <h1>Profile</h1>
            <h2>ID</h2>
            <p>{profile.pk}</p>
            <h2>Username</h2>
            <p>{profile.username}</p>
            <h2>Email</h2>
            <p>{profile.email}</p>
            <h2>Email Verified</h2>
            <p>{profile.email_verified ? "True": "False"}</p>
        </div>
    );
}

export default Profile;