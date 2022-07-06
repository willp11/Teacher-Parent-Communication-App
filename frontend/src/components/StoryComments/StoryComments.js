import './StoryComments.css';
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
        const url = 'http://localhost:8000/api/v1/school/story-comment-create/';
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
        <form className="create-comment" onSubmit={comment_formik.handleSubmit}>
            <input
                type="text"
                placeholder="Write a comment..."
                name="comment"
                value={comment_formik.values.comment}
                onChange={comment_formik.handleChange}
                onBlur={comment_formik.handleBlur}
                style={{textAlign: "center"}}
            />
            <button type="submit">Submit</button>
        </form>
    )

    // LIST OF COMMENTS
    const comments_list_div = props.comments.map((comment)=>{
        return (
            <div className="story-comment" key={comment.id}>
                <p><b>{comment.author.username}: </b>{comment.content}</p>
            </div>
        )
    })

    return (
        <div className="story-comments-div">
            {comments_list_div}
            {create_comment_form}
        </div>
    )
}

export default StoryComments;