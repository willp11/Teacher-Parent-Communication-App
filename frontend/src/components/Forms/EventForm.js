const EventForm = ({formik, message, children}) => {
    return (
        <form onSubmit={formik.handleSubmit}>
            <input
                type="text"
                placeholder="Type event name..."
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border border-gray-300 mt-2 h-10 w-full"
            /> <br/>
            {formik.errors.name ? <div className="text-sm w-full text-left pl-2">{formik.errors.name} </div> : null}

            <input
                type="date"
                placeholder="Date"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border border-gray-300 mt-2 h-10 w-full"
            /> <br/>
            {formik.errors.date ? <div className="text-sm w-full text-left pl-2">{formik.errors.date} </div> : null}

            <textarea
                rows="3"
                placeholder="Type description..."
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border border-gray-300 mt-2 w-full"
            /> <br/>
            {formik.errors.description ? <div className="text-sm w-full text-left pl-2">{formik.errors.description} </div> : null}

            <input
                type="number"
                placeholder="Type number helpers..."
                name="helpers"
                value={formik.values.helpers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border border-gray-300 mt-2 h-10 w-full"
            /> <br/>
            {formik.errors.helpers ? <div className="text-sm w-full text-left pl-2">{formik.errors.helpers} </div> : null}
            <div className="flex justify-center mt-2">
                {children}
            </div>
            <p className="text-sm">{message}</p>
        </form>
    )
}

export default EventForm;