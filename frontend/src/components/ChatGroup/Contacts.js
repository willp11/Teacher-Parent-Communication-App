import { useState } from "react";
import { useSelector } from "react-redux"
import {useTeacherContacts} from '../../Hooks/useContacts';
import { PlusIcon } from "@heroicons/react/outline";
import { filterStudents } from "../../Utils/utils";

const Contacts = (props) => {

    let token = useSelector((state)=>state.auth.token);
    const contactList = useTeacherContacts(token);

    const [selectedClass, setSelectedClass] = useState(null);
    const [studentSearchTerm, setStudentSearchTerm] = useState("");

    // List of teacher's classes
    let classes_list = null;
    if (contactList !== null) {
        classes_list = contactList.map((school_class) => {
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
    }

    // List of parent's from selected class
    let parents_list = null;
    if (selectedClass !== null) {

        let array = selectedClass.students;

        // if student is being searched for, filter the list
        if (studentSearchTerm.length > 0) array = filterStudents(studentSearchTerm, array);
        
        parents_list = array.map((student) => {
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
                            <PlusIcon className="h-[24px] w-[24px] fill-white cursor-pointer ml-2 hover:stroke-sky-500" onClick={()=>props.addToListHandler(student.parent)} />
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
            <p className="text-sm text-left pl-1">Select class to show parents list.</p>
            <p className="text-sm text-left pl-1 pt-1">Click icon to add user to group.</p>
        </div>
    )
    
    return (
        <div className="w-full border-b-2 border-gray-300 md:border-0">
            <div className="h-[2.5rem] border-b-2 border-gray-300">
                <h2 className="text-left p-1">Contacts</h2>
            </div>
            <div className="h-[calc(100%-2.5rem)] flex flex-col">  
                <div className="w-full h-1/2 border-gray-300 border-r-0 border-b-2 p-1 overflow-x-auto">
                    <h3 className="text-left text-gray-500 text-base font-semibold pl-1">Your Classes</h3>
                    {classes_list}
                </div>
                <div className="w-full h-1/2 p-1 overflow-x-auto flex flex-col align-start">
                    <h3 className="text-left text-gray-500 text-base font-semibold pl-1">Parents</h3>
                    {selectedClass ? <input onChange={(e)=>setStudentSearchTerm(e.target.value)} placeholder="Type student..." className="border border-gray-500 p-1 rounded-md w-48 ml-1 my-2" /> : null}
                    {selectedClass ? parents_list : parent_div_message}
                </div>
            </div>
        </div>
    )
}

export default Contacts;