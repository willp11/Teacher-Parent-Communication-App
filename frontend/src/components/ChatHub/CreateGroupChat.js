import { useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import { useMessage } from "../../Hooks/useMessage";
import Spinner from "../Spinner/Spinner";

const CreateGroupChat = (props) => {
    const token = useSelector((state)=>state.auth.token);
    const [newGroupName, setNewGroupName] = useState("");
    const [message, setMessage] = useMessage();
    const [loading, setLoading] = useState(false);

    const handleCreateGroup = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            name: newGroupName.trim()
        }
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/chat-group-create/`;
        setLoading(true);
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                setNewGroupName("");
                setMessage("Group created successfully");
                props.getUserChatGroups()
            })
            .catch(err=>{
                console.log(err);
                setMessage("Error creating group");
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    let submit_btn = (
        <button 
            onClick={handleCreateGroup}
            className="bg-sky-500 hover:bg-indigo-500 text-white font-semibold rounded px-4 py-2"
        >
            Submit
        </button>
    )
    if (loading) {
        submit_btn = (
            <button 
                onClick={handleCreateGroup}
                className="bg-sky-500 hover:bg-indigo-500 text-white font-semibold rounded px-4 py-2 flex justify-center"
            >
                <Spinner />
                Loading
            </button>
        )
    }

    let create_group_div = (
        <div className="rounded-md bg-slate-100 p-1 mt-1 mb-2">
            <h3 className="pl-1 pb-1 text-base text-left font-semibold truncate">Create Group</h3>
            <div className="flex justify-start items-center h-10">
                <input
                    value={newGroupName} 
                    placeholder="Type group name..." 
                    onChange={(e)=>setNewGroupName(e.target.value)} 
                    className="border border-gray-300 h-10 my-2 pl-1 mr-1"
                />
                {submit_btn}
            </div>
            <p style={{fontSize: "0.9rem"}}>{message}</p>
        </div>
    )

    return create_group_div;
}

export default CreateGroupChat;