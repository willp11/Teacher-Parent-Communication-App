import './SchoolClass.css';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Navigation from '../Navigation/Navigation';
import Announcements from '../Announcements/Announcement';
import Events from '../Events/Events';
import Stories from '../Stories/Stories';
import Students from '../Students/Students';
import Assignments from '../Assignments/Assignments';

const SchoolClass = () => {

    const { id } = useParams();
    const token = useSelector((state) => state.auth.token);
    const [schoolClass, setSchoolClass] = useState(null);
    const [componentToShow, setComponentToShow] = useState("classroom")

    // GET CLASS DATA FUNCTION
    const getClassInfo = useCallback(() => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/class/' + id + '/';
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setSchoolClass(res.data)
            })
            .catch(err => {
                console.log(err);
            })
    }, [token, id])

    // ON MOUNT - GET SCHOOL CLASS DATA
    useEffect(()=>{
        getClassInfo();
    }, [getClassInfo])

    // DELETE FUNCTION - Deletes Announcements, Events, Stories or Students - e.g. model="announcements"
    const handleDelete = (id, model) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/' + model + '-delete/' + id + '/';
        axios.delete(url, {headers: headers})
            .then(res=>{
                console.log(res);
                getClassInfo();
            })
            .catch(err => {
                console.log(err);
            })
    }

    // JSX
    let school_class_div = null;
    if (schoolClass !== null) {
        school_class_div = (
            <div className="w-full flex flex-col items-center justify-center">
                <div className="w-full bg-sky-200 text-center py-2">
                    <h1>{schoolClass.name}</h1>
                    <p className="text-lg pb-2"><b>Teacher: </b>{schoolClass.teacher.user.first_name + " " + schoolClass.teacher.user.last_name}</p>
                </div>
                <div className="py-2">
                    <span 
                        className={componentToShow === "classroom" ? "classMenuSelected": "classMenuUnselected"}
                        onClick={()=>setComponentToShow("classroom")}
                    >
                        Classroom
                    </span>
                    <span 
                        className={componentToShow === "stories" ? "classMenuSelected": "classMenuUnselected"}
                        onClick={()=>setComponentToShow("stories")}
                    >
                        Stories
                    </span>
                    <span className="classMenuUnselected">Events</span>
                    <span className="classMenuUnselected">Announcements</span>
                </div>

                <div className="w-full">
                    {componentToShow === "classroom" ? <Students getClassInfo={getClassInfo} students={schoolClass.students} handleDelete={handleDelete} classId={schoolClass.id} /> : null}
                    {componentToShow === "stories" ? <Stories getClassInfo={getClassInfo} stories={schoolClass.stories} handleDelete={handleDelete} classId={schoolClass.id} /> : null}
                </div>
                {/* <div className="FlexRowCentered">
                    <Events getClassInfo={getClassInfo} events={schoolClass.events} handleDelete={handleDelete} classId={schoolClass.id}/>
                    <Announcements getClassInfo={getClassInfo} announcements={schoolClass.announcements} handleDelete={handleDelete} classId={schoolClass.id}/> 
                    <Stories getClassInfo={getClassInfo} stories={schoolClass.stories} handleDelete={handleDelete} classId={schoolClass.id} />
                    <Students getClassInfo={getClassInfo} students={schoolClass.students} handleDelete={handleDelete} classId={schoolClass.id} />
                    <Assignments getClassInfo={getClassInfo} assignments={schoolClass.assignments} students={schoolClass.students} handleDelete={handleDelete} 
                        classId={schoolClass.id} />
                </div> */}
                
            </div>
        )
    }

    return (
        <div className="relative bg-white overflow-hidden min-h-screen">
            <Navigation />
            {school_class_div}
        </div>
    );
}

export default SchoolClass;