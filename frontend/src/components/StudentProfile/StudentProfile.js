import './StudentProfile.css';
import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
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
    const [forbidden, setForbidden] = useState(false);

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
                if (err.response.status === 403) setForbidden(true);
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
    if (forbidden) {
        student_profile_div = (
            <div className="w-full sm:w-[600px] rounded-md border border-gray-300 shadow-sm bg-sky-200 text-center">
                <h1>Forbidden</h1>
                <p className="m-2">You must be the student's parent or teacher to access their profile page.</p>
            </div>
        )
    }
    if (studentProfile) {
        // Parent info div
        let parent_info = null;
        if (studentProfile.parent !== null) {
            parent_info = (
                <div>
                    <p className="my-2">{studentProfile.parent.user.first_name} {studentProfile.parent.user.last_name}</p>
                    <button className="bg-sky-500 hover:bg-indigo-500 rounded-full text-white font-bold px-4 py-2 mb-2 border-2 border-black">Send Message</button>
                </div>
            )
        } else {
            parent_info = (
                <div>
                    <p className="my-2">{studentProfile.name}'s parent has not made an account yet!</p>
                    <p className="mb-2"><b>Invite Code: </b>{studentProfile.invite_code.code}</p>
                </div>
            )
        }
        
        let parent_info_div = (
            <div className="bg-white rounded shadow p-2 my-2">
                <h2>Parent</h2>
                {parent_info}
            </div>
        )

        // School class info div
        let class_info_div = (
            <div className="bg-white rounded shadow p-2 my-2">
                <Link to={`/class/${studentProfile.school_class.id}`}><h2 className="text-blue-700 underline">{studentProfile.school_class.name}</h2></Link>
                <p className="my-2"><b>Teacher: </b>{studentProfile.school_class.teacher.user.first_name} {studentProfile.school_class.teacher.user.last_name}</p>
                <p className="mb-2"><b>School: </b>{studentProfile.school_class.school.name}. {studentProfile.school_class.school.city}, {studentProfile.school_class.school.country}.</p>
            </div>
        )

        // Assignments div
        let assignments = studentProfile.portfolio.map((assignment)=>{
            return (
                <div className="w-full sm:w-[300px] mx-auto border border-gray-300" key={assignment.assignment.id}>
                    <h3 className="pb-2">{assignment.assignment.title}</h3>
                    <p className="p-2 text-sm text-left">{assignment.assignment.description}</p>
                    <p className="text-sm pt-2"><b>Score: </b>{assignment.score === null ? "--" : assignment.score} / {assignment.assignment.maximum_score}</p>
                    <p className="text-sm pb-2"><b>Feedback: </b>{assignment.feedback === null ? "No feedback yet." : assignment.feedback}</p>
                </div>
            );
        })

        let assignments_div = (
            <div className="bg-white rounded shadow px-2 py-4 my-2">
                <h2 className="pb-2">Assignments</h2>
                {assignments}
            </div>
        )
        
        // Stickers div
        let stickers = (
            <div>
                <div className="flex justify-center items-center mx-auto my-2">
                    <h3 className="mx-2">{studentStickers.star}</h3>
                    <img src={starImg} className="h-[50px] w-[50px]" alt="star" />
                </div>
                <div className="flex justify-center items-center mx-auto my-2">
                    <h3 className="mx-2">{studentStickers.dinosaur}</h3>
                    <img src={dinosaurImg} className="h-[50px] w-[50px]" alt="dinosaur" />
                </div>
                <div className="flex justify-center items-center mx-auto my-2">
                    <h3 className="mx-2">{studentStickers.cat}</h3>
                    <img src={catImg} className="h-[50px] w-[50px]" alt="cat" />
                </div>
            </div>
        )
        let stickers_div = (
            <div className="block bg-white rounded shadow-md px-2 py-4 my-2">
                <h2>Stickers</h2>
                {studentProfile.stickers.length === 0 ? "No stickers." : stickers}
            </div>
        )

        student_profile_div = (
            <div className="w-full sm:w-[600px] rounded-md border border-gray-300 shadow-sm bg-sky-200 text-center">
                <h1 className="mb-2">{studentProfile.name}</h1>
                {class_info_div}
                {parent_info_div}
                {assignments_div}
                {stickers_div}
            </div>
        )
    } 

    return (
        <div className="relative bg-white overflow-hidden min-h-screen">
            <Navigation />
            <div className="w-full p-2 flex items-center justify-center md:px-4 lg:px-8">
                {student_profile_div}
            </div>
        </div>
    )
}

export default StudentProfile;

