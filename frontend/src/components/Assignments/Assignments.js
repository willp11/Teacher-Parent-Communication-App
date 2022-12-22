import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import axios from "axios";
import { useState } from "react";
import AssignToStudents from "./AssignToStudents";
import Assignment from "./Assignment";
import { useMessage } from "../../Hooks/useMessage";
import SubmitBtn from "../UI/SubmitBtn";
import AssignmentForm from "../Forms/AssignmentForm";
import CreateContainer from "../UI/CreateContainer";

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
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/assignment-create/`;
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

    let create_assignment_form = (
        <CreateContainer title="Create Assignment" showForm={showForm} setShowForm={setShowForm}>
            <AssignmentForm formik={assignment_formik} message={message}>
                <SubmitBtn
                    loading={loading}
                    clickHandler={assignment_formik.handleSubmit}
                    textContent="Submit"
                />
            </AssignmentForm>
        </CreateContainer>
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