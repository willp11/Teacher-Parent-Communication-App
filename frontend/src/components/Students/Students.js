import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import axios from "axios";
import Student from "../Student/Student";

const Students = (props) => {

    const token = useSelector((state)=>state.auth.token);

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
        <div className="p-2 mt-2 mb-4 shadow-md bg-white">
            <h3>Add Student</h3>
            <form onSubmit={student_formik.handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="New student's name..."
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
                    <button type="submit" className="w-32 rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-2 my-2 text-white font-bold border-2 border-black">Submit</button>
                </div>
            </form>
        </div>
    )

    let students = props.students.map((student)=>{
        return <Student key={student.id} student={student} handleDelete={props.handleDelete} getClassInfo={props.getClassInfo} />
    });

    let students_div = (
        <div>
            {create_student_form}
            {props.students.length === 0 ? <p>There are no students</p> : null}
            <div className="p-2 shadow-md bg-white">
                <h3 className="m-2">Student List</h3>
                {students}
            </div>
        </div>
    )

    return students_div;
}

export default Students;