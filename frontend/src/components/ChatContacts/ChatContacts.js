import './ChatContacts.css';
import {useState, useEffect, useCallback} from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ChatContacts = (props) => {

    const token = useSelector((state)=>state.auth.token);
    const navigate = useNavigate();

    // list of all classes with student lists nested inside that contain parent info
    const [contactList, setContactList] = useState(null);

    // student and class names to search for
    const [classNameSearch, setClassNameSearch] = useState("");
    const [studentNameSearch, setStudentNameSearch] = useState("");

    // show search results
    const [studentFound, setStudentFound] = useState(null);
    const [showSearchResults, setShowSearchResults] = useState(false);

    // FUNCTION SEARCH CONTACTS
    // find student, given class and student's name
    const searchStudents = (className, studentName) => {
        let student = null;
        // trim whitespace
        className = className.trim()
        studentName = studentName.trim()

        contactList.school_classes.forEach((schoolClass)=>{
            if (schoolClass.name === className) {
                // found className
                schoolClass.students.forEach((stud) => {
                    // found student
                    if (stud.name === studentName) {
                        student = stud;
                    }
                })
            }
        })

        setStudentFound(student);
        setShowSearchResults(true);
        return student;
    }
    // search go back button
    const searchGoBack = () => {
        setShowSearchResults(false);
        setStudentFound(null);
        setClassNameSearch("");
        setStudentNameSearch("");
    }

    // FUNCTION GET ALL USER'S CONTACTS
    const getTeacherContacts = useCallback(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/teacher-contacts-get/';
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setContactList(res.data);
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token])

    // FUNCTION SEND MESSAGE TO USER
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

    // ON COMPONENT MOUNT - GET CONTACTS
    useEffect(()=>{
        getTeacherContacts();
    }, [getTeacherContacts])

    // SEARCH DIVS
    // search inputs
    let search_students_div = null;
    if (contactList) {
        search_students_div = (
            <div className="rounded bg-sky-100 shadow-md px-2 pt-2 pb-4 mb-4">
                <h3 className="mb-2">Search</h3>
                <input 
                    placeholder="Type class name..." 
                    onChange={(e)=>setClassNameSearch(e.target.value)}
                    className="border border-gray-300 h-8 mb-2"
                /> <br />
                <input 
                    placeholder="Type student name..." 
                    onChange={(e)=>setStudentNameSearch(e.target.value)} 
                    className="border border-gray-300 h-8 mb-2"
                /> <br/>
                <button
                    onClick={()=>searchStudents(classNameSearch, studentNameSearch)}
                    className="border-px shadow-md shadow-gray-500 bg-sky-500 hover:bg-indigo-500 text-white font-bold rounded-full px-4 py-1"
                >
                    Submit
                </button>
            </div>
        )
    }
    // search results
    let search_results_div = null;
    if (studentFound) {
        let parent = <p>This student has no parent account.</p>;
        if (studentFound.parent !== null) {
            let btn_style = "border-px shadow-md shadow-gray-500 bg-sky-500 hover:bg-indigo-500 text-white font-bold rounded-full px-4 py-1 my-2"
            parent = (
                <div>
                    <p><b>Parent:</b> {studentFound.parent.user.first_name} {studentFound.parent.user.last_name}</p>
                    {props.from === "add_members" ? <button className={btn_style} onClick={()=>props.addToListHandler(studentFound.parent)}>Add to Group</button> : null}
                    {props.from === "chat_hub" ? <button className={btn_style}>Send Message</button> : null}
                </div>
            )
        }
    
        search_results_div = (
            <div className="rounded bg-sky-100 shadow-md p-2">
                <h3>Search Results</h3>
                <button
                    onClick={searchGoBack}
                    className="border-px shadow-md shadow-gray-500 bg-sky-500 hover:bg-indigo-500 text-white font-bold rounded-full px-4 py-1 my-2"
                >
                    Go Back
                </button> <br/>
                <div className="w-full bg-white rounded shadow-md p-2 my-2">
                    <p><b>Student: </b><Link className="text-blue-700 underline" to={`/studentProfile/${studentFound.id}`}>{studentFound.name}</Link></p>
                    {parent}
                </div>
            </div>
        )
    } else {
        search_results_div = (
            <div>
                <h3>Search Results</h3>
                <button 
                    className="border-px shadow-md shadow-gray-500 bg-sky-500 hover:bg-indigo-500 text-white font-bold rounded-full px-4 py-1 my-2" 
                    onClick={searchGoBack}
                >
                    Go Back
                </button> <br/>
                <div style={{border: "1px solid grey", marginTop: "10px"}} >
                    <p>No student found.</p>
                </div>
            </div>
        )
    }

    // SCHOOL CLASSES DIV
    let school_classes_div = null;
    if (contactList) {
        school_classes_div = contactList.school_classes.map(school_class => {
            let students = school_class.students.map(student => {
                let parent = <p>This student has no parent account.</p>;
                if (student.parent !== null) {
                    let btn_style = "border-px shadow-md shadow-gray-500 bg-sky-500 hover:bg-indigo-500 text-white font-bold rounded-full px-4 py-1 my-2"
                    parent = (
                        <div>
                            <p><b>Parent:</b> {student.parent.user.first_name} {student.parent.user.last_name}</p>
                            {props.from === "add_members" ? <button className={btn_style} onClick={()=>props.addToListHandler(student.parent)}>Add to group</button> : null}
                            {props.from === "chat_hub" ? <button className={btn_style} onClick={()=>sendDirectMessageHandler(student.parent)}>Send Message</button> : null}
                        </div>
                    )
                }
                return (
                    <div className="w-full sm:w-96 mx-auto my-2 shadow-md bg-white rounded-lg p-2" key={student.id} >
                        <p><b>Student: </b><Link to={`/studentProfile/${student.id}`} className="text-blue-700 underline">{student.name}</Link></p>
                        {parent}
                    </div>
                )
            })
            return (
                <div key={school_class.id} className="rounded bg-sky-100 shadow-md p-2 mt-2">
                    <h3>{school_class.name}</h3>
                    {students}
                </div>
            )
        })
    }

    // Search inputs and contact list in same div - show when no student is found
    let search_and_contacts_div = (
        <div>
            {search_students_div}
            {school_classes_div}
        </div>
    )

    let div_style_from_hub = "w-full sm:w-[600px] h-full overflow-auto rounded-md shadow-md shadow-gray-500 bg-sky-200 text-center mt-2 mb-4 sm:m-4 mx-auto p-4";
    let div_style_from_add = "w-full sm:w-[600px] h-[300px] overflow-auto border-2 border-gray-600 rounded-md shadow-md shadow-gray-500 bg-sky-200 text-center mt-2 mb-4 sm:m-4 mx-auto p-4";

    return (
        <div className={props.from === "add_members" ? div_style_from_add : div_style_from_hub}>
            <h2 className="pb-2">Contacts</h2>
            {showSearchResults ? search_results_div : search_and_contacts_div}
        </div>
    )
}

export default ChatContacts;