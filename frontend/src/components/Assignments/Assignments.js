import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import axios from "axios";
import { useState } from "react";
import AssignToStudents from "./AssignToStudents";
import Assignment from "./Assignment";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { useMessage } from "../../Hooks/useMessage";
import Spinner from "../Spinner/Spinner";

const Assignments = (props) => {

    const token = useSelector((state) => state.auth.token);
    const accountType = useSelector((state) => state.auth.accountType);

    const [showForm, setShowForm] = useState(false);

    const [message, setMessage] = useMessage();
    const [loading, setLoading] = useState(false);

    // ASSIGN TO STUDENTS MODE
    const [assignMode, setAssignMode] = useState(false);
    const [assignmentToAssign, setAssignmentToAssign] = useState(null);
    const toggleAssignMode = (assignment) => {
        if (assignMode) {
            setAssignMode(false);
            setAssignmentToAssign(null);
        } else {
            setAssignMode(true);
            setAssignmentToAssign(assignment);
        }
    }

    // CREATE ASSIGNMENT FUNCTION
    const handleCreateAssignment = (title, description, maximum_score, response_format, actions) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            title, 
            description,
            maximum_score,
            school_class: props.classId,
            response_format
        }
        const url = `${process.env.API_URL}/api/v1/school/assignment-create/`;
        setLoading(true);
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
                actions.resetForm();
                setMessage("Assignment created successfully.");
            })
            .catch(err => {
                console.log(err);
                setMessage("There was a problem creating the assignment.");
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    // CREATE ASSIGNMENT FORM
    const assignment_formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            maximum_score: "",
            response_format: ""
        },
        onSubmit: (values, actions) =>  {
            handleCreateAssignment(values.title, values.description, values.maximum_score, values.response_format, actions);
        },
        validationSchema: Yup.object({
            title: Yup.string().trim().required("Title is required"),
            description: Yup.string().trim().required("Description is required"),
            maximum_score: Yup.number().min(
                0,
                "Maximum score cannot be negative"
            ),
            response_format: Yup.string().trim().required("Response format is required"),
        })
    });

    // SUBMIT BTN
    let submit_btn = (
        <button type="submit" className="w-32 rounded bg-sky-500 hover:bg-indigo-500 p-2 m-2 text-white font-semibold">Submit</button>
    )
    if (loading) {
        submit_btn = (
            <button type="submit" className="w-32 rounded bg-sky-500 hover:bg-indigo-500 p-2 my-2 mx-auto text-white font-semibold flex justify-center" disabled>
                <Spinner />
                Loading
            </button>
        )
    }

    let create_assignment_form = (
        <div className="relative w-full sm:w-[500px] p-2 mx-auto mt-2 rounded-md shadow-md shadow-gray-300 bg-white border-2 border-gray-300 text-center">
            <h3>Create Assignment</h3>

            {showForm ? <ChevronUpIcon onClick={()=>setShowForm(false)} className="h-[24px] w-[24px] absolute right-2 top-3 cursor-pointer" />
            : <ChevronDownIcon onClick={()=>setShowForm(true)} className="h-[24px] w-[24px] absolute right-2 top-3 cursor-pointer" />}

            {showForm ? <form onSubmit={assignment_formik.handleSubmit}>
                <input
                    type="text"
                    placeholder="Type title..."
                    name="title"
                    value={assignment_formik.values.title}
                    onChange={assignment_formik.handleChange}
                    onBlur={assignment_formik.handleBlur}
                    className="border border-gray-300 mt-2 h-10 w-full"
                /> <br/>
                {assignment_formik.errors.title ? <div className="text-sm text-left pl-1">{assignment_formik.errors.title} </div> : null}

                <textarea
                    rows="3"
                    name="description"
                    placeholder="Type description..."
                    value={assignment_formik.values.description}
                    onChange={assignment_formik.handleChange}
                    onBlur={assignment_formik.handleBlur}
                    className="border border-gray-300 mt-2 w-full"
                /> <br/>
                {assignment_formik.errors.description ? <div className="text-sm text-left pl-1">{assignment_formik.errors.description} </div> : null}

                <input
                    type="number"
                    placeholder="Enter maximum score"
                    name="maximum_score"
                    value={assignment_formik.values.maximum_score}
                    onChange={assignment_formik.handleChange}
                    onBlur={assignment_formik.handleBlur}
                    className="border border-gray-300 mt-2 h-10 w-full"
                /> <br/>
                {assignment_formik.errors.maximum_score ? <div className="text-sm text-left pl-1">{assignment_formik.errors.maximum_score} </div> : null}

                <div className="py-2 px-1 border border-gray-300 mt-2">
                    <p className="mb-1 text-left font-semibold text-sm">Response format:</p>
                    <div className="w-full flex justify-start">
                        <div>
                            <input
                                type="radio"
                                name="response_format"
                                value="Text"
                                id="Text"
                                onChange={assignment_formik.handleChange}
                                onBlur={assignment_formik.handleBlur}
                            />
                            <label htmlFor="Text" className="ml-1 mr-4">Text</label> 
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="response_format"
                                value="Image"
                                id="Image"
                                onChange={assignment_formik.handleChange}
                                onBlur={assignment_formik.handleBlur}
                            />
                            <label htmlFor="Image" className="ml-1 mr-4">Image</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="response_format"
                                value="Video"
                                id="Video"
                                onChange={assignment_formik.handleChange}
                                onBlur={assignment_formik.handleBlur}
                            />
                            <label htmlFor="Video" className="ml-1 mr-4">Video</label>
                        </div>
                    </div>
                </div>
                {assignment_formik.errors.response_format ? <div className="text-sm text-left pl-1">{assignment_formik.errors.response_format} </div> : null}

                {submit_btn}
                <p className="text-sm">{message}</p>
            </form> : null}
        </div>
        
    )

    // ASSIGNMENTS
    let assignments = props.assignments.map((assignment)=>{
        return <Assignment key={assignment.id} assignment={assignment} handleDelete={props.handleDelete} getClassInfo={props.getClassInfo} toggleAssignMode={toggleAssignMode} />
    });

    let assignments_div = (
        <div>
            {accountType === "teacher" ? create_assignment_form : null}
            
            <div className="mt-4 mb-16">
                {props.assignments.length === 0 ? <p className="text-center">There are no assignments set.</p> : null}
                {props.assignments.length !== 0 ? <p className="text-sm font-semibold text-center">Students can submit their work for an assignment by following the "Student Link"</p> : null}
                {assignments}
            </div>

        </div>
    )


    if (assignMode) {
        return <AssignToStudents students={props.students} assignment={assignmentToAssign} toggleAssignMode={toggleAssignMode}/>
    } else {
        return assignments_div;
    }

}

export default Assignments;