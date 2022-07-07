import ChatContacts from "../ChatContacts/ChatContacts";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const AddMembers = (props) => {

    const token = useSelector((state)=>state.auth.token);

    // list of parents to add to group
    const [parentList, setParentList] = useState([]);

    // function to handle adding new parents to list
    const addToListHandler = (parent) => {
        // check user isn't already in list
        let userFound = false;
        parentList.forEach(p=>{
            if (p.user.id === parent.user.id) userFound = true;
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
        console.log("submitting list")
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
        axios.post(url, data_arr, {headers: headers})
            .then(res=>{
                console.log(res)
                setParentList([]);
            })
            .catch(err=>{
                console.log(err)
            })
    }

    // list of users to add to group
    let user_list = parentList.map(parent=>{
        return (
            <div key={parent.user.id} style={{margin: "10px", border: "1px solid grey", padding: "10px"}}>
                <p>{parent.user.first_name} {parent.user.last_name}</p>
                <button onClick={()=>removeFromListHandler(parent)}>remove</button>
            </div>
        )
    })
    let user_list_div = (
        <div className="add-users-inner-div">
            <h3>Users to add</h3>
            {(parentList.length > 0) ? user_list : <p>No users added to list</p>}
            {(parentList.length > 0) ? <button onClick={submitParentListHandler}>submit</button> : null}
        </div>
    )

    return (
        <div className="add-users-to-group-div">
            <h2>Add to group</h2>
            {user_list_div}
            <ChatContacts from="add_members" addToListHandler={addToListHandler}/>
        </div>
    )
}

export default AddMembers;