import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import axios from "axios";
import { useState } from "react";
import AssignToStudents from "./AssignToStudents";
import Assignment from "./Assignment";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";

const Assignments = (props) => {

    const token = useSelector((state) => state.auth.token);
    const accountType = useSelector((state) => state.auth.accountType);

    const [showForm, setShowForm] = useState(false);

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
    const handleCreateAssignment = (title, description, maximum_score, actions) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            title, 
            description,
            maximum_score,
            school_class: props.classId
        }
        const url = 'http://localhost:8000/api/v1/school/assignment-create/';
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
                actions.resetForm();
            })
            .catch(err => {
                console.log(err);
            })
    }

    // CREATE ASSIGNMENT FORM
    const assignment_formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            maximum_score: ""
        },
        onSubmit: (values, actions) =>  {
            handleCreateAssignment(values.title, values.description, values.maximum_score, actions);
        },
        validationSchema: Yup.object({
            title: Yup.string().trim().required("title is required"),
            description: Yup.string().trim().required("description is required"),
            maximum_score: Yup.number().min(
                0,
                "Maximum score cannot be negative"
            )
        })
    });

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
                {assignment_formik.errors.title ? <div className="ErrorMsg">{assignment_formik.errors.title} </div> : null}

                <textarea
                    rows="3"
                    name="description"
                    placeholder="Type description..."
                    value={assignment_formik.values.description}
                    onChange={assignment_formik.handleChange}
                    onBlur={assignment_formik.handleBlur}
                    className="border border-gray-300 mt-2 w-full"
                /> <br/>
                {assignment_formik.errors.content ? <div className="ErrorMsg">{assignment_formik.errors.content} </div> : null}

                <input
                    type="number"
                    placeholder="Enter maximum score"
                    name="maximum_score"
                    value={assignment_formik.values.maximum_score}
                    onChange={assignment_formik.handleChange}
                    onBlur={assignment_formik.handleBlur}
                    className="border border-gray-300 mt-2 h-10 w-full"
                /> <br/>
                {assignment_formik.errors.maximum_score ? <div className="ErrorMsg">{assignment_formik.errors.maximum_score} </div> : null}
                <button className="rounded-md border-2 border-black bg-sky-500 hover:bg-indigo-500 text-white font-semibold px-4 py-2 m-2" type="submit">Submit</button>
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