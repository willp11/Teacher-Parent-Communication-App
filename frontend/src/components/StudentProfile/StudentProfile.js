import './StudentProfile.css';
import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navigation from "../Navigation/Navigation";
import axios from "axios";
import starImg from '../../Assets/Images/star-sticker.jpg';
import dinosaurImg from '../../Assets/Images/dinosaur-sticker.jpg';
import catImg from '../../Assets/Images/cat-sticker.jpg';

const StudentProfile = () => {

    const { id } = useParams();
    const token = useSelector((state)=>state.auth.token);
    const [studentProfile, setStudentProfile] = useState(null);
    const [studentStickers, setStudentStickers] = useState({
        star: 0,
        dinosaur: 0,
        cat: 0
    });

    // GET STUDENT'S PROFILE DATA FUNCTION
    const getStudentData = useCallback(()=>{
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/student-portfolio-list/' + id + '/';
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setStudentProfile(res.data);

                // count the student's stickers of each type
                let stickers = {
                    star: 0,
                    dinosaur: 0,
                    cat: 0
                };
                res.data.stickers.forEach(sticker=>{
                    if (sticker.type === 1) {
                        stickers.star += 1;
                    } else if (sticker.type === 2) {
                        stickers.dinosaur += 1;
                    } else if (sticker.type === 3) {
                        stickers.cat += 1;
                    }
                })
                setStudentStickers(stickers);
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token, id]);

    // ON COMPONENT MOUNT - GET STUDENT'S PROFILE
    useEffect(()=>{
        getStudentData()
    }, [getStudentData])

    // JSX
    let student_profile_div = (
        <p>Loading...</p>
    )
    if (studentProfile) {
        // Parent info div
        let no_parent_account_div = (
            <div>
                <p>{studentProfile.name}'s parent has not made an account yet!</p>
                <p><b>Invite Code: </b>{studentProfile.invite_code.code}</p>
            </div>
        )
        let has_parent_account_div = (
            <div>
                <p><b>Parent: </b></p>
                <p>Send message</p>
            </div>
        )
        let parent_info_div = (
            <div className="student-profile-parent-div">
                <h2>Parent</h2>
                {studentProfile.parent === null ? no_parent_account_div : has_parent_account_div}
            </div>
        )

        // School class info div
        let class_info_div = (
            <div className="student-profile-class-div">
                <h2>{studentProfile.school_class.name}</h2>
                <p><b>Teacher: </b>{studentProfile.school_class.teacher.user.first_name} {studentProfile.school_class.teacher.user.last_name}</p>
                <p><b>School: </b>{studentProfile.school_class.school.name}. {studentProfile.school_class.school.city}, {studentProfile.school_class.school.country}.</p>
            </div>
        )

        // Assignments div
        let assignments = studentProfile.portfolio.map((assignment)=>{
            return (
                <div className="student-profile-assignment">
                    <h2>{assignment.assignment.title}</h2>
                    <p>{assignment.assignment.description}</p>
                    <p><b>Score: </b>{assignment.score === null ? "--" : assignment.score} / {assignment.assignment.maximum_score}</p>
                    <p><b>Feedback: </b>{assignment.feedback === null ? "No feedback yet." : assignment.feedback}</p>
                </div>
            );
        })

        let assignments_div = (
            <div className="student-profile-assignments-div">
                <h2>Assignments</h2>
                {assignments}
            </div>
        )
        
        // Stickers div
        let stickers = (
            <div>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <h3>{studentStickers.star}</h3>
                    <img src={starImg} style={{height: "50px", width: "50px"}} alt="star" />
                </div>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <h3>{studentStickers.dinosaur}</h3>
                    <img src={dinosaurImg} style={{height: "50px", width: "50px"}} alt="dinosaur" />
                </div>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <h3>{studentStickers.cat}</h3>
                    <img src={catImg} style={{height: "50px", width: "50px"}} alt="cat" />
                </div>
            </div>
        )
        let stickers_div = (
            <div className="student-profile-stickers-div">
                <h2>Stickers</h2>
                {studentProfile.stickers.length === 0 ? "No stickers." : stickers}
            </div>
        )

        student_profile_div = (
            <div className="student-profile-div">
                <h1>{studentProfile.name}</h1>
                {class_info_div}
                {parent_info_div}
                {assignments_div}
                {stickers_div}
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

