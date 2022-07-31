import AddMembers from './AddMembers';
import { useState } from 'react';

const MemberList = (props) => {

    const [showAddMembers, setShowAddMembers] = useState(false);

    let member_list = props.members.map((member)=>{
        return (
            <div key={member.user.id}>
                <p>{member.user.first_name} {member.user.last_name}</p>
            </div>
        )
    })
    
    let add_member_btn = (
        <button 
            onClick={()=>setShowAddMembers(true)} 
            className="bg-sky-500 hover:bg-indigo-500 text-white font-semibold rounded px-4 py-1 my-2"
        >
            Add Members
        </button>
    )

    let member_list_div = (
        <div className="w-full sm:w-[500px] max-h-[200px] overflow-auto bg-white p-2 mb-2 mt-4 border border-gray-600 shadow-lg">
            <h2>Group Members</h2>
            {props.direct ? null : add_member_btn}
            {member_list}
            {showAddMembers ? <AddMembers groupId={props.groupId} members={props.members} getGroupMembers={props.getGroupMembers} hide={()=>setShowAddMembers(false)} /> : null}
        </div>
    )

    return member_list_div;
}

export default MemberList;