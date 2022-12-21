import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import axios from "axios";
import ProfileImg from '../../Assets/Images/blank-profile.png';
import StudentModal from "./StudentModal";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import SubmitBtn from "../UI/SubmitBtn";

const Students = (props) => {

    const token = useSelector((state)=>state.auth.token);

    const [showStudentModal, setShowStudentModal] = useState(false);
    const [studentToShow, setStudentToShow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

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
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/student-create/`;
        setLoading(true);
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
                actions.resetForm();
            })
            .catch(err => {
                console.log(err);
            })
            .finally(()=>{
                setLoading(false);
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

    // SUBMIT BTN
    let submit_btn = (
        <SubmitBtn
            loading={loading}
            clickHandler={student_formik.handleSubmit}
            textContent="Submit"
        />
    )

    // STUDENTS
    let create_student_form = (
        <div className="relative w-full sm:w-[500px] p-2 mx-auto mt-2 rounded-md shadow-md shadow-gray-300 bg-white border-2 border-gray-300 text-center">
            <h3>Add Student</h3>
            {showForm ? <ChevronUpIcon onClick={()=>setShowForm(false)} className="h-[24px] w-[24px] absolute right-2 top-3 cursor-pointer" />
             : <ChevronDownIcon onClick={()=>setShowForm(true)} className="h-[24px] w-[24px] absolute right-2 top-3 cursor-pointer" />}
            {showForm ? <form className="transition ease-in-out transition-duration-1000ms" onSubmit={student_formik.handleSubmit}>
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
                    {student_formik.errors.name ? <div className="text-sm">{student_formik.errors.name} </div> : null}
                </div>
                <div className="flex justify-center mt-2">
                    {submit_btn}
                </div>
            </form> : null}
        </div>
    )

    let students = props.students.map((student, idx)=>{
        let profile_img_src = ProfileImg;
        if (student.image !== null) {
            profile_img_src = student.image
        }
        return (
            <div 
                key={student.id} 
                className="bg-sky-200 rounded-md shadow-md p-2 w-32 text-center m-2 cursor-pointer"
                onClick={()=>showStudentModalHandler(idx)}
            >
                <h3 className="pb-2 truncate">{student.name}</h3>
                <img src={profile_img_src} className="h-[100px] w-[100px] mx-auto rounded-full" alt=""/>       
            </div>
        )
    })

    let students_div = (
        <div>
            {create_student_form}
            <div className="p-2 mt-2 w-full flex items-center justify-center flex-wrap">
                {students}
            </div>

            {showStudentModal ? <StudentModal student={studentToShow !== null ? props.students[studentToShow] : null} getClassInfo={props.getClassInfo} hide={hideStudentModalHandler} handleDelete={props.handleDelete}/> : null}
        </div>
    )

    return students_div;
}

export default Students;