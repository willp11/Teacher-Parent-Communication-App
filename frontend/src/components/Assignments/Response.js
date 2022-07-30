import { useEffect } from "react"
import { ArrowLeftIcon } from "@heroicons/react/outline"

const Response = (props) => {

    useEffect(()=>{
        console.log(props.assignee, props.assignment);
    })
    let response_div = null;
    if (props.assignment.response_format === "Text") {
        response_div = (
            <div className="w-full p-1 mt-2 border border-gray-300 rounded h-[400px] overflow-auto">
                {props.assignee.assignment_responses[0].text}
            </div>
        )
    } else if (props.assignment.response_format === "Image") {
        response_div = (
            <div className="w-full p-1 mt-2 border border-gray-300 rounded h-[400px] overflow-auto">
                <img src={props.assignee.assignment_responses[0].image} className="object-scale-down" alt=""/>
            </div>
        )
    } else if (props.assignment.response_format === "Video") {
        response_div = (
            <div className="w-full p-1 mt-2 border border-gray-300 rounded h-[400px] overflow-auto">
                <video className="object-scale-down" controls>
                    <source src={props.assignee.assignment_responses[0].video} type="video/mp4" />
                </video>
            </div>
        )
    }
    let modal_div = (
        <div className="relative w-full sm:w-[500px] h-[600px] overflow-auto p-4 mx-auto mt-2 rounded-md bg-white border-2 border-gray-300">
            <h2>Response</h2>
            <ArrowLeftIcon 
                className="absolute top-2 left-2 h-[24px] w-[24px] hover:stroke-indigo-500 cursor-pointer"
                onClick={props.toggleResponseModal}
            />
            <div className="w-full flex flex-col justify-start items-start my-2">
                <p className="text-xs text-gray-600">Student</p>
                <h3>{props.assignee.student.name}</h3>
            </div>
            <div className="w-full flex flex-col justify-start items-start my-2">
                <p className="text-xs text-gray-600">Assignment</p>
                <h3>{props.assignment.title}</h3>
            </div>
            <div className="w-full flex flex-col justify-start items-start my-2">
                <p className="text-xs text-gray-600">Response Type</p>
                <h3>{props.assignment.response_format}</h3>
            </div>
            {response_div}
        </div>
    )
    return (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-30 w-screen h-screen flex items-center justify-center">
            {modal_div}
        </div>
    )
}

export default Response;