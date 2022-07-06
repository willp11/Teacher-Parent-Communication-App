import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import axios from "axios";
import { useState } from "react";
import AssignToStudents from "../AssignToStudents/AssignToStudents";
import Assignment from "../Assignment/Assignment";

const Assignments = (props) => {

    const token = useSelector((state) => state.auth.token);

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
            maximum_score: 0
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
        <form onSubmit={assignment_formik.handleSubmit}>
            <div>
                <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={assignment_formik.values.title}
                    onChange={assignment_formik.handleChange}
                    onBlur={assignment_formik.handleBlur}
                    style={{textAlign: "center"}}
                /> <br/>
                {assignment_formik.errors.title ? <div className="ErrorMsg">{assignment_formik.errors.title} </div> : null}

                <textarea
                    rows="10"
                    name="description"
                    value={assignment_formik.values.description}
                    onChange={assignment_formik.handleChange}
                    onBlur={assignment_formik.handleBlur}
                    placeholder="Description"
                /> <br/>
                {assignment_formik.errors.content ? <div className="ErrorMsg">{assignment_formik.errors.content} </div> : null}

                <input
                    type="number"
                    placeholder="Maximum Score"
                    name="maximum_score"
                    value={assignment_formik.values.maximum_score}
                    onChange={assignment_formik.handleChange}
                    onBlur={assignment_formik.handleBlur}
                    style={{textAlign: "center"}}
                /> <br/>
                {assignment_formik.errors.maximum_score ? <div className="ErrorMsg">{assignment_formik.errors.maximum_score} </div> : null}
            </div>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    )

    // ASSIGNMENTS
    let assignments = props.assignments.map((assignment)=>{
        return <Assignment key={assignment.id} assignment={assignment} handleDelete={props.handleDelete} getClassInfo={props.getClassInfo} toggleAssignMode={toggleAssignMode} />
    });

    let assignments_div = (
        <div className="list-div-wrapper">
            <h2>Assignments</h2>
            {create_assignment_form}
            {props.assignments.length === 0 ? <p>There are no assignments</p> : null}
            {assignments}
        </div>
    )

    if (assignMode) {
        return <AssignToStudents students={props.students} assignment={assignmentToAssign} toggleAssignMode={toggleAssignMode}/>
    } else {
        return assignments_div;
    }

}

export default Assignments;