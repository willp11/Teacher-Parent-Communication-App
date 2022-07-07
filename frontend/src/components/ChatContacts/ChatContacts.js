import './ChatContacts.css';
import {useState, useEffect, useCallback} from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ChatContacts = () => {

    const token = useSelector((state)=>state.auth.token);

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

    // ON COMPONENT MOUNT - GET CONTACTS
    useEffect(()=>{
        getTeacherContacts();
    }, [getTeacherContacts])

    // SEARCH DIVS
    // search inputs
    let search_students_div = null;
    if (contactList) {
        search_students_div = (
            <div className="search-contacts-div">
                <h3>Search</h3>
                <input placeholder="Class Name" onChange={(e)=>setClassNameSearch(e.target.value)} />
                <input placeholder="Student Name" onChange={(e)=>setStudentNameSearch(e.target.value)} />
                <button onClick={()=>searchStudents(classNameSearch, studentNameSearch)}>Submit</button>
            </div>
        )
    }
    // search results
    let search_results_div = null;
    if (studentFound) {
        let parent = <p>This student has no parent account.</p>;
        if (studentFound.parent !== null) {
            parent = <p><b>Parent:</b> {studentFound.parent.user.first_name} {studentFound.parent.user.last_name}</p>
        }
    
        search_results_div = (
            <div>
                <h3>Search Results</h3>
                <button onClick={searchGoBack}>Go Back</button> <br/>
                <div style={{border: "1px solid grey", marginTop: "10px"}} >
                    <p><b>Student: </b><Link to={`/studentProfile/${studentFound.id}`}>{studentFound.name}</Link></p>
                    {parent}
                </div>
            </div>
        )
    } else {
        search_results_div = (
            <div>
                <h3>Search Results</h3>
                <button onClick={searchGoBack}>Go Back</button> <br/>
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
                    parent = <p><b>Parent:</b> {student.parent.user.first_name} {student.parent.user.last_name}</p>
                }
                return (
                    <div style={{border: "1px solid grey"}} key={student.id} >
                        <p><b>Student: </b><Link to={`/studentProfile/${student.id}`}>{student.name}</Link></p>
                        {parent}
                    </div>
                )
            })
            return (
                <div key={school_class.id}>
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

    return (
        <div className="ChatContacts">
            <h2>Contacts</h2>
            {showSearchResults ? search_results_div : search_and_contacts_div}
        </div>
    )
}

export default ChatContacts;