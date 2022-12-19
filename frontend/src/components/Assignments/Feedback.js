import { useState } from "react"
import {useSelector} from "react-redux"
import { ArrowLeftIcon, PencilAltIcon } from "@heroicons/react/outline"
import { useFormik } from "formik"
import * as Yup from 'yup';
import axios from 'axios';
import { useMessage } from "../../Hooks/useMessage";
import Spinner from "../Spinner/Spinner";

const Feedback = (props) => {

    const token = useSelector(state => state.auth.token);

    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useMessage();
    const [loading, setLoading] = useState(false);

    const toggleEditMode = () => {
        setEditMode(!editMode)
    }

    const handleSubmitFeedback = (score, feedback) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = `${process.env.API_URL}/api/v1/school/assignee-score-update/${props.assignee.id}/`;
        const data = {
            score,
            feedback
        }
        setLoading(true);
        axios.put(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                setMessage("Feedback updated successfully")
                props.getAllocatedStudents();
            })
            .catch(err=>{
                console.log(err);
                setMessage("There was a problem updating your feedback.")
            })
            .finally(()=>{
                setEditMode(false);
                setLoading(false);
            })
    }

    let initial_score = "";
    if (props.assignee.score) initial_score = props.assignee.score;
    let initial_feedback = "";
    if (props.assignee.feedback) initial_feedback = props.assignee.feedback;
    const form = useFormik({
        initialValues: {
            score: initial_score,
            feedback: initial_feedback
        },
        onSubmit: (values) => {
            handleSubmitFeedback(values.score, values.feedback);
        },
        validationSchema: Yup.object({
            score: Yup.number().min(
                0,
                `Score cannot be negative`
            ),
            feedback: Yup.string().trim()
        })
    });

    // SUBMIT BTN
    let submit_btn = (
        <button type="submit" className="w-32 rounded bg-sky-500 hover:bg-indigo-500 p-2 mt-1 text-white font-semibold">Submit</button>
    )
    if (loading) {
        submit_btn = (
            <button type="submit" className="w-32 rounded bg-sky-500 hover:bg-indigo-500 p-2 mt-1 text-white font-semibold flex justify-center" disabled>
                <Spinner />
                Loading
            </button>
        )
    }

    let form_div = (
        <form onSubmit={form.handleSubmit}>
            <input
                type="number"
                placeholder="Type score..."
                name="score"
                value={form.values.score}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                className="border border-gray-300 mt-2 h-10 w-full"
            /> <br/>
            {form.errors.score ? <div className="text-sm text-left">{form.errors.score} </div> : null}

            <textarea
                rows="12"
                type="text"
                placeholder="Type feedback..."
                name="feedback"
                value={form.values.feedback}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                className="border border-gray-300 mt-2 w-full"
            /> <br/>
            {form.errors.feedback ? <div className="text-sm text-left">{form.errors.feedback} </div> : null}
            <div className="w-full flex justify-center">
                {submit_btn}
            </div>
        </form>
    )

    let score_feedback = (
        <div>
            <div className="w-full flex justify-start items-center">
                <p className="font-semibold mr-2">Score: </p>
                <p>{props.assignee.score ? props.assignee.score : "--"} / {props.assignment.maximum_score}</p>
            </div>
            <div className="w-full flex flex-col justify-start items-start">
                <p className="font-semibold">Feedback:</p>
                <div className="w-full p-1 border border-gray-300 rounded h-[300px] overflow-auto">
                    <p>{props.assignee.feedback ? props.assignee.feedback : "You have not given any feedback yet!"}</p>
                </div>
            </div>
        </div>
    )

    let edit_btn_style = "w-24 p-1 my-2 rounded bg-green-600 text-white flex justify-around items-center cursor-pointer hover:bg-green-700";
    if (editMode) edit_btn_style = "w-24 p-1 my-2 rounded bg-red-600 text-white flex justify-around items-center cursor-pointer hover:bg-red-700";
    let main_div = (
        <div className="relative w-full sm:w-[500px] h-[600px] overflow-auto p-4 mx-auto mt-2 rounded-md bg-white border-2 border-gray-300">
            <ArrowLeftIcon 
                className="absolute top-2 left-2 h-[24px] w-[24px] hover:stroke-indigo-500 cursor-pointer"
                onClick={props.toggleFeedbackModal}
            />
            <h2>Feedback</h2>
            <div className="w-full flex justify-start items-center">
                <p className="font-semibold mr-2">Student: </p>
                <p>{props.assignee.student.name}</p>
            </div>
            <div className="w-full flex justify-start items-center">
                <p className="font-semibold mr-2">Assignment: </p>
                <p>{props.assignment.title}</p>
            </div>
            <div className={edit_btn_style} onClick={toggleEditMode}>
                <p className="font-semibold">{editMode ? "Cancel" : "Edit"}</p>
                <PencilAltIcon className="h-[24px] w-[24px]"/>
            </div>
            {editMode ? form_div : score_feedback}
            <p className="text-sm mt-1">{message}</p>
        </div>
    )
    return (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-30 w-screen h-screen flex items-center justify-center">
            {main_div}
        </div>
    )
}

export default Feedback;