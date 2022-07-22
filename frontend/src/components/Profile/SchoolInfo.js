import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const SchoolInfo = (props) => {

    const token = useSelector((state)=>state.auth.token);

    const [selectedSchool, setSelectedSchool] = useState("");

    // Handler to send request to change teacher's school
    const submitSelectSchoolHandler = () => {
        if (selectedSchool !== "" && props.profile.teacher !== null) {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token
            };
            const data = {
                school: selectedSchool,
            };
            axios.put('http://localhost:8000/api/v1/school/teacher-school-update/', data, {headers: headers})
                .then(res => {
                    console.log(res);
                    props.getUserProfile();
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    // SCHOOL LIST DROPDOWN
    let dropdown_items = props.schools.map((school)=>{
        return (
            <option key={school.id} value={school.id}>{school.name}</option>
        );
    })
    let dropdown = (
        <select className="border border-gray-300 cursor-pointer mr-2" value={selectedSchool} onChange={e=>setSelectedSchool(e.target.value)}>
            <option value={null}>Select School</option>
            {dropdown_items}
        </select>
    )
    let select_school_div = (
        <div className="pb-2">
            {dropdown} <br/>
            <button className="border-2 border-black rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-1 mt-2 text-white text-sm font-semibold" onClick={submitSelectSchoolHandler}>Submit</button>
        </div>
    )

    let school_info_div = (
        <div className="rounded-md shadow-md bg-white mt-2 mb-4 p-4 min-h-[250px]">
            <h2 className="text-md pb-2">School</h2>
            <p className="pb-4">{props.profile.teacher.school === null ? "You do not have a school yet!" : props.profile.teacher.school.name}</p>
            {select_school_div}
        </div>
    )

    return school_info_div;
}

export default SchoolInfo;