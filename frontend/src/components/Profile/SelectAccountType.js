import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const SelectAccountType = (props) => {

    const token = useSelector((state)=>state.auth.token);
    const account = useSelector((state)=>state.auth.account);

    const [selectedAccountType, setSelectedAccountType] = useState(null);

    // CREATE PARENT - SUBMIT INVITE CODE
    const handleSubmitCreateParent = () => {
        
        // send POST request to create parent account
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };
        const data = {
            user: account.id
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
        submit_btn = (
            <button 
                className="w-24 rounded bg-sky-500 hover:bg-indigo-500 p-2 text-white font-semibold" 
                onClick={handleSubmitCreateParent}
            >
                Submit
            </button>
        )
    }
    let select_account_type_div = (
        <div className="rounded shadow-md mb-2 bg-white p-4">
            <h2 className="text-md">Select Account Type</h2>
            <div className="flex items-center justify-center m-2">
                <div 
                    className={selectedAccountType === 'teacher' ? "selected" : "unselected cursor-pointer hover:bg-sky-500 hover:text-white hover:font-semibold"}
                    onClick={()=>setSelectedAccountType('teacher')}>Teacher</div>
                <div 
                    className={selectedAccountType === 'parent' ? "selected" : "unselected cursor-pointer hover:bg-sky-500 hover:text-white hover:font-semibold"}
                    onClick={()=>setSelectedAccountType('parent')}>Parent</div>
            </div>
            {submit_btn}
        </div>
    )

    return select_account_type_div;
}

export default SelectAccountType;