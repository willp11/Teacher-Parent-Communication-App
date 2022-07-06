import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from 'yup';
import axios from "axios";
import Story from "../Story/Story";

const Stories = (props) => {

    const token = useSelector((state) => state.auth.token);

    // CREATE STORY FUNCTION
    const handleCreateStory = (title, content, actions) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            title, 
            content,
            school_class: props.classId
        }
        const url = 'http://localhost:8000/api/v1/school/story-create/';
        axios.post(url, data, {headers: headers})
            .then(res=>{
                console.log(res);
                props.getClassInfo();
                actions.resetForm();
            })
            .catch(err => {
                console.log(err);
            })
    }

    // CREATE STORY FORM
    const story_formik = useFormik({
        initialValues: {
            title: "",
            content: "",
        },
        onSubmit: (values, actions) =>  {
            handleCreateStory(values.title, values.content, actions);
        },
        validationSchema: Yup.object({
            title: Yup.string().trim().required("title is required"),
            content: Yup.string().trim().required("content is required")
        })
    });

    // STORIES
    let create_story_form = (
        <form onSubmit={story_formik.handleSubmit}>
            <div>
                <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={story_formik.values.title}
                    onChange={story_formik.handleChange}
                    onBlur={story_formik.handleBlur}
                    style={{textAlign: "center"}}
                /> <br/>
                {story_formik.errors.title ? <div className="ErrorMsg">{story_formik.errors.title} </div> : null}

                <textarea
                    rows="10"
                    name="content"
                    value={story_formik.values.content}
                    onChange={story_formik.handleChange}
                    onBlur={story_formik.handleBlur}
                    placeholder="Content"
                /> <br/>
                {story_formik.errors.content ? <div className="ErrorMsg">{story_formik.errors.content} </div> : null}
            </div>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    )
    let stories = props.stories.map((story)=>{
        return <Story story={story} handleDelete={props.handleDelete} key={story.id} getClassInfo={props.getClassInfo}/>
    });

    let stories_div = (
        <div className="list-div-wrapper">
            <h2>Stories</h2>
            {/* {create_story_form} */}
            {props.stories.length === 0 ? <p>There are no stories</p> : null}
            {stories}
        </div>
    )

    return stories_div;
}

export default Stories;