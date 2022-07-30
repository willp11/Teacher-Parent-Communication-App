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

    if (studentProfile) {
        // Parent info
        let parent_info = null;
        if (studentProfile.parent !== null) {
            parent_info = (
                <div className="my-2">
                    <p className="text-xs text-gray-600">Parent</p>
                    <p className="font-semibold">{studentProfile.parent.user.first_name} {studentProfile.parent.user.last_name}</p>
                    <button className="bg-sky-500 hover:bg-indigo-500 rounded text-white font-semibold px-2 py-1 mt-1 text-sm">Message</button>
                </div>
            )
        } else {
            parent_info = (
                <div>
                    <div className="my-2">
                        <p className="text-xs text-gray-600">Parent</p>
                        <p className="font-semibold">{studentProfile.name}'s parent has not made an account yet!</p>
                    </div>
                    <div className="my-2">
                        <p className="text-xs text-gray-600">Invite Code</p>
                        <p className="font-semibold">{studentProfile.invite_code.code}</p>
                    </div>
                </div>
            )
        }

        // Stickers
        let stickers = (
            <div className="my-2">
                <p className="text-xs text-gray-600">Stickers</p>
                <div className="flex">
                    <div className="flex flex-col justify-center items-center">
                        <h3>{studentStickers.star}</h3>
                        <div className="bg-white rounded-full p-0.5">
                            <img src={starImg} className="h-[40px] w-[40px] rounded-full" alt="star" />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center ml-2">
                        <h3>{studentStickers.dinosaur}</h3>
                        <div className="bg-white rounded-full p-0.5">
                            <img src={dinosaurImg} className="h-[40px] w-[40px] rounded-full" alt="dinosaur" />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center ml-2">
                        <h3>{studentStickers.cat}</h3>
                        <div className="bg-white rounded-full p-0.5">
                            <img src={catImg} className="h-[40px] w-[40px] rounded-full" alt="cat" />
                        </div>
                    </div>
                </div>
            </div>
        )

        // School class info div
        let student_info_div = (
            <div className="w-full sm:w-96 mx-auto bg-sky-100 rounded shadow border border-gray-300 p-2 my-2 text-left">
                <div className="my-2">
                    <p className="text-xs text-gray-600">Class</p>
                    <Link to={`/class/${studentProfile.school_class.id}`}><p className="font-semibold text-left text-blue-700 underline">{studentProfile.school_class.name}</p></Link>
                </div>
                <div className="my-2">
                    <p className="text-xs text-gray-600">Teacher</p>
                    <p className="font-semibold">{studentProfile.school_class.teacher.user.first_name} {studentProfile.school_class.teacher.user.last_name}</p>
                </div>
                <div className="my-2">
                    <p className="text-xs text-gray-600">School</p>
                    <p className="font-semibold">{studentProfile.school_class.school.name}. {studentProfile.school_class.school.city}, {studentProfile.school_class.school.country}.</p>
                </div>
                {parent_info}
                {stickers}
            </div>
        )

        // Assignments div
        // let assignments = studentProfile.portfolio.map((assignment)=>{
        //     return (
        //         <div className="w-full sm:w-[300px] mx-auto border border-gray-300" key={assignment.assignment.id}>
        //             <h3 className="pb-2">{assignment.assignment.title}</h3>
        //             <p className="p-2 text-sm text-left">{assignment.assignment.description}</p>
        //             <p className="text-sm pt-2"><b>Score: </b>{assignment.score === null ? "--" : assignment.score} / {assignment.assignment.maximum_score}</p>
        //             <p className="text-sm pb-2"><b>Feedback: </b>{assignment.feedback === null ? "No feedback yet." : assignment.feedback}</p>
        //         </div>
        //     );
        // })

        let assignments_div = (
            <div className="p-2">
                <h2 className="text-left">Portfolio</h2>
                {/* {assignments} */}
            </div>
        )

        student_profile_div = (
            <div className="w-full sm:w-[600px] md:w-[750px] rounded-md border border-gray-300 shadow-sm bg-white p-2 text-center">
                <h1 className="mb-2">{studentProfile.name}</h1>
                {student_info_div}
                {assignments_div}
            </div>
        )
    } 

    if (forbidden) {
        student_profile_div = (
            <div className="w-full sm:w-[600px] md rounded-md border border-gray-300 shadow-sm bg-white p-2 text-center">
                <h2>Forbidden</h2>
                <p className="m-2">You must be the student's parent or teacher to access their profile page.</p>
            </div>
        )
    }

    return (
        <div className="relative bg-slate-100 overflow-auto min-h-screen">
            <Navigation />
            <div className="w-full flex flex-col items-center justify-start pb-2 overflow-auto">
                <h1 className="w-full bg-indigo-500 text-white drop-shadow-lg py-2 mb-2">Portfolio</h1>
                {student_profile_div}
            </div>
        </div>
    )
}

export default StudentProfile;

