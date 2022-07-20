import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';

const CreateGroupChat = (props) => {
    const token = useSelector((state)=>state.auth.token);
    const [newGroupName, setNewGroupName] = useState("");
    const [message, setMessage] = useState("");
    const [countMsgUpdates, setCountMsgUpdates] = useState(0); // stops useEffect getting called again when message is updated

    useEffect(()=>{
        const remove_msg = setTimeout(()=>{
            setMessage("");
        }, 5000)
        return () => {
            clearTimeout(remove_msg);
        }
    }, [countMsgUpdates])

    const handleCreateGroup = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            name: newGroupName.trim()
        }
        const url = "http://localhost:8000/api/v1/school/chat-group-create/"
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                setNewGroupName("");
                setMessage("Group created successfully");
                setCountMsgUpdates(countMsgUpdates+1);
                props.getUserChatGroups()
            })
            .catch(err=>{
                console.log(err);
                setMessage("Error creating group");
            })
    }

    let create_group_div = (
        <div className="rounded-md bg-slate-100 p-1 mt-1 mb-2">
            <h3 className="pl-1 text-base text-left font-semibold truncate">Create Group</h3>
            <input
                value={newGroupName} 
                placeholder="Type group name..." 
                onChange={(e)=>setNewGroupName(e.target.value)} 
                className="border border-gray-300 h-10 my-2 pl-1 mr-1"
            />
            <button 
                onClick={handleCreateGroup}
                className="bg-sky-500 hover:bg-indigo-500 text-white font-bold rounded-full px-4 py-1 border-2 border-black"
            >
                Submit
            </button>
            <p style={{fontSize: "0.9rem"}}>{message}</p>
        </div>
    )

    return create_group_div;
}

export default CreateGroupChat;