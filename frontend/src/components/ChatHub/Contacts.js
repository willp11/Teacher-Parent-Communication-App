import { useState } from "react";
import { useSelector } from "react-redux";
import { ChatIcon, VideoCameraIcon } from '@heroicons/react/outline';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContacts } from "../../Hooks/useContacts";
import { filterStudents } from "../../Utils/utils";

const Contacts = (props) => {

    const navigate = useNavigate();
    const token = useSelector((state)=>state.auth.token);
    const account = useSelector((state)=>state.auth.account);
    const contactList = useContacts(token, props.accountType);

    const [selectedClass, setSelectedClass] = useState(null);
    const [studentSearchTerm, setStudentSearchTerm] = useState("");

    // Go to direct message or video chat - finds an existing chat group / creates a new one if none exists
    const goDirectOrVideoChatHandler = (recipient, dest) => {
        let chat_group = null;
        // Check if we already have a direct message group with that user
        props.directChats.every((g)=>{
            let group = g.group;
            if (group.direct_message) {
                // found chat
                if (group.group_owner.id === recipient.user.id || group.recipient.id === recipient.user.id) {
                    chat_group = g;
                    return false;
                }
            }
            return true;
        })
        // If not, call API to create one
        if (chat_group === null) {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            }
            const data = {
                name: "direct",
                recipient: recipient.user.id
            }
            const url = 'http://localhost:8000/api/v1/school/chat-group-create-direct/';
            axios.post(url, data, {headers: headers})
                .then(res=>{
                    console.log(res);
                    let chat_id = res.data.id;
                    return navigate(`/${dest}/${chat_id}`);
                })
                .catch(err=>{
                    console.log(err);
                    // display error message
                    // TO DO
                })
        } else {
            // navigate to chat group
            let chat_id = chat_group.group.id;
            return navigate(`/${dest}/${chat_id}`);
        }
    }

    // List of classes
    let classes_list = null;
    if (contactList !== null) {
        classes_list = contactList.map((school_class) => {
            let style = "p-1 my-1 w-full border-2 border-gray-200 bg-sky-100 cursor-pointer hover:bg-indigo-500 hover:text-white rounded-md";
            if (selectedClass !== null) {
                if (selectedClass.id === school_class.id) style = "p-1 my-1 w-full border-2 border-gray-200 bg-sky-500 text-white rounded-md"
            }

            if (props.accountType === "teacher") {
                return (
                    <div
                        key={school_class.id}
                        className={style}
                        onClick={()=>setSelectedClass(school_class)}
                    >
                        <h4 className="text-base text-left font-semibold truncate">{school_class.name}</h4>
                    </div>
                )
            } else if (props.accountType === "parent") {
                return (
                    <div
                        key={school_class.id}
                        className={style}
                        onClick={()=>setSelectedClass(school_class)}
                    >
                        <h4 className="text-base text-left font-semibold truncate">{school_class.name}</h4>
                        <h4 className="text-sm text-left font-semibold truncate">{school_class.child}'s class</h4>
                        <div className="bg-white rounded-md p-1 mt-1 cursor-default">
                            <h4 className="text-xs text-left text-gray-500 font-semibold truncate">Teacher</h4>
                            <div className="flex justify-between items-center text-black">
                                <h4 className="text-sm text-left font-semibold truncate">{school_class.teacher.user.first_name} {school_class.teacher.user.last_name}</h4>
                                <div className="flex">
                                    <VideoCameraIcon className="h-[24px] w-[24px] fill-white cursor-pointer hover:fill-sky-200" onClick={()=>goDirectOrVideoChatHandler(school_class.teacher, "videoChat")} />
                                    <ChatIcon className="h-[24px] w-[24px] fill-white cursor-pointer ml-2 hover:fill-sky-200" onClick={()=>goDirectOrVideoChatHandler(school_class.teacher, "chatGroup")} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            } else {
                return null;
            }
        })
    }

    // List of parent's from selected class
    let parents_list = null;
    if (selectedClass !== null) {
        let array = selectedClass.students;

        // if student is being searched for, filter the list
        if (studentSearchTerm.length > 0) array = filterStudents(studentSearchTerm, array);
        
        parents_list = array.map((student) => {
            if (student.parent !== null) {
                // remove user from list (as can't message themselves)
                if (student.parent.user.id === account.id) return null;
                return (
                    <div 
                        key={student.id}
                        className="p-1 my-1 w-full border-2 border-gray-200 bg-sky-100 rounded-md flex flex-wrap justify-between"
                    >
                        <div>
                            <h4 className="text-base text-left font-semibold truncate">{student.name}'s parent</h4>
                            <p className="text-xs text-left text-gray-500 truncate">{student.parent.user.first_name} {student.parent.user.last_name}</p>
                        </div>
                        <div className="flex items-center">
                            <VideoCameraIcon className="h-[24px] w-[24px] fill-white cursor-pointer hover:fill-sky-200" onClick={()=>goDirectOrVideoChatHandler(student.parent, "videoChat")} />
                            <ChatIcon className="h-[24px] w-[24px] fill-white cursor-pointer ml-2 hover:fill-sky-200" onClick={()=>goDirectOrVideoChatHandler(student.parent, "chatGroup")} />
                        </div>
                    </div>
                )
            } else {
                return null;
            }
        })
    }

    let parent_div_message = (
        <div>
            <p className="text-sm pl-1">Select class to show parents list.</p>
            <p className="text-sm pl-1 pt-1">Click icon to direct message or video call.</p>
        </div>
    )

    return (
        <div className="w-full md:w-1/3 h-1/2 md:h-full border-b-2 border-gray-300 md:border-0">
            <div className="h-[2.5rem] border-b-2 border-gray-300">
                <h2 className="text-left p-1">Contacts</h2>
            </div>
            <div className="h-[calc(100%-2.5rem)] flex flex-row md:flex-col">  
                <div className="w-1/2 h-full md:w-full md:h-1/2 border-r-2 border-gray-300 md:border-r-0 md:border-b-2 p-1 overflow-x-auto">
                    <h3 className="text-left text-gray-500 text-base font-semibold pl-1">Your Classes</h3>
                    {classes_list}
                </div>
                <div className="w-1/2 h-full md:w-full md:h-1/2 p-1 overflow-x-auto">
                    <h3 className="text-left text-gray-500 text-base font-semibold pl-1">Parents</h3>
                    {selectedClass ? <input onChange={(e)=>setStudentSearchTerm(e.target.value)} placeholder="Type student..." className="border border-gray-500 p-1 rounded-md w-48 ml-1 my-2 max-w-[calc(100%-1rem)]" /> : null}
                    {selectedClass ? parents_list : parent_div_message}
                </div>
            </div>
        </div>
    )
}

export default Contacts;