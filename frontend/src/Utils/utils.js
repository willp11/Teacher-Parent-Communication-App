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