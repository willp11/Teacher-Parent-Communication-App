import Spinner from "../Spinner/Spinner";

const RoundedSubmitBtn = ({loading, textContent}) => {
    return (
        <button
            disabled={loading}
            type="submit"
            className="w-full rounded-full bg-sky-500 hover:bg-indigo-500 px-4 py-3 text-white font-bold my-4 flex justify-center items-center"
        >
            {loading ? <Spinner /> : null}
            {textContent}
        </button>
    )
}

export default RoundedSubmitBtn;