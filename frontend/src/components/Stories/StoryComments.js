import { useSelector } from 'react-redux';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const StoryComments = (props) => {

    const token = useSelector((state) => state.auth.token);

    // CREATE COMMENT FUNCTIONS
    const handleCreateComment = (comment, actions) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            content: comment,
            story: props.story.id
        }
        const url = `${process.env.API_URL}/api/v1/school/story-comment-create/`;
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getStoryComments();
                actions.resetForm();
            })
            .catch(err => {
                console.log(err);
            })
    }

    // CREATE COMMENT FORM
    const comment_formik = useFormik({
        initialValues: {
            comment: ""
        },
        onSubmit: (values, actions) =>  {
            handleCreateComment(values.comment, actions);
        },
        validationSchema: Yup.object({
            comment: Yup.string().trim()
        })
    });

    const create_comment_form = (
        <div className="w-full">
            <form onSubmit={comment_formik.handleSubmit}>
                <input
                    type="text"
                    placeholder="Write a comment..."
                    name="comment"
                    value={comment_formik.values.comment}
                    onChange={comment_formik.handleChange}
                    onBlur={comment_formik.handleBlur}
                    className="border border-gray-300 w-[calc(100%-6rem)] h-12"
                    autocomplete="off"
                />
                <button type="submit" className="w-24 rounded-md bg-sky-500 hover:bg-indigo-500 p-2 my-2 text-white font-bold border-2 border-black">Post</button>
            </form>
        </div>
    )

    // LIST OF COMMENTS
    const comments_list_div = props.comments.map((comment)=>{
        return (
            <div className="w-full bg-white border-b-2 border-gray-300 p-2" key={comment.id}>
                <div className="flex justify-between">
                    <p className="text-sm">{new Date(comment.created_at).toLocaleTimeString()}</p>
                    <p className="text-sm">{new Date(comment.created_at).toLocaleDateString()}</p>
                </div>
                <p><b>{`${comment.author.first_name} ${comment.author.last_name}`}: </b>{comment.content}</p>
            </div>
        )
    })

    return (
        <div className="mt-2">

            {props.showComments && 
            <div className="max-h-[16rem] overflow-auto">
                {comments_list_div} 
            </div>
            }
            {props.writeComment ? create_comment_form : null}
        </div>
    )
}

export default StoryComments;