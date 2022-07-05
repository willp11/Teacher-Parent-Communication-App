import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import axios from "axios";
import { useState } from "react";

const Assignments = (props) => {

    const token = useSelector((state) => state.auth.token);

    // EDIT MODE - when on, all edit buttons disappear. On assignment being edited, show cancel and confirm buttons.
    const [editMode, setEditMode] = useState(false);
    // use assignment id
    const [assignmentToEdit, setAssignmentToEdit] = useState(null);
    // edited assignment new object
    const [newAssignmentObj, setNewAssignmentObj] = useState({
        title: "",
        description: "",
        maximum_score: 0
    });

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

    // EDIT ASSIGNMENT FUNCTION
    // Inputs 
    const handleUpdateAssignmentObj = (field, value) => {
        let newObj = {...newAssignmentObj};
        newObj[field] = value;
        setNewAssignmentObj(newObj);
    }
    // Confirm button
    const handleEditAssignmentConfirm = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = newAssignmentObj;
        const url = 'http://localhost:8000/api/v1/school/assignment-update/' + assignmentToEdit + '/';
        axios.put(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
            })
            .catch(err => {
                console.log(err);
            })
            .finally(()=>{
                toggleEditMode(null);
                setNewAssignmentObj({
                    title: "",
                    content: ""
                });
            })
    }
    // Turn on/off edit mode
    const toggleEditMode = (assignment) => {
        if (editMode) {
            setEditMode(false);
            setAssignmentToEdit(null);
            setNewAssignmentObj({
                title: "",
                content: ""
            });
        } else {
            setEditMode(true);
            setAssignmentToEdit(assignment.id);
            setNewAssignmentObj(assignment);
        }
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

    // STORIES
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
    let assignments = props.assignments.map((assignment)=>{
        let editOnDiv = (
            <div>
                <h3>{assignment.title}</h3>
                <input type="text" placeholder="New Title" value={newAssignmentObj.title} onChange={(e)=>handleUpdateAssignmentObj("title", e.target.value)}/> <br/>
                <textarea placeholder="New Description" value={newAssignmentObj.description} onChange={(e)=>handleUpdateAssignmentObj("description", e.target.value)} rows="10"/> <br/>
                <input type="number" placeholder="New Maximum Score" value={newAssignmentObj.maximum_score} onChange={(e)=>handleUpdateAssignmentObj("maximum_score", e.target.value)}/> <br/>
                <button onClick={()=>toggleEditMode(null)}>Cancel</button>
                <button onClick={()=>handleEditAssignmentConfirm()}>Confirm</button>
            </div>
        )
        let editOffDiv = (
            <div>
                <h3>{assignment.title}</h3>
                <p>{assignment.content}</p>
                <p>{assignment.description}</p>
                <p>Maximum score: {assignment.maximum_score}</p>
                <button onClick={()=>toggleEditMode(assignment)}>Edit</button> <br/>
                <button onClick={()=>props.handleDelete(assignment.id, "assignment")}>Delete</button>
            </div>
        )
        return (
            <div className="list-div" key={assignment.id}>
                {(editMode && assignmentToEdit === assignment.id) ? editOnDiv : editOffDiv}
            </div>
        )
    });
    let assignments_div = (
        <div className="list-div-wrapper">
            <h2>Assignments</h2>
            {create_assignment_form}
            {props.assignments.length === 0 ? <p>There are no assignments</p> : null}
            {assignments}
        </div>
    )

    return assignments_div;

}

export default Assignments;