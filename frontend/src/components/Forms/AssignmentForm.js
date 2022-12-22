const AssignmentForm = ({formik, message, children}) => {
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
            {formik.errors.title ? <div className="text-sm text-left pl-1">{formik.errors.title} </div> : null}

            <textarea
                rows="3"
                name="description"
                placeholder="Type description..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border border-gray-300 mt-2 w-full"
            /> <br/>
            {formik.errors.description ? <div className="text-sm text-left pl-1">{formik.errors.description} </div> : null}

            <input
                type="number"
                placeholder="Enter maximum score"
                name="maximum_score"
                value={formik.values.maximum_score}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border border-gray-300 mt-2 h-10 w-full"
            /> <br/>
            {formik.errors.maximum_score ? <div className="text-sm text-left pl-1">{formik.errors.maximum_score} </div> : null}

            <div className="py-2 px-1 border border-gray-300 mt-2">
                <p className="mb-1 text-left font-semibold text-sm">Response format:</p>
                <div className="w-full flex justify-start">
                    <div>
                        <input
                            type="radio"
                            name="response_format"
                            value="Text"
                            id="Text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <label htmlFor="Text" className="ml-1 mr-4">Text</label> 
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="response_format"
                            value="Image"
                            id="Image"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <label htmlFor="Image" className="ml-1 mr-4">Image</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="response_format"
                            value="Video"
                            id="Video"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <label htmlFor="Video" className="ml-1 mr-4">Video</label>
                    </div>
                </div>
            </div>
            {formik.errors.response_format ? <div className="text-sm text-left pl-1">{formik.errors.response_format} </div> : null}
            <div className="flex justify-center mt-2">
                {children}
            </div>
            <p className="text-sm">{message}</p>
        </form>
    )
}

export default AssignmentForm;