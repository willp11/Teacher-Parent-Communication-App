import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Spinner from "../Spinner/Spinner";

const SelectAccountType = (props) => {

    const token = useSelector((state)=>state.auth.token);
    const account = useSelector((state)=>state.auth.account);

    const [selectedAccountType, setSelectedAccountType] = useState(null);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/school/parent-create/`, data, {headers: headers})
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
            .finally(()=>{
                setLoading(false);
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
        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/school/teacher-create/`, data, {headers: headers})
            .then(res=>{
                console.log(res);
                if (res.status === 201) {
                    props.getUserProfile()
                }
            })
            .catch(err=>{
                console.log(err);
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    // Select Teacher or Parent account type
    let submit_btn = null;
    if (selectedAccountType === 'teacher') {
        submit_btn = (
            <button 
                className="w-24 flex justify-center items-center rounded bg-sky-500 hover:bg-indigo-500 p-2 text-white font-semibold" 
                onClick={handleSubmitCreateTeacher}
            >
                {loading ? <Spinner /> : null}
                Submit
            </button>
        )
    } else if (selectedAccountType === 'parent') {
        submit_btn = (
            <button 
                className="w-24 flex justify-center items-center rounded bg-sky-500 hover:bg-indigo-500 p-2 text-white font-semibold" 
                onClick={handleSubmitCreateParent}
            >
                {loading ? <Spinner /> : null}
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
                {submit_btn}
            </div>
        </div>
    )

    return select_account_type_div;
}

export default SelectAccountType;