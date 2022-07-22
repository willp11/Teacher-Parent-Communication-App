import { useSelector } from "react-redux";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { XIcon } from "@heroicons/react/outline";

const EditAssignmentModal = (props) => {

    const token = useSelector((state)=>state.auth.token);

    // Confirm button
    const handleEditAssignmentConfirm = (title, description, maximum_score) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            title, 
            description, 
            maximum_score
        };
        const url = 'http://localhost:8000/api/v1/school/assignment-update/' + props.assignment.id + '/';
        axios.put(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
                props.toggleEditMode();
            })
            .catch(err => {
                console.log(err);
            })
    }

    // CREATE ASSIGNMENT FORM
    const assignment_formik = useFormik({
        initialValues: {
            title: props.assignment.title,
            description: props.assignment.description,
            maximum_score: props.assignment.maximum_score
        },
        onSubmit: (values, actions) =>  {
            handleEditAssignmentConfirm(values.title, values.description, values.maximum_score);
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

    let edit_form = (
        <div className="relative w-full sm:w-[500px] p-4 mx-auto mt-2 rounded-md shadow-md shadow-gray-300 bg-white border-2 border-gray-300 text-center">
            <h3>Edit Assignment</h3>
            <XIcon 
                className="absolute top-2 right-2 h-[24px] w-[24px] hover:border hover:border-gray-300 cursor-pointer"
                onClick={props.toggleEditMode}
            />

            <form onSubmit={assignment_formik.handleSubmit}>
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
            </form>
        </div>
    )

    let edit_modal = (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-20 w-screen h-screen flex items-center justify-center">
            {edit_form}
        </div>
    )

    return edit_modal;
}

export default EditAssignmentModal;