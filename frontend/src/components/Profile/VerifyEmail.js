import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authSlice from "../../store/slices/auth";

const VerifyEmail = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // User can logout if don't want to verify now
    const handleLogout = () => {
        dispatch(authSlice.actions.logout());
        navigate('/login');
    }

    let email_verified_div = (
        <div className="fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.7)] flex items-center justify-center">
            <div className="w-full sm:w-[600px] border border-gray-500 rounded shadow-md mb-2 bg-white p-4">
                <h2 className="p-2">Email Not Verified</h2>
                <p>Check your email and click the link to verify your account.</p>
                <p className="pb-4">Once verified, refresh the page to continue.</p>
                <button className="rounded bg-sky-500 hover:bg-indigo-500 px-4 py-2 text-white font-semibold" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )

    return email_verified_div;
}

export default VerifyEmail;