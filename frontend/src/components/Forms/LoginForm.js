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
        </form>
    )
}

export default LoginForm;