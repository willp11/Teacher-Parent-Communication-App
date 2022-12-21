import { useSelector } from "react-redux";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useState } from "react";
import SubmitBtn from "../UI/SubmitBtn";
import EditModal from "../UI/EditModal";

const EditAssignmentModal = (props) => {

    const token = useSelector((state)=>state.auth.token);

    const [loading, setLoading] = useState(false);

    // SEND EDIT ASSIGNMENT REQUEST
    const handleEditAssignmentConfirm = (title, description, maximum_score, response_format) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            title, 
            description, 
            maximum_score,
            response_format
        };
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/assignment-update/${props.assignment.id}/`;
        setLoading(true);
        axios.put(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
                props.toggleEditMode();
            })
            .catch(err => {
                console.log(err);
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    // EDIT ASSIGNMENT FORMIK OBJECT
    const assignment_formik = useFormik({
        initialValues: {
            title: props.assignment.title,
            description: props.assignment.description,
            maximum_score: props.assignment.maximum_score,
            response_format: props.assignment.response_format
        },
        onSubmit: (values, actions) =>  {
            handleEditAssignmentConfirm(values.title, values.description, values.maximum_score, values.response_format);
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

    // SUBMIT BTN
    let submit_btn = (
        <SubmitBtn
            loading={loading}
            clickHandler={assignment_formik.handleSubmit}
            textContent="Submit"
        />
    )

    // EDIT FORM
    let edit_form = (
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
            {assignment_formik.errors.title ? <div className="text-sm w-full text-left pl-2">{assignment_formik.errors.title} </div> : null}

            <textarea
                rows="3"
                name="description"
                placeholder="Type description..."
                value={assignment_formik.values.description}
                onChange={assignment_formik.handleChange}
                onBlur={assignment_formik.handleBlur}
                className="border border-gray-300 mt-2 w-full"
            /> <br/>
            {assignment_formik.errors.content ? <div className="text-sm w-full text-left pl-2">{assignment_formik.errors.content} </div> : null}

            <input
                type="number"
                placeholder="Enter maximum score"
                name="maximum_score"
                value={assignment_formik.values.maximum_score}
                onChange={assignment_formik.handleChange}
                onBlur={assignment_formik.handleBlur}
                className="border border-gray-300 mt-2 h-10 w-full"
            /> <br/>
            {assignment_formik.errors.maximum_score ? <div className="text-sm w-full text-left pl-2">{assignment_formik.errors.maximum_score} </div> : null}

            <div className="py-2 px-1 border border-gray-300 mt-2">
                <p className="mb-1 text-left font-semibold text-sm">Response format:</p>
                <div className="w-full flex justify-start">
                    <div>
                        <input
                            type="radio"
                            name="response_format"
                            value="Text"
                            id="Text"
                            checked={assignment_formik.values.response_format === "Text"}
                            onChange={assignment_formik.handleChange}
                            onBlur={assignment_formik.handleBlur}
                        />
                        <label htmlFor="Text" className="ml-1 mr-4">Text</label> 
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="response_format"
                            value="Image"
                            id="Image"
                            checked={assignment_formik.values.response_format === "Image"}
                            onChange={assignment_formik.handleChange}
                            onBlur={assignment_formik.handleBlur}
                        />
                        <label htmlFor="Image" className="ml-1 mr-4">Image</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="response_format"
                            value="Video"
                            id="Video"
                            checked={assignment_formik.values.response_format === "Video"}
                            onChange={assignment_formik.handleChange}
                            onBlur={assignment_formik.handleBlur}
                        />
                        <label htmlFor="Video" className="ml-1 mr-4">Video</label>
                    </div>
                </div>
            </div>
            {assignment_formik.errors.response_format ? <div className="text-sm text-left pl-1">{assignment_formik.errors.response_format} </div> : null}
            <div className="flex justify-center mt-2">
                {submit_btn}
            </div>
        </form>
    )

    return (
        <EditModal title="Edit Assignment" toggleEditMode={props.toggleEditMode}>
            {edit_form}
        </EditModal>
    )
}

export default EditAssignmentModal;