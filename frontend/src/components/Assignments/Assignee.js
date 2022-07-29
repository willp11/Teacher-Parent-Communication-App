import { useState } from "react";
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { useMessage } from "../../Hooks/useMessage";
import Feedback from "./Feedback";
import Response from "./Response";

const Assignee = (props) => {

    const [show, setShow] = useState(false);
    const [message, setMessage] = useMessage();
    const [showFeedback, setShowFeedback] = useState(false);
    const [showResponse, setShowResponse] = useState(false);

    const toggleFeedbackModal = () => {
        setShowFeedback(!showFeedback);
    }

    const toggleResponseModal = () => {
        setShowResponse(!showResponse);
    }

    const handleShowFeedback = () => {
        if (!props.student.submitted) {
            toggleFeedbackModal()
        } else {
            setMessage("The student has not submitted the work yet.")
        }
    }

    const handleShowResponse = () => {
        if (!props.student.submitted) {
            toggleResponseModal()
        } else {
            setMessage("The student has not submitted the work yet.")
        }
    }

    if (show === true) {
        return (
            <div className="w-full rounded shadow-md border border-gray-400 p-1 bg-sky-100">
                <div className="w-full flex justify-between mb-1">
                    <div className="flex w-32 justify-start">
                        {props.student.submitted ? <CheckCircleIcon className="h-[24px] w-[24px] stroke-green-600"/> : <XCircleIcon className="h-[24px] w-[24px] stroke-red-600"/>}
                        <p className="font-semibold truncate pl-2">{props.student.student.name}</p>
                    </div>
                    <ChevronUpIcon className="h-[24px] w-[24px] cursor-pointer" onClick={()=>setShow(false)}/>
                </div>
                <p className="text-sm ml-1 mb-1">Score: {props.student.score ? props.student.score : "--"} / {props.assignment.maximum_score}</p>
                <div className="w-full flex justify-between mb-1">
                    <button className="w-24 p-1 border border-gray-400 bg-white cursor-pointer rounded-md text-sm shadow hover:bg-gray-50" onClick={handleShowFeedback}>Feedback</button>
                    <button className="w-24 p-1 border border-gray-400 bg-white cursor-pointer rounded-md text-sm shadow hover:bg-gray-50" onClick={handleShowResponse}>Response</button>
                </div>
                <p className="text-xs">{message}</p>
                {showFeedback ? <Feedback assignee={props.student} assignment={props.assignment} toggleFeedbackModal={toggleFeedbackModal} getAllocatedStudents={props.getAllocatedStudents} /> : null}
                {showResponse ? <Response assignee={props.student} assignment={props.assignment} toggleResponseModal={toggleResponseModal} /> : null}
            </div>
        )
    } else {
        return (
            <div className="w-full rounded shadow-md border border-gray-400 p-1 bg-sky-100">
                <div className="w-full flex justify-between mb-1">
                    <div className="flex w-32 justify-start">
                        {props.student.submitted ? <CheckCircleIcon className="h-[24px] w-[24px] stroke-green-600"/> : <XCircleIcon className="h-[24px] w-[24px] stroke-red-600"/>}
                        <p className="font-semibold truncate pl-2">{props.student.student.name}</p>
                    </div>
                    <ChevronDownIcon className="h-[24px] w-[24px] cursor-pointer" onClick={()=>setShow(true)}/>
                </div>
            </div>
        )
    }
}

export default Assignee;