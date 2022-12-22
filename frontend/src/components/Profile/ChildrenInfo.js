import { useState } from "react";
import {useMessage} from '../../Hooks/useMessage';
import { useSelector } from "react-redux";
import axios from "axios";
import Child from "./Child";
import SubmitBtn from "../UI/SubmitBtn";

const ChildrenInfo = (props) => {

    const token = useSelector((state)=>state.auth.token);

    const [message, setMessage] = useMessage();
    const [loading, setLoading] = useState(false);
    const [inviteCode, setInviteCode] = useState("");

    // Parent accounts only - list of their children
    let children_list = props.profile.parent.children.map(child => {
        return <Child key={child.id} child={child} getUserProfile={props.getUserProfile} />
    })

    // Add child handler
    const handleSubmitAddChild = (inviteCode) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/use-invite-code/`;
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

    // Add children
    let invite_code_div = (
        <div className="mb-4">
            <h2 className="text-gray-600 text-sm">Add Child</h2>
            <div className="flex justify-center items-center">
                <input 
                    placeholder="Type invite code..." 
                    onChange={(e)=>setInviteCode(e.target.value)}
                    className="p-2 border border-gray-300 h-10"
                    value={inviteCode}
                />
                <SubmitBtn
                    loading={loading}
                    clickHandler={()=>handleSubmitAddChild(inviteCode)}
                    textContent="Submit"
                />
            </div>
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