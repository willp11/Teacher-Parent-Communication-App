const RegisterForm = ({formik, children}) => {
    return (
        <form onSubmit={formik.handleSubmit}>
            <p className="text-base pt-6 pl-2 pb-2 font-bold">E-mail</p>
            <input 
                type="text"
                name="email"
                placeholder="Type your e-mail" 
                className="p-2 border border-gray-300 w-full h-10" 
                value={formik.values.email} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.errors.email ? <div className="text-sm pl-2 py-1">{formik.errors.email} </div> : null}

            <p className="text-base p-2 font-bold">First Name</p>
            <input
                type="text"
                name="firstName"
                placeholder="Type your first name" 
                className="p-2 border border-gray-300 w-full h-10" 
                value={formik.values.firstName} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.errors.firstName ? <div className="text-sm pl-2 py-1">{formik.errors.firstName} </div> : null}

            <p className="text-base p-2 font-bold">Last Name</p>
            <input 
                type="text"
                name="lastName"
                placeholder="Type your last name (optional)" 
                className="p-2 border border-gray-300 w-full h-10" 
                value={formik.values.lastName} 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />

            <p className="text-base p-2 font-bold">Password</p>
            <input 
                type="password"
                name="password"
                placeholder="Type your password" 
                className="p-2 border border-gray-300 w-full h-10"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.errors.password ? <div className="text-sm pl-2 py-1">{formik.errors.password} </div> : null}

            <p className="text-base p-2 font-bold">Password Confirmation</p>
            <input 
                type="password"
                name="passwordConfirmation"
                placeholder="Type your password again" 
                className="p-2 border border-gray-300 w-full h-10"
                value={formik.values.passwordConfirmation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.errors.passwordConfirmation ? <div className="text-sm pl-2 py-1">{formik.errors.passwordConfirmation} </div> : null}

            {children}
        </form>
    )
}

export default RegisterForm;