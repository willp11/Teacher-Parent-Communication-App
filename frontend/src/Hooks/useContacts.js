import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

export const useTeacherContacts = (token) => {

    const [contactList, setContactList] = useState(null);

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
    }, [token]);

    useEffect(()=>{
        getTeacherContacts()
    }, [getTeacherContacts])
    
    return contactList;
}