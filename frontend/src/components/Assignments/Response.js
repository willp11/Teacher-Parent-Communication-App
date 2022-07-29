import { useEffect } from "react"
import { ArrowLeftIcon } from "@heroicons/react/outline"

const Response = (props) => {

    useEffect(()=>{
        console.log(props.assignee, props.assignment);
    })

    let response_div = (
        <div className="relative w-full sm:w-[500px] h-[600px] overflow-auto p-4 mx-auto mt-2 rounded-md bg-white border-2 border-gray-300">
            <h2>Response</h2>
            <ArrowLeftIcon 
                className="absolute top-2 left-2 h-[24px] w-[24px] hover:stroke-indigo-500 cursor-pointer"
                onClick={props.toggleResponseModal}
            />
            <div className="w-full flex justify-start items-center">
                <p className="font-semibold mr-2">Student: </p>
                <p>{props.assignee.student.name}</p>
            </div>
            <div className="w-full flex justify-start items-center">
                <p className="font-semibold mr-2">Assignment: </p>
                <p>{props.assignment.title}</p>
            </div>
            <div className="w-full p-1 mt-2 border border-gray-300 rounded h-[400px] overflow-auto">

            </div>
        </div>
    )
    return (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-30 w-screen h-screen flex items-center justify-center">
            {response_div}
        </div>
    )
}

export default Response;