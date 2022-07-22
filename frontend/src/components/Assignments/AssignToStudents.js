import { useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { XIcon } from '@heroicons/react/outline';

const AssignToStudents = (props) => {

    const token = useSelector((state)=>state.auth.token);

    // list of allocated students
    const [allocatedStudents, setAllocatedStudents] = useState([]);
    // list of not allocated students
    const [notAllocatedStudents, setNotAllocatedStudents] = useState([]);
    // list of selected students - that we want to pass to assignee-create API
    const [selectedStudents, setSelectedStudents] = useState([]);
    // list of already assigned select students - that we want to pass to assignee-delete API
    const [selectDeleteStudents, setSelectDeleteStudents] = useState([]);

    // UPDATE STUDENTS LIST FROM PROPS TO SHOW IF ALLOCATED ALREADY
    const updateStudentProps = useCallback((allocatedStudents) => {
        let studentsList = [...props.students];
        let allocatedList = [];
        let notAllocatedList = [];
        for (let i=0; i<studentsList.length; i++) {
            let student = studentsList[i];
            let alreadyAllocated = false;
            allocatedStudents.forEach((assignee)=>{
                if (assignee.student === student.id) {
                    alreadyAllocated = true;
                }
            })
            if (alreadyAllocated) {
                allocatedList.push(student)
            } else {
                notAllocatedList.push(student)
            }
        }
        setAllocatedStudents(allocatedList);
        setNotAllocatedStudents(notAllocatedList);
    }, [props.students])

    // GET ALL ALLOCATED STUDENTS FUNCTION
    const getAllocatedStudents = useCallback(()=>{
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/assignee-create/' + props.assignment.id + '/';
        axios.get(url, {headers: headers})
            .then(res=>{
                console.log(res);
                setAllocatedStudents(res.data);
                updateStudentProps(res.data);
            })
            .catch(err=>{
                console.log(err);
            })
    }, [token, props.assignment.id, updateStudentProps])
    
    // COMPONENT MOUNT - GET ALLOCATED STUDENTS
    useEffect(()=>{
        getAllocatedStudents();
    }, [getAllocatedStudents])

    // HANDLE GO BACK - reset selected students list
    const handleGoBack = () => {
        setSelectedStudents([]);
        props.toggleAssignMode();
    }

    // ASSIGN STUDENTS FUNCTION
    const handleAssignStudents = () => {
        let data_arr = [];
        selectedStudents.forEach(student=>{
            data_arr.push({assignment: props.assignment.id, student: student.id})
        })
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/assignee-create/' + props.assignment.id + '/';
        axios.post(url, data_arr, {headers: headers})
            .then(res=>{
                console.log(res);
                getAllocatedStudents();
                setSelectedStudents([]);
            })
            .catch(err=>{
                console.log(err);
            })
    }   

    // DELETE ASSIGNED STUDENTS FUNCTION
    const handleUnassignStudents = () => {
        let data_arr = [];
        selectDeleteStudents.forEach(student=>{
            data_arr.push({assignment: props.assignment.id, student: student.id})
        })
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const url = 'http://localhost:8000/api/v1/school/assignee-delete-list/' + props.assignment.id + '/';
        axios.delete(url, {headers: headers, data: data_arr})
            .then(res=>{
                console.log(res);
                getAllocatedStudents();
                setSelectDeleteStudents([]);
            })
            .catch(err=>{
                console.log(err);
            })
    }

    // ADD/REMOVE STUDENT FROM SELECTED STUDENTS
    const handleSelectStudent = (student) => {
        // copy student list from state
        let newStudentsList = [...selectedStudents];

        // search selectedStudents for the student
        let foundStudent = false;
        selectedStudents.forEach((stud, index)=>{
            // if there, remove it
            if (stud.id === student.id) {
                console.log(`found student in selectedStudents: ${student.id}`)
                newStudentsList.splice(index, 1);
                foundStudent = true;
            }
        })
        // if not, add it
        if (foundStudent === false) {
            newStudentsList.push(student);
        }

        // update state
        setSelectedStudents(newStudentsList);
    }

    // ADD/REMOVE STUDENT FROM ALREADY ASSIGNED SELECTED STUDENTS
    const handleSelectStudentToDelete = (student) => {
        // copy student list from state
        let newStudentsList = [...selectDeleteStudents];

        // search selectedStudents for the student
        let foundStudent = false;
        selectDeleteStudents.forEach((stud, index)=>{
            // if there, remove it
            if (stud.id === student.id) {
                console.log(`found student in selectDeleteStudents: ${student.id}`)
                newStudentsList.splice(index, 1);
                foundStudent = true;
            }
        })
        // if not, add it
        if (foundStudent === false) {
            newStudentsList.push(student);
        }

        // update state
        setSelectDeleteStudents(newStudentsList);
    }

    // Create student list divs
    let allocated_student_list = allocatedStudents.map((student)=>{
        return (
            <div className="flex justify-start mt-2" key={student.id}>
                <input type="checkbox" onChange={()=>handleSelectStudentToDelete(student)}/>
                <p className="text-sm font-semibold pl-2">{student.name}</p>
            </div>
        )
    })
    let not_allocated_student_list = notAllocatedStudents.map((student)=>{
        return (
            <div className="flex justify-start mt-2" key={student.id}>
                <input type="checkbox" onChange={()=>handleSelectStudent(student)}/>
                <p className="text-sm font-semibold pl-2">{student.name}</p>
            </div>
        )
    })

    // Main component JSX
    let assign_to_students_div = (
        <div className="relative h-[calc(100%-2rem)] max-h-[500px] w-[calc(100%-2rem)] max-w-[650px] p-2 mx-auto mt-2 rounded-md shadow-md bg-white text-center">
            <XIcon 
                onClick={handleGoBack}
                className="absolute top-2 right-2 h-[24px] w-[24px] hover:border hover:border-gray-300 cursor-pointer"
            />
            <h2>{props.assignment.title}</h2>
            <p className="text-left text-sm font-semibold pl-2 py-1">Choose students to give the assignment to.</p>
            <div className="h-[calc(100%-4rem)] flex flex-col sm:flex-row px-1">
                <div className="h-1/2 sm:h-full w-full sm:w-1/2 p-1 bg-white border border-gray-300 shadow-md rounded-md flex flex-col justify-between overflow-auto">
                    <div>
                        <h3 className="text-left text-sm text-gray-500">Not Assigned</h3>
                        <p className="text-left text-xs mt-2">Which students do you want to give the assignment to?</p>
                        {not_allocated_student_list}
                    </div>
                    <button 
                        className="rounded-md border-2 border-black bg-sky-500 hover:bg-indigo-500 text-white font-semibold px-4 py-2 m-2"
                        onClick={handleAssignStudents}
                    >
                        Assign
                    </button>
                </div>
                <div className="h-1/2 sm:h-full w-full sm:w-1/2 p-1 bg-white border border-gray-300 shadow-md rounded-md flex flex-col justify-between overflow-auto">
                    <div>
                        <h3 className="text-left text-sm text-gray-500">Assigned</h3>
                        <p className="text-left text-xs mt-2">These students have already been given the assignment.</p>
                        {allocated_student_list}
                    </div>
                    <button
                        className="rounded-md border-2 border-black bg-sky-500 hover:bg-indigo-500 text-white font-semibold px-4 py-2 m-2"
                        onClick={handleUnassignStudents}
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    )

    
    let assign_modal = (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-20 w-screen h-screen flex items-center justify-center">
            {assign_to_students_div}
        </div>
    )

    return assign_modal;
}

export default AssignToStudents;