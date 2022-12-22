// Function to get list of errors from a error response object
export const extractErrors = (err) => {
    let err_list = []
    if (err.response.data !== undefined && err.response.data !== null) {
        let err_keys = Object.keys(err.response.data);
        err_keys.forEach((key)=>{
            let err_key_list = err.response.data[key];
            err_key_list.forEach(err_msg=>{
                err_list.push(err_msg.toString());
            })
        })
    } else {
        if (err.message !== null && err.message !== undefined) err_list = [err.message]
    }
    return err_list
}

// Function to filter array of students given the first letters of their name
export const filterStudents = (value, array) => {
    let students = []

    array.forEach((student)=>{
        if (student.name.slice(0, value.length) === value) students.push(student)
    })

    return students;
}

// Function to create a menu - given array of menu items and callback function to set the currently selected item
export const createMenuDiv = (arr, componentToShow, setComponentToShow) => {
    let menu_div_items = arr.map(item=>{
        return (
            <span 
                className={componentToShow === item ? "classMenuSelected": "classMenuUnselected"}
                onClick={()=>setComponentToShow(item)}
                key={item}
            >
                {item}
            </span>
        )
    })

    let menu_div = (
        <div className="w-full text-center text-center pt-4 pb-2 overflow-y-auto">
            {menu_div_items}
        </div>
    )

    return menu_div;
}