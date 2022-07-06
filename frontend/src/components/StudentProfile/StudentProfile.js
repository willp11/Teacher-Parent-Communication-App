import './StudentProfile.css';
import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navigation from "../Navigation/Navigation";
import axios from "axios";

const StudentProfile = () => {

    const { id } = useParams();
    const token = useSelector((state)=>state.auth.token);
    const [studentProfile, setStudentProfile] = useState(null);

    // GET STUDENT'S PROFILE DATA FUNCTION
    const getStudentData = useCallback(()=>{
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/student-detail/' + id + '/';
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setStudentProfile(res.data);
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token, id]);

    // ON COMPONENT MOUNT - GET STUDENT'S PROFILE

    let student_profile_div = (
        <p>Loading...</p>
    )
    if (studentProfile) {
        student_profile_div = (
            <div className="student-profile-div">
                <h1>{studentProfile.name}</h1>
            </div>
        )
    } 

    return (
        <div>
            <Navigation />
            {student_profile_div}
        </div>
    )
}

export default StudentProfile;

