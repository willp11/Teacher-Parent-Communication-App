import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import axios from "axios";
import ProfileImg from '../../Assets/Images/blank-profile.png';
import StudentModal from "./StudentModal";
import { useState } from "react";

const Students = (props) => {

    const token = useSelector((state)=>state.auth.token);

    const [showStudentModal, setShowStudentModal] = useState(false);
    const [studentToShow, setStudentToShow] = useState(null);

    // SHOW/HIDE STUDENT MODAL
    const showStudentModalHandler = (student) => {
        setShowStudentModal(true);
        setStudentToShow(student);
    }
    const hideStudentModalHandler = () => {
        setShowStudentModal(false);
        setStudentToShow(null);
    }

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

    // CREATE STUDENT FORM
    const student_formik = useFormik({
        initialValues: {
            name: ""
        },
        onSubmit: (values, actions) =>  {
            handleCreateStudent(values.name, actions);
        },
        validationSchema: Yup.object({
            name: Yup.string().trim().required("Name is required")
        })
    });

    // STUDENTS
    let create_student_form = (
        <div className="w-full sm:w-[400px] p-2 mx-auto mt-2 rounded-md shadow-md bg-slate-100 text-center">
            <h3>Add Student</h3>
            <form onSubmit={student_formik.handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Type student's name..."
                        name="name"
                        value={student_formik.values.name}
                        onChange={student_formik.handleChange}
                        onBlur={student_formik.handleBlur}
                        style={{textAlign: "center"}}
                        className="border border-gray-300 mt-2 h-10"
                    /> <br/>
                    {student_formik.errors.name ? <div className="text-sm pl-2 py-1">{student_formik.errors.name} </div> : null}
                </div>
                <div>
                    <button type="submit" className="w-32 rounded-full bg-sky-500 hover:bg-indigo-500 p-2 mt-2 mb-4 text-white font-bold border-2 border-black">Submit</button>
                </div>
            </form>
        </div>
    )

    // let students = props.students.map((student)=>{
    //     return <Student key={student.id} student={student} handleDelete={props.handleDelete} getClassInfo={props.getClassInfo} />
    // });
    let students = props.students.map((student)=>{
        return (
            <div 
                key={student.id} 
                className="bg-sky-100 rounded-md shadow-md p-2 w-32 text-center m-2 cursor-pointer"
                onClick={()=>showStudentModalHandler(student)}
            >
                <h3 className="text-gray-600 pb-2">{student.name}</h3>
                <img src={ProfileImg} className="h-[100px] w-[100px] mx-auto rounded-full"/>
            </div>
        )
    })

    let students_div = (
        <div>
            {create_student_form}
            {props.students.length === 0 ? <p>There are no students</p> : null}
            <div className="p-2 w-full flex items-center flex-wrap">
                {students}
            </div>

            {showStudentModal ? <StudentModal student={studentToShow} getClassInfo={props.getClassInfo} hide={hideStudentModalHandler} handleDelete={props.handleDelete}/> : null}
        </div>
    )

    return students_div;
}

export default Students;