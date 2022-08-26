import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Navigation from '../Navigation/Navigation';
import Announcements from '../Announcements/Announcements';
import Events from '../Events/Events';
import Stories from '../Stories/Stories';
import Students from '../Students/Students';
import Assignments from '../Assignments/Assignments';
import { createMenuDiv } from '../../Utils/utils';

const teacher_menu_items = ["Classroom", "Stories", "Announcements", "Events", "Assignments"]
const parent_menu_items = ["Stories", "Announcements", "Events"]

const SchoolClass = () => {

    const { id } = useParams();
    const token = useSelector((state) => state.auth.token);
    const accountType = useSelector((state) => state.auth.accountType);

    const [schoolClass, setSchoolClass] = useState(null);
    const [componentToShow, setComponentToShow] = useState("Stories");

    // sort the stories, announcements, events
    // const schoolClass = useMemo(()=>{
    //     let sortedData = {...schoolClassData};
    //     console.log(sortedData);
    //     return sortedData;
    // }, [schoolClassData])

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

        // create menu - depends on if teacher or parent account
        let menu_items = [];
        if (accountType === "teacher") {
            menu_items = teacher_menu_items;
        } else if (accountType === "parent") {
            menu_items = parent_menu_items;
        }
        let menu_div = createMenuDiv(menu_items, componentToShow, setComponentToShow)

        school_class_div = (
            <div className="w-full flex flex-col items-center justify-center">
                <div className="w-full bg-indigo-500 text-center py-2">
                    <h1 className="text-white">{schoolClass.name}</h1>
                    <p className="text-lg font-bold text-sky-100">{schoolClass.teacher.user.first_name + " " + schoolClass.teacher.user.last_name}</p>
                </div>

                <div className="w-full">
                    {menu_div}
                    {componentToShow === "Classroom" ? <Students getClassInfo={getClassInfo} students={schoolClass.students} handleDelete={handleDelete} classId={schoolClass.id} /> : null}
                    {componentToShow === "Stories" ? <Stories getClassInfo={getClassInfo} stories={schoolClass.stories} handleDelete={handleDelete} classId={schoolClass.id} /> : null}
                    {componentToShow === "Announcements" ? <Announcements getClassInfo={getClassInfo} announcements={schoolClass.announcements} handleDelete={handleDelete} classId={schoolClass.id}/> : null}
                    {componentToShow === "Events" ? <Events getClassInfo={getClassInfo} events={schoolClass.events} handleDelete={handleDelete} classId={schoolClass.id}/> : null}
                    {componentToShow === "Assignments" ? <Assignments getClassInfo={getClassInfo} assignments={schoolClass.assignments} students={schoolClass.students} handleDelete={handleDelete} classId={schoolClass.id} /> : null}
                </div>

            </div>
        )
    }

    return (
        <div className="relative bg-slate-100 overflow-auto min-h-screen">
            <Navigation />
            {school_class_div}
        </div>
    );
}

export default SchoolClass;