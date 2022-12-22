const StudentForm = ({formik, children}) => {
    return (
        <form className="transition ease-in-out transition-duration-1000ms" onSubmit={formik.handleSubmit}>
            <div>
                <input
                    type="text"
                    placeholder="Type student's name..."
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{textAlign: "center"}}
                    className="border border-gray-300 mt-2 h-10"
                /> <br/>
                {formik.errors.name ? <div className="text-sm">{formik.errors.name} </div> : null}
            </div>
            <div className="flex justify-center mt-2">
                {children}
            </div>
        </form>
    )
}

export default StudentForm;