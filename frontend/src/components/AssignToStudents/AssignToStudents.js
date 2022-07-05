import './AssignToStudents.css';
import { useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

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
            <div style={{margin: "10px"}} key={student.id}>
                {student.name}
                <input type="checkbox" onChange={()=>handleSelectStudentToDelete(student)}/>
            </div>
        )
    })
    let not_allocated_student_list = notAllocatedStudents.map((student)=>{
        return (
            <div style={{margin: "10px"}} key={student.id}>
                {student.name}
                <input type="checkbox" onChange={()=>handleSelectStudent(student)}/>
            </div>
        )
    })

    // Main component JSX
    let assign_to_students_div = (
        <div className="list-div-wrapper">
            <button onClick={handleGoBack} style={{marginTop: "20px"}}>Go Back</button>
            <h2>{props.assignment.title}</h2>
            <h3>Unassigned Students</h3>
            <p>Which students do you want to give the assignment to?</p>
            {not_allocated_student_list}
            <button onClick={handleAssignStudents}>Submit</button>
            <h3>Assigned Students</h3>
            <p>These students have already been allocated, select to remove them from the assignment.</p>
            {allocated_student_list}
            <button onClick={handleUnassignStudents}>Submit</button>
        </div>
    )

    return assign_to_students_div;
}

export default AssignToStudents;