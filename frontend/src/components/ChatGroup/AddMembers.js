import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { XIcon, TrashIcon } from '@heroicons/react/outline';
import Contacts from "./Contacts";
import { useMessage } from "../../Hooks/useMessage";
import Spinner from "../Spinner/Spinner";

const AddMembers = (props) => {

    const token = useSelector((state)=>state.auth.token);
    const accountType = useSelector((state)=>state.auth.accountType);

    // list of parents to add to group
    const [parentList, setParentList] = useState([]);

    // already member error message
    const [message, setMessage] = useMessage();

    const [loading, setLoading] = useState(false);

    // function to handle adding new parents to list
    const addToListHandler = (parent) => {
        // check user isn't already in list
        let userFound = false;
        parentList.forEach(p=>{
            if (p.user.id === parent.user.id) {
                userFound = true;
                setMessage(`${parent.user.first_name} ${parent.user.last_name} is already in the list`);
            }
        })

        // check user isn't already a group member
        props.members.forEach(member=>{
            if (member.user.id === parent.user.id) {
                userFound = true;
                setMessage(`${parent.user.first_name} ${parent.user.last_name} is already in the group`);
            } 
        })

        // add user to list
        if (userFound === false) {
            let list = [...parentList];
            list.push(parent);
            setParentList(list);
            console.log(list);
        }
    }
    
    // function to remove user from list
    const removeFromListHandler = (parent) => {
        // find user in list
        let index = null;
        parentList.forEach((p, idx)=>{
            if (p.user.id === parent.user.id) index=idx;
        })
        if (index !== null) {
            let list = [...parentList];
            list.splice(index, 1);
            setParentList(list);
            console.log(list);
        }
    }

    // function to submit list
    const submitParentListHandler = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }

        // turn list of users into data required by API
        let data_arr = [];
        parentList.forEach(parent=>{
            let user = {
                user: parent.user.id,
                group: props.groupId
            }
            data_arr.push(user)
        })
        const url = `http://localhost:8000/api/v1/school/chat-group-add-members/${props.groupId}/`;
        setLoading(true)
        axios.post(url, data_arr, {headers: headers})
            .then(res=>{
                console.log(res)
                setParentList([]);
                props.getGroupMembers();
                setMessage("Users added to group successfully.")
            })
            .catch(err=>{
                console.log(err)
                setMessage("There was a problem adding users to the group.")
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    // list of users to add to group
    let user_list = parentList.map(parent=>{
        return (
            <div key={parent.user.id} className="w-48 mx-auto flex justify-between items-center bg-white rounded-md shadow-md p-1 my-4">
                <p className="p-1 font-semibold truncate">{parent.user.first_name} {parent.user.last_name}</p>
                <TrashIcon className="h-[24px] w-[24px] cursor-pointer hover:fill-red-400" onClick={()=>removeFromListHandler(parent)} />
            </div>
        )
    })
    let submit_btn = (
        <button 
            className="bg-sky-500 hover:bg-indigo-500 text-white font-semibold rounded px-4 py-1" 
            onClick={submitParentListHandler}>Submit
        </button>
    )
    if (loading) {
        submit_btn = (
            <button 
                className="bg-sky-500 hover:bg-indigo-500 text-white font-semibold rounded px-4 py-1 flex mx-auto" 
                onClick={submitParentListHandler}
            >
                <Spinner />
                Loading
            </button>
        )
    }
    let user_list_div = (
        <div className="w-full sm:w-[500px] max-h-[300px] overflow-auto bg-sky-200 rounded shadow-md p-2 mx-auto my-4">
            <h3>New Users</h3>
            {(parentList.length > 0) ? user_list : <p className="text-sm">Click + to add user to chat group</p>}
            {(parentList.length > 0) ? submit_btn : null}
            <p className="text-sm">{message}</p>
        </div>
    )

    return (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] w-screen h-screen flex items-center justify-center z-10">
            <div className="relative bg-white rounded-md shadow-md w-[calc(100%-2rem)] sm:w-[550px] h-[600px] max-h-calc(100%-2rem) p-2 overflow-auto">
                <XIcon 
                    className="absolute top-2 right-2 h-[24px] w-[24px] hover:border hover:border-gray-300 cursor-pointer"
                    onClick={props.hide}
                />
                <h2 className="pt-2">Add to group</h2>
                {user_list_div}
                <Contacts addToListHandler={addToListHandler} accountType={accountType}/>
            </div>
        </div>
    )
}

export default AddMembers;