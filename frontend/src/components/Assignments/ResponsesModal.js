import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { XIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";
import axios from "axios";
import Assignee from "./Assignee";

const ResponsesModal = (props) => {

    const token = useSelector((state)=>state.auth.token);

    const [studentList, setStudentList] = useState([]);

    // GET ALL ALLOCATED STUDENTS FUNCTION
    const getAllocatedStudents = useCallback(()=>{
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/assignee-list/' + props.assignment.id + '/';
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setStudentList(res.data);
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token, props.assignment.id])

    // On component mount - get all students allocated the assignment
    useEffect(()=>{
        getAllocatedStudents();
    }, [getAllocatedStudents])

    // Create list of students
    let student_list_div = studentList.map(student=>{
        return <Assignee key={student.id} student={student} assignment={props.assignment} getAllocatedStudents={getAllocatedStudents} />
    })

    let responses_div = (
        <div className="relative w-full sm:w-[500px] h-[600px] overflow-auto p-4 mx-auto mt-2 rounded-md bg-white border-2 border-gray-300">
            <h2>{props.assignment.title}</h2>
            <XIcon 
                className="absolute top-2 right-2 h-[24px] w-[24px] hover:border hover:border-gray-300 cursor-pointer"
                onClick={props.toggleResponsesModal}
            />

            <p className="text-left text-sm font-semibold pl-2 py-1">Select a student to view their assignment response, give a score and provide feedback.</p>
            <div className="w-full flex justify-start">
                <div className="w-28 m-2 flex items-center">
                    <CheckCircleIcon className="h-[24px] w-[24px] stroke-green-600" />
                    <p className="text-xs">Submitted</p>
                </div>
                <div className="w-28 flex items-center">
                    <XCircleIcon className="h-[24px] w-[24px] stroke-red-600" />
                    <p className="text-xs">Not submitted</p>
                </div>
            </div>
            <div className="flex flex-col px-1">
                {student_list_div}
            </div>
        </div>
    )

    return (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-20 w-screen h-screen flex items-center justify-center">
            {responses_div}
        </div>
    )
}

export default ResponsesModal;