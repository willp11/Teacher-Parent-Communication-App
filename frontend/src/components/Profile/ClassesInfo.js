import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ClassesInfo = (props) => {
    
    const token = useSelector((state)=>state.auth.token);

    const [newClassName, setNewClassName] = useState("");

    // send POST request to create a new class
    const createClassHandler = () => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        };
        const data = {
            name: newClassName.trim()
        }
        axios.post('http://localhost:8000/api/v1/school/class-create/', data, {headers: headers})
            .then(res=>{
                console.log(res);
                if (res.status === 201) {
                    props.getUserProfile()
                    setNewClassName("");
                }
            })
            .catch(err=>{
                console.log(err);
            })
    }

    // CLASS LIST
    let school_class_list = props.profile.teacher.school_classes.map((school_class) => {
        return (
            <div key={school_class.id} className="p-2 border border-gray-300 w-64 mx-auto mb-1 bg-sky-200 hover:bg-indigo-500 hover:text-white font-bold">
                <Link to={"/class/"+school_class.id}><h4 className="text-sm">{school_class.name}</h4></Link>
            </div>
        )
    })

    let classes_info_div = (
        <div className="rounded-md bg-white shadow-md mt-2 mb-4 p-4 min-h-[250px]">
            <h2 className="pb-4 text-md">Classes</h2>
            <div className="mb-6">
                <input 
                    className="p-2 border border-gray-300 w-48 sm:w-64 mr-2 h-10" 
                    value={newClassName} 
                    onChange={(e)=>setNewClassName(e.target.value)} 
                    placeholder="Type class name..."
                />
                <button 
                    className="rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-2 text-white font-bold border-2 border-black text-sm" 
                    onClick={createClassHandler}
                >
                    Create
                </button>
            </div>
            
            {school_class_list}
        </div>
    )

    return classes_info_div;
}

export default ClassesInfo;