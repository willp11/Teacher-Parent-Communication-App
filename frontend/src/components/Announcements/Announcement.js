import { useFormik } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useSelector } from "react-redux";

const Announcements = (props) => {

    const token = useSelector((state) => state.auth.token);

    // CREATE ANNOUNCEMENT FUNCTION
    const handleCreateAnnouncement = (title, content, actions) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
        }
        const data = {
            title,
            content,
            school_class: props.classId
        }
        const url = 'http://localhost:8000/api/v1/school/announcement-create/';
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

    // CREATE ANNOUNCEMENT FORM
    const announcement_formik = useFormik({
        initialValues: {
            title: "",
            content: "",
        },
        onSubmit: (values, actions) =>  {
            handleCreateAnnouncement(values.title, values.content, actions);
        },
        validationSchema: Yup.object({
            title: Yup.string().trim().required("title is required"),
            content: Yup.string().trim().required("content is required")
        })
    });

    // ANNOUNCEMENTS
    let announcements = props.announcements.map((announcement)=>{
        return (
            <div className="list-div" key={announcement.id}>
                <h3>{announcement.title}</h3>
                <p>{announcement.date}</p>
                <p>{announcement.content}</p>
                <button onClick={()=>props.handleDelete(announcement.id, "announcement")}>Delete</button>
            </div>
        )
    });

    // SHOW CREATE ANNOUNCEMENT FORM
    let create_announcement_form = (
        <form onSubmit={announcement_formik.handleSubmit}>
            <div>
                <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={announcement_formik.values.title}
                    onChange={announcement_formik.handleChange}
                    onBlur={announcement_formik.handleBlur}
                    style={{textAlign: "center"}}
                /> <br/>
                {announcement_formik.errors.title ? <div className="ErrorMsg">{announcement_formik.errors.title} </div> : null}

                <textarea
                    rows="10"
                    name="content"
                    value={announcement_formik.values.content}
                    onChange={announcement_formik.handleChange}
                    onBlur={announcement_formik.handleBlur}
                    placeholder="Content"
                /> <br/>
                {announcement_formik.errors.content ? <div className="ErrorMsg">{announcement_formik.errors.content} </div> : null}
            </div>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    )

    let announcements_div = (
        <div className="list-div-wrapper">
            <h2>Announcements</h2>
            {create_announcement_form}
            {announcements.length === 0 ? <p>There are no announcements</p> : null}
            {announcements}
        </div>
    )

    return announcements_div;
}

export default Announcements;