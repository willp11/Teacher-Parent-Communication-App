const PageTitle = ({title, children}) => {
    return (
        <div className="w-full bg-indigo-500 text-center py-2">
            <h1 className="text-white">{title}</h1>
            {children}
        </div>
    )
}

export default PageTitle;