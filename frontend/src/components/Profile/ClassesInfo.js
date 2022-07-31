import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useMessage } from "../../Hooks/useMessage";
import Spinner from "../Spinner/Spinner";

const ClassesInfo = (props) => {
    
    const token = useSelector((state)=>state.auth.token);

    const [newClassName, setNewClassName] = useState("");
    const [message, setMessage] = useMessage();
    const [loading, setLoading] = useState(false);

    // send POST request to create a new class
    const createClassHandler = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };
        const data = {
            name: newClassName.trim()
        }
        setLoading(true);
        axios.post('http://localhost:8000/api/v1/school/class-create/', data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getUserProfile()
                setNewClassName("");
                setMessage("Class created successfully.")
            })
            .catch(err=>{
                console.log(err);
                setMessage("There was a problem creating the class.")
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    // CLASS LIST
    let school_class_list = props.profile.teacher.school_classes.map((school_class) => {
        return (
            <Link to={"/class/"+school_class.id}>
                <div key={school_class.id} className="p-2 rounded border border-gray-300 w-64 mx-auto mb-1 bg-sky-200 hover:bg-indigo-500 hover:text-white font-bold">
                    <h4 className="text-base">{school_class.name}</h4>
                </div>
            </Link>
        )
    })

    let submit_btn = (
        <button 
            className="w-24 rounded bg-sky-500 hover:bg-indigo-500 p-2 text-white font-semibold" 
            onClick={createClassHandler}
        >
            Create
        </button>
    )
    if (loading) {
        submit_btn = (
            <button 
                className="rounded bg-sky-500 hover:bg-indigo-500 p-2 text-white font-semibold flex justify-center mx-auto" 
                onClick={createClassHandler}
                disabled
            >
                <Spinner />
                Loading
            </button>
        )
    }

    let classes_info_div = (
        <div className="rounded-md bg-white shadow-md mt-2 mb-4 p-4 min-h-[250px]">
            <h2 className="pb-4 text-md">Classes</h2>
            <div className="mb-6">
                <div className="w-full flex justify-center items-center">
                    <input 
                        className="p-2 border border-gray-300 w-48 sm:w-64 mr-2 h-10" 
                        value={newClassName} 
                        onChange={(e)=>setNewClassName(e.target.value)} 
                        placeholder="Type class name..."
                    />
                    {submit_btn}
                </div>
                <p className="text-sm">{message}</p>
            </div>
            {school_class_list}
        </div>
    )

    return classes_info_div;
}

export default ClassesInfo;