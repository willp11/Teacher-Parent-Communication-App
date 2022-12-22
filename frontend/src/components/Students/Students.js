import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import axios from "axios";
import ProfileImg from '../../Assets/Images/blank-profile.png';
import StudentModal from "./StudentModal";
import { useState } from "react";
import SubmitBtn from "../UI/SubmitBtn";
import StudentForm from "../Forms/StudentForm";
import CreateContainer from "../UI/CreateContainer";

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

    // FORMIK
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


    // CREATE STUDENT FORM
    let create_student_form = (
        <CreateContainer title="Add Student" showForm={showForm} setShowForm={setShowForm}>
            <StudentForm formik={student_formik}>
                <SubmitBtn
                    loading={loading}
                    clickHandler={student_formik.handleSubmit}
                    textContent="Submit"
                />
            </StudentForm>
        </CreateContainer>  
    )

    // STUDENTS
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