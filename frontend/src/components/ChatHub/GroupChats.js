import CreateGroupChat from "./CreateGroupChat";
import { Link } from "react-router-dom";

const GroupChats = (props) => {

    // list of group chats
    let group_chat_list = props.groupChats.map(g=>{
        let group = g.group;
        // show 5 members of group
        let group_members_string = "";
        group.chat_members.every((member, idx, arr)=>{
            if (idx < 5) {
                group_members_string += `${member.user.first_name} ${member.user.last_name}`;
                if (idx !== arr.length-1) {
                    group_members_string += ", "
                }
                return true;
            } else if (idx === 5) {
                group_members_string += "..."
                return false;
            }
            return true;
        })

        return (
            <div className="rounded bg-sky-100 shadow-md p-2 mb-2" key={group.id}>
                <h4 className="pb-1 text-left pl-2 w-fit"><Link className="text-blue-700 underline" to={`/chatGroup/${group.id}`}>{group.name}</Link></h4>
                <p className="text-sm p-1"><span className="font-bold">Members: </span><span>{group_members_string}</span></p>
            </div>
        )
    })    

    return (
        <div className="w-full md:w-2/3 h-1/2 md:h-full md:border-l-2 md:border-gray-300">
            <div className="h-[2.5rem] border-b-2 border-gray-300">
                <h2 className="text-left p-1">Group Chats</h2>
            </div>
            <div className="h-[calc(100%-2.5rem)] flex flex-row md:flex-col overflow-x-auto">  
                <div className="w-full h-full p-1 overflow-x-auto">
                    <CreateGroupChat getUserChatGroups={props.getUserChatGroups} />
                    {group_chat_list}

                </div>
            </div>     
        </div>
    )
}

export default GroupChats;