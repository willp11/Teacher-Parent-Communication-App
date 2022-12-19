import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useGroupMembers = (token, id) => {

    const [groupMembers, setGroupMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    // const groupMembersRef = useRef([]);

    // Get list of members for chat group and video chat
    // called again when adding new members from AddMembers
    const getGroupMembers = useCallback(()=>{
        setLoadingMembers(true);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = `${process.env.REACT_APP_API_URL}/api/v1/school/chat-group-members-list/${id}/`;
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setGroupMembers(res.data);
                // groupMembersRef.current = res.data;
            })
            .catch(err=>{
                console.log(err);
            })
            .finally(()=>{
                setLoadingMembers(false);
            })
    }, [token, id])

    // call again if token or id changes
    useEffect(()=>{
        getGroupMembers()
    }, [getGroupMembers])

    return {groupMembers, setGroupMembers, getGroupMembers, loadingMembers};
}