import Spinner from "../Spinner/Spinner";

const SubmitBtn = ({loading, clickHandler, textContent}) => {
    return (
        <button 
            className="w-28 rounded bg-sky-500 hover:bg-indigo-500 p-2 text-white font-semibold flex justify-center" 
            onClick={clickHandler}
            disabled={loading}
        >
            {loading ? <Spinner /> : null}
            {loading ? "Loading" : textContent}
        </button>
    )
}

export default SubmitBtn;