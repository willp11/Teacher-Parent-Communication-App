import Navigation from "../Navigation/Navigation";
import { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useMessage } from "../../Hooks/useMessage";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";

const SubmitAssignment = () => {

    const {code} = useParams()
    const token = useSelector((state)=>state.auth.token);

    const [message, setMessage] = useMessage();

    const [assignment, setAssignment] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    const [imageResponse, setImageResponse] = useState(null);
    const [videoResponse, setVideoResponse] = useState(null);
    const [textResponse, setTextResponse] = useState("");

    const getAssignment = useCallback(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/assignment-detail/${code}/`
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

    // submit assignment handler
    const submitAssignment = () => {
        if (selectedStudent !== null) {
            const headers = {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Token ' + token
            }
            const url = `${process.env.REACT_APP_API_URL}/api/v1/school/assignment-response-create/`;
            const data = {
                assignee: selectedStudent.id,
                text: textResponse,
                image: imageResponse,
                video: videoResponse
            }
            axios.post(url, data, {headers: headers})
                .then(res=>{
                    console.log(res);
                    setMessage("Assignment uploaded successfully")
                    getAssignment()
                    setSelectedStudent({...selectedStudent, submitted: true})
                })
                .catch(err=>{
                    console.log(err);
                    setMessage("There was a problem uploading your assignment")
                })
                .finally(()=>{
                    if (assignment.response_format === "Text") {
                        setTextResponse("");
                    } else if (assignment.response_format === "Image") {
                        setImageResponse(null);
                    } else if (assignment.response_format === "Video") {
                        setVideoResponse(null);
                    }
                })
        }
    }

    // Student List
    let student_list_div = null;
    if (assignment !== null) {
        student_list_div = assignment.assigned_students.map(assignee=>{
            let style = "flex justify-between p-1 my-1 w-full border-2 border-gray-200 bg-sky-100 cursor-pointer hover:bg-indigo-500 hover:text-white rounded-md";
            let green = "stroke-green-600";
            if (selectedStudent !== null) {
                if (selectedStudent.id === assignee.id) {
                    style = "flex justify-between p-1 my-1 w-full border-2 border-gray-200 bg-sky-500 text-white rounded-md"
                    green = "stroke-lime-400";
                }
            }
            let icon = null;
            (assignee.submitted) ? icon = <CheckCircleIcon className={`h-[24px] w-[24px] ${green}`} /> : icon = <XCircleIcon className="h-[24px] w-[24px] stroke-red-600" />
            return (
                <div
                    key={assignee.id}
                    className={style}
                    onClick={()=>setSelectedStudent(assignee)}
                >
                    <h4 className="text-base text-left font-semibold truncate">{assignee.student.name}</h4>
                    {icon}
                </div>
            )
        })
    }

    // Assignment Input
    let assignment_input = null;
    let submit_div = null;
    if (assignment !== null && selectedStudent !== null) {
        if (assignment.response_format === "Text") {
            assignment_input = (
                <textarea 
                    rows="12"
                    placeholder="Type your answer..."
                    className="border border-gray-300 w-full mt-2 p-1"
                    value={textResponse}
                    onChange={(e)=>setTextResponse(e.target.value)}
                />
            )
        } else if (assignment.response_format === "Image") {
            assignment_input = (
                <input type="file" onChange={(e)=>setImageResponse(e.currentTarget.files[0])} />
            )
        } else if (assignment.response_format === "Video") {
            assignment_input = (
                <input type="file" onChange={(e)=>setVideoResponse(e.currentTarget.files[0])} />
            )
        }
        if (selectedStudent.submitted) {
            submit_div = (
                <div>
                    <p>The assignment has already been submitted.</p>
                </div>
            )
        } else {
            submit_div = (
                <div className="mt-2">
                    {assignment_input}
                    <br />
                    <button 
                        className="rounded w-24 p-2 bg-sky-500 text-white font-semibold hover:bg-indigo-500 ml-1 mt-2"
                        onClick={submitAssignment}
                    >
                        Submit
                    </button>
                    <p className="text-sm text-left font-semibold mt-2">{message}</p>
                </div>
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
                            <div className="w-full flex justify-start">
                                <div className="w-28 my-2 flex items-center">
                                    <CheckCircleIcon className="h-[24px] w-[24px] stroke-green-600" />
                                    <p className="text-xs">Submitted</p>
                                </div>
                                <div className="w-28 flex items-center">
                                    <XCircleIcon className="h-[24px] w-[24px] stroke-red-600" />
                                    <p className="text-xs">Not submitted</p>
                                </div>
                            </div>
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
                            {submit_div}
                        </div>
                    </div>
                </div>
            </div>
        );   
    }
}

export default SubmitAssignment;