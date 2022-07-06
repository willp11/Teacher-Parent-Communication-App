import './ChatContacts.css';
import {useState, useEffect, useCallback} from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ChatContacts = () => {

    const token = useSelector((state)=>state.auth.token);

    const [contactList, setContactList] = useState(null);

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
                        <p><b>Student:</b> {student.name}</p>
                        {parent}
                    </div>
                )
            })
            return (
                <div key={school_class.id}>
                    {students}
                </div>
            )
        })
    }

    return (
        <div className="ChatContacts">
            <h2>Contacts</h2>
            {school_classes_div}
        </div>
    )
}

export default ChatContacts;