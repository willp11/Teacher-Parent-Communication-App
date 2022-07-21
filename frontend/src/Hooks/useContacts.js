import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

export const useContacts = (token, accountType) => {

    const [contactList, setContactList] = useState(null);

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

    const getParentContacts = useCallback(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/parent-contacts-get/';
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                let school_classes = [];
                res.data.children.forEach((child)=>{
                    let class_obj = {...child.school_class};
                    class_obj.child = child.name;
                    school_classes.push(class_obj);
                })
                setContactList(school_classes);
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token])

    useEffect(()=>{
        if (accountType === "teacher") getTeacherContacts()
        if (accountType === "parent") getParentContacts()
    }, [getTeacherContacts, getParentContacts, accountType])
    
    return contactList;
}