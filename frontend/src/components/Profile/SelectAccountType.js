import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const SelectAccountType = (props) => {

    const token = useSelector((state)=>state.auth.token);

    const [selectedAccountType, setSelectedAccountType] = useState(null);
    const [inviteCode, setInviteCode] = useState("");

    // CREATE PARENT - SUBMIT INVITE CODE
    const handleSubmitInviteCode = (invite_code) => {
        
        // send POST request to create parent account
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };
        const data = {
            invite_code
        }
        axios.post('http://localhost:8000/api/v1/school/parent-create/', data, {headers: headers})
            .then(res=>{
                console.log(res);
                if (res.status === 201) {
                    props.getUserProfile()
                    console.log("Created parent account")
                }
            })
            .catch(err=>{
                console.log(err);
            })
    }

    // CREATE TEACHER ACCOUNT
    const handleSubmitCreateTeacher = () => {
        // send POST request to create teacher account
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };
        const data = {
            school: null
        }
        axios.post('http://localhost:8000/api/v1/school/teacher-create/', data, {headers: headers})
            .then(res=>{
                console.log(res);
                if (res.status === 201) {
                    props.getUserProfile()
                }
            })
            .catch(err=>{
                console.log(err);
            })
    }

    // Select Teacher or Parent account type
    let submit_btn = null;
    let invite_code_div = null;
    if (selectedAccountType === 'teacher') {
        submit_btn = (
            <button 
                className="w-24 rounded bg-sky-500 hover:bg-indigo-500 p-2 text-white font-semibold" 
                onClick={handleSubmitCreateTeacher}
            >
                Submit
            </button>
        )
    } else if (selectedAccountType === 'parent') {
        invite_code_div = (
            <div>
                <h2 className="pb-2 text-gray-600 text-sm">Invite Code</h2>
                <input 
                    placeholder="Type invite code..." 
                    onChange={(e)=>setInviteCode(e.target.value)}
                    className="p-2 border border-gray-300 h-10"
                />
                <button 
                    onClick={()=>handleSubmitInviteCode(inviteCode)}
                    className="w-24 rounded bg-sky-500 hover:bg-indigo-500 p-2 text-white font-semibold ml-2"
                >
                    Submit
                </button>
            </div>
        )
    }
    let select_account_type_div = (
        <div className="rounded shadow-md mb-2 bg-white p-4">
            <h2 className="text-md">Select Account Type</h2>
            <div className="flex items-center justify-center m-2">
                <div 
                    className={selectedAccountType === 'teacher' ? "selected" : "unselected cursor-pointer"}
                    onClick={()=>setSelectedAccountType('teacher')}>Teacher</div>
                <div 
                    className={selectedAccountType === 'parent' ? "selected" : "unselected cursor-pointer"}
                    onClick={()=>setSelectedAccountType('parent')}>Parent</div>
            </div>
            {submit_btn}
            {invite_code_div}
        </div>
    )

    return select_account_type_div;
}

export default SelectAccountType;