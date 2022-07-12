import './CreateChatGroup.css';
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';

const CreateChatGroup = (props) => {
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
        <div className="rounded bg-sky-100 shadow-md px-2 pt-2 pb-4 mb-4">
            <h3 className="pb-2">Create Chat Group</h3>
            <input
                value={newGroupName} 
                placeholder="Type group name..." 
                onChange={(e)=>setNewGroupName(e.target.value)} 
                className="border border-gray-300 h-8 mb-2"
            /> <br/>
            <button 
                onClick={handleCreateGroup}
                className="border-px shadow-md shadow-gray-500 bg-sky-500 hover:bg-indigo-500 text-white font-bold rounded-full px-4 py-1"
            >
                Submit
            </button>
            <p style={{fontSize: "0.9rem"}}>{message}</p>
        </div>
    )

    return create_group_div;
}

export default CreateChatGroup;