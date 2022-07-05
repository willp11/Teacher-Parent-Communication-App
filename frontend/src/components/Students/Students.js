import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import axios from "axios";
import { useState } from "react";

const Students = (props) => {

    const token = useSelector((state)=>state.auth.token);

    // EDIT MODE - when on, all edit buttons disappear. On student being edited, show cancel and confirm buttons.
    const [editMode, setEditMode] = useState(false);
    // use student's id
    const [studentToEdit, setStudentToEdit] = useState(null);
    // edited student's new name
    const [newStudentName, setNewStudentName] = useState("");

    // CREATE STUDENT FUNCTION
    const handleCreateStudent = (name, actions) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            name, 
            school_class: props.classId
        }
        const url = 'http://localhost:8000/api/v1/school/student-create/';
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

    // EDIT STUDENT FUNCTION
    // Confirm button
    const handleEditStudentConfirm = () => {
        console.log(`Editing student id: ${studentToEdit}`);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            name: newStudentName
        }
        const url = 'http://localhost:8000/api/v1/school/student-update/' + studentToEdit + '/';
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
                setNewStudentName("");
            })
    }
    // Turn on/off edit mode
    const toggleEditMode = (id) => {
        if (editMode) {
            setEditMode(false);
            setStudentToEdit(null);
        } else {
            setEditMode(true);
            setStudentToEdit(id);
        }
    }

    // CREATE STUDENT FORM
    const student_formik = useFormik({
        initialValues: {
            name: ""
        },
        onSubmit: (values, actions) =>  {
            handleCreateStudent(values.name, actions);
        },
        validationSchema: Yup.object({
            name: Yup.string().trim().required("name is required")
        })
    });

    // STUDENTS
    let create_student_form = (
        <form onSubmit={student_formik.handleSubmit}>
            <div>
                <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={student_formik.values.name}
                    onChange={student_formik.handleChange}
                    onBlur={student_formik.handleBlur}
                    style={{textAlign: "center"}}
                /> <br/>
                {student_formik.errors.name ? <div className="ErrorMsg">{student_formik.errors.name} </div> : null}
            </div>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    )
    let students = props.students.map((student)=>{
        let editOnDiv = (
            <div>
                <h3>{student.name}</h3>
                <input placeholder="New Name" value={newStudentName} onChange={(e)=>setNewStudentName(e.target.value)}/>
                <button onClick={()=>toggleEditMode(null)}>Cancel</button>
                <button onClick={()=>handleEditStudentConfirm()}>Confirm</button>
            </div>
        )
        let editOffDiv = (
            <div>
                <h3>{student.name}</h3>
                <button onClick={()=>toggleEditMode(student.id)}>Edit</button> <br/>
                <button onClick={()=>props.handleDelete(student.id, "student")}>Delete</button>
            </div>
        )
        return (
            <div className="list-div" key={student.id}>
                {(editMode && studentToEdit === student.id) ? editOnDiv : editOffDiv}
            </div>
        )
    });
    let students_div = (
        <div className="list-div-wrapper">
            <h2>Students</h2>
            {create_student_form}
            {props.students.length === 0 ? <p>There are no students</p> : null}
            {students}
        </div>
    )

    return students_div;
}

export default Students;