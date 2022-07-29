import Navigation from "../Navigation/Navigation";
import { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";

const SubmitAssignment = () => {

    const {code} = useParams()
    const token = useSelector((state)=>state.auth.token);

    const [assignment, setAssignment] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    const getAssignment = useCallback(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = `http://127.0.0.1:8000/api/v1/school/assignment-detail/${code}/`
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setAssignment(res.data);
            })
            .catch(err=>{
                console.log(err);
            })
            .finally(()=>{
                setLoading(false);
            })
    }, [token, code])

    // On component mount - get all data about the assignment
    useEffect(()=>{
        getAssignment();
    }, [getAssignment])

    // Student List
    let student_list_div = null;
    if (assignment !== null) {
        student_list_div = assignment.assigned_students.map(assignee=>{
            let style = "p-1 my-1 w-full border-2 border-gray-200 bg-sky-100 cursor-pointer hover:bg-indigo-500 hover:text-white rounded-md";
            if (selectedStudent !== null) {
                if (selectedStudent.id === assignee.id) style = "p-1 my-1 w-full border-2 border-gray-200 bg-sky-500 text-white rounded-md"
            }
            return (
                <div
                    key={assignee.id}
                    className={style}
                    onClick={()=>setSelectedStudent(assignee)}
                >
                    <h4 className="text-base text-left font-semibold truncate">{assignee.student.name}</h4>
                </div>
            )
        })
    }

    // Assignment Input
    let assignment_input = null;
    if (assignment !== null) {
        if (assignment.response_format === "Text") {
            assignment_input = (
                <div>
                    <textarea 
                        rows="12"
                        placeholder="Type your answer..."
                        className="border border-gray-300 w-full mt-2 p-1"
                    />
                    <button className="rounded w-24 p-2 bg-sky-500 text-white font-semibold hover:bg-indigo-500">Submit</button>
                </div>
            )
        } else if (assignment.response_format === "Image") {
            assignment_input = (
                <input type="file" />
            )
        } else if (assignment.response_format === "Video") {
            assignment_input = (
                <input type="file" />
            )
        }
    }

    if (loading) {
        return (
            <div className="relative bg-slate-100 overflow-auto min-h-screen">
                <Navigation />
                <div className="w-full bg-indigo-500 text-center py-2">
                    <h1 className="text-white">Submit Assignment</h1>
                </div>
                <p className="text-center">Loading...</p>
            </div>
        )
    } else {
        return (
            <div className="relative bg-slate-100 overflow-auto min-h-screen">
                <Navigation />
                <div className="w-full bg-indigo-500 text-center py-2">
                    <h1 className="text-white">Submit Assignment</h1>
                </div>
                <div className="flex flex-col sm:flex-row w-[calc(100%-1rem)] md:w-[750px] lg:w-[800px] h-[750px] max-h-screen overflow-auto mx-auto my-4 bg-white rounded-md shadow-md border-2 border-gray-300">
                    <div className="w-full sm:w-[250px] h-[300px] sm:h-full border-b-2 sm:border-r-2 border-gray-300 overflow-auto">
                        <div className="border-b-2 border-gray-300 p-1">
                            <h2 className="text-left p-1">Students</h2>
                        </div>
                        <div className="p-1">
                            <p className="text-sm">Select your name from the list.</p>
                            {student_list_div}
                        </div>
                    </div>
                    <div className="w-full sm:w-[calc(100%-250px)] h-[calc(100%-300px)] sm:h-full">
                        <div className="border-b-2 border-gray-300 p-1">
                            <h2 className="text-left p-1">Assignment</h2>
                        </div>
                        <div className="p-1">
                            <div className="my-2">
                                <p className="text-xs text-gray-600">Title</p>
                                <h3 className="text-left">{assignment.title}</h3>
                            </div>
                            <div className="my-2">
                                <p className="text-xs text-gray-600">Description</p>
                                <p className="font-semibold">{assignment.description}</p>
                            </div>
                            <div className="my-2">
                                <p className="text-xs text-gray-600">Response format</p>
                                <p className="font-semibold">{assignment.response_format}</p>
                            </div>
                        </div>
                        <div className="min-h-[400px] p-1 m-1">
                            {selectedStudent ? <h3 className="text-left">{selectedStudent.student.name}'s Assignment</h3> : <p>Select a student to get started...</p>}
                            {assignment_input}
                        </div>
                    </div>
                </div>
            </div>
        );   
    }
}

export default SubmitAssignment;