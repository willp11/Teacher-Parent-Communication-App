const LoginForm = ({formik, children}) => {
    return (
        <form onSubmit={formik.handleSubmit}>
            <p className="text-base pt-6 pl-2 pb-2 font-bold">E-mail</p>
            <input 
                type="text"
                name="email"
                placeholder="Type your e-mail" 
                className="p-2 border border-gray-300 w-full"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.errors.email ? <div className="text-sm pl-2 py-1">{formik.errors.email} </div> : null}

            <p className="text-base p-2 font-bold">Password</p>
            <input 
                type="password"
                name="password"
                placeholder="Type your password" 
                className="p-2 border border-gray-300 w-full"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            /> 
            {formik.errors.password ? <div className="text-sm pl-2 py-1">{formik.errors.password} </div> : null}

            {children}

            {/* <div className="w-full flex justify-end align-center">
                <Link to="/resetPassword" className="text-sm p-2 cursor-pointer text-gray-500  text-gray-500 hover:text-gray-900">Forgot password?</Link>
            </div>
            <button 
                disabled={loading}
                type="submit"
                className="w-full flex justify-center items-center rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-3 text-white font-bold my-2"
            >
                {loading ? <Spinner /> : null}
                LOGIN
            </button> */}
        </form>
    )
}

export default LoginForm;