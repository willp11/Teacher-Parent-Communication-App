import { useState } from "react";
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { useMessage } from "../../Hooks/useMessage";

const Assignee = (props) => {

    const [show, setShow] = useState(false);
    const [message, setMessage] = useMessage();

    const handleShowFeedback = () => {
        if (props.student.submitted) {
            
        } else {
            setMessage("The student has not submitted the work yet.")
        }
    }

    const handleShowResponse = () => {
        if (props.student.submitted) {
            
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
                    <button className="w-24 p-1 border border-gray-400 bg-white cursor-pointer rounded-md text-sm shadow" onClick={handleShowFeedback}>Feedback</button>
                    <button className="w-24 p-1 border border-gray-400 bg-white cursor-pointer rounded-md text-sm shadow" onClick={handleShowResponse}>Response</button>
                </div>
                <p className="text-xs">{message}</p>
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