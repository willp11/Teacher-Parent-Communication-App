import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import axios from "axios";

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
        return (
            <div className="list-div" key={student.id}>
                <h3>{student.name}</h3>
                <button onClick={()=>props.handleDelete(student.id, "student")}>Delete</button>
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