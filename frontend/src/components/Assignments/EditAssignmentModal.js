import { useSelector } from "react-redux";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useState } from "react";
import SubmitBtn from "../UI/SubmitBtn";
import EditModal from "../UI/EditModal";
import AssignmentForm from "../Forms/AssignmentForm";

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

    return (
        <EditModal title="Edit Assignment" toggleEditMode={props.toggleEditMode}>
            <AssignmentForm formik={assignment_formik} message={null}>
                <SubmitBtn
                    loading={loading}
                    clickHandler={assignment_formik.handleSubmit}
                    textContent="Submit"
                />
            </AssignmentForm>
        </EditModal>
    )
}

export default EditAssignmentModal;