import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

export const useContacts = (token, accountType) => {

    const [contactList, setContactList] = useState(null);
    const [loading, setLoading] = useState(false);

    const getTeacherContacts = useCallback(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/teacher-contacts-get/`;
        setLoading(true);
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setContactList(res.data.school_classes);
            })
            .catch(err=>{
                console.log(err);
            })
            .finally(()=>{
                setLoading(false);
            });
    }, [token]);

    const getParentContacts = useCallback(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/parent-contacts-get/`;
        setLoading(true);
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
            .finally(()=>{
                setLoading(false);
            });
    }, [token])

    useEffect(()=>{
        if (accountType === "teacher") getTeacherContacts()
        if (accountType === "parent") getParentContacts()
    }, [getTeacherContacts, getParentContacts, accountType])
    
    return [loading, contactList];
}