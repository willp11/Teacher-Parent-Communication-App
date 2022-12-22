const StoryForm = ({formik, message, children}) => {
    return (
        <form onSubmit={formik.handleSubmit}>
            <input
                type="text"
                placeholder="Type title..."
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border border-gray-300 mt-2 h-10 w-full"
            /> <br/>
            {formik.errors.title ? <div className="text-sm w-full text-left pl-2 mt-1">{formik.errors.title} </div> : null}

            <textarea
                rows="3"
                name="content"
                placeholder="Type content..."
                value={formik.values.content}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border border-gray-300 mt-2 w-full"
            /> <br/>
            {formik.errors.content ? <div className="text-sm w-full text-left pl-2">{formik.errors.content} </div> : null}
            <div className="flex justify-center mt-1">
                {children}
            </div>
            <p className="text-sm">{message}</p>
        </form>
    )
}

export default StoryForm;