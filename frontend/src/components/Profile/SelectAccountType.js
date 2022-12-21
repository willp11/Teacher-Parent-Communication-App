import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import SubmitBtn from "../UI/SubmitBtn";

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
    if (selectedAccountType) {
        let clickHandler;
        if (selectedAccountType === 'teacher') {
            clickHandler = handleSubmitCreateTeacher;
        } else if (selectedAccountType === 'parent') {
            clickHandler = handleSubmitCreateParent;
        }
        submit_btn = (
            <SubmitBtn
                loading={loading}
                clickHandler={clickHandler}
                textContent="Submit"
            />
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
            <div className="flex justify-center">
                {submit_btn}
            </div>
        </div>
    )

    return select_account_type_div;
}

export default SelectAccountType;