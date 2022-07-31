import { Link } from "react-router-dom";
import { useState } from "react";
import {useMessage} from '../../Hooks/useMessage';
import { useSelector } from "react-redux";
import axios from "axios";
import Spinner from '../Spinner/Spinner';

const ChildrenInfo = (props) => {

    const token = useSelector((state)=>state.auth.token);

    const [message, setMessage] = useMessage();
    const [loading, setLoading] = useState(false);
    const [inviteCode, setInviteCode] = useState("")

    // Parent accounts only - list of their children
    let children_list = props.profile.parent.children.map(child => {
        return (
            <div key={child.id} className="border border-gray-300 rounded-md shadow-md w-64 mx-auto my-2 bg-sky-100">
                <Link to={"/studentProfile/"+child.id}><h4 className="text-blue-700 underline">{child.name}</h4></Link>
                <p>{child.school_class.school.name}</p>
                <p>{child.school_class.name}</p>
            </div>
        )
    })

    // Add child handler
    const handleSubmitAddChild = (inviteCode) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/use-invite-code/'
        const data = {
            code: inviteCode
        }
        setLoading(true);
        axios.put(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                setMessage("Child added successfully.")
                props.getUserProfile()
                setInviteCode("")
            })
            .catch(err=>{
                console.log(err);
                setMessage("There was a problem linking your child to your account. Please double check your child's invite code.")
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    let submit_btn = (
        <button 
            onClick={()=>handleSubmitAddChild(inviteCode)}
            className="w-24 rounded bg-sky-500 hover:bg-indigo-500 p-2 text-white font-semibold ml-2"
        >
            Submit
        </button>
    )
    if (loading) {
        submit_btn = (
            <button 
                onClick={()=>handleSubmitAddChild(inviteCode)}
                className="w-24 rounded bg-sky-500 hover:bg-indigo-500 p-2 text-white font-semibold ml-2 mx-auto flex justify-center items-center"
                disabled
            >
                <Spinner />
                Loading
            </button>
        )
    }

    // Add children
    let invite_code_div = (
        <div className="mb-4">
            <h2 className="text-gray-600 text-sm">Add Child</h2>
            <input 
                placeholder="Type invite code..." 
                onChange={(e)=>setInviteCode(e.target.value)}
                className="p-2 border border-gray-300 h-10"
                value={inviteCode}
            />
            {submit_btn}
            <p className="text-sm">{message}</p>
        </div>
    )

    let children_info_div = (
        <div className="rounded-md shadow-md bg-white mt-2 mb-4 p-4 min-h-[250px]">
            <h2 className="text-md pb-2">Children</h2>
            {invite_code_div}
            {props.profile.parent.children.length === 0 ? <p className="mt-4">You do not have any children linked to your account.</p> : children_list}
        </div>
    )

    return children_info_div;
}

export default ChildrenInfo;