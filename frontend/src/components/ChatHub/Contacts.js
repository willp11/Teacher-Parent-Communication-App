import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { ChatIcon, VideoCameraIcon } from '@heroicons/react/outline';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Contacts = (props) => {

    const token = useSelector((state)=>state.auth.token);
    const navigate = useNavigate();

    const [contactList, setContactList] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);

    // Get a teacher's chat contacts
    const getTeacherContacts = useCallback(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/teacher-contacts-get/';
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setContactList(res.data.school_classes);
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token])

    // Send a direct message to a user - finds an existing chat group / creates a new one if none exists
    const sendDirectMessageHandler = (parent) => {
        let chat_group = null;
        // Check if we already have a direct message group with that user
        props.groupsMemberOf.every((g)=>{
            let group = g.group;
            if (group.direct_message) {
                // found chat
                if (group.group_owner.id === parent.user.id || group.recipient.id === parent.user.id) {
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
                recipient: parent.user.id
            }
            const url = 'http://localhost:8000/api/v1/school/chat-group-create-direct/';
            axios.post(url, data, {headers: headers})
                .then(res=>{
                    console.log(res);
                    let chat_id = res.data.id;
                    return navigate(`/chatGroup/${chat_id}`);
                })
                .catch(err=>{
                    console.log(err);
                    // display error message
                    // TO DO
                })
        } else {
            // navigate to chat group
            let chat_id = chat_group.group.id;
            return navigate(`/chatGroup/${chat_id}`);
        }
    }

    // On component mount - get all user's contacts
    useEffect(()=>{
        getTeacherContacts()
    }, [getTeacherContacts])


    // List of teacher's classes
    let classes_list = contactList.map((school_class) => {
        let style = "p-1 my-1 w-full border-2 border-gray-200 bg-sky-100 cursor-pointer hover:bg-indigo-500 hover:text-white rounded-md";
        if (selectedClass !== null) {
            if (selectedClass.id === school_class.id) style = "p-1 my-1 w-full border-2 border-gray-200 bg-sky-500 text-white rounded-md"
        }
        return (
            <div
                key={school_class.id}
                className={style}
                onClick={()=>setSelectedClass(school_class)}
            >
                <h4 className="text-base text-left font-semibold truncate">{school_class.name}</h4>
            </div>
        )
    })

    // List of parent's from selected class
    let parents_list = null;
    if (selectedClass !== null) {
        parents_list = selectedClass.students.map((student) => {
            if (student.parent !== null) {
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
                            <VideoCameraIcon className="h-[24px] w-[24px] fill-white cursor-pointer" />
                            <ChatIcon className="h-[24px] w-[24px] fill-white cursor-pointer ml-2" onClick={()=>sendDirectMessageHandler(student.parent)} />
                        </div>
                    </div>
                )
            } else {
                return null;
            }
        })
    }

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
                    {selectedClass ? parents_list : <p className="text-sm pl-1">Select class to show parents list.</p>}
                </div>
            </div>
        </div>
    )
}

export default Contacts;