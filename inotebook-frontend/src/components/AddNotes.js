import React from 'react';
import { useContext, useState} from 'react';
import noteContext from "../context/notes/noteContext";

export const AddNotes = (props) => {
    const context = useContext(noteContext);
    const {addNote} = context;

    const [note, setNote] = useState({title:"",description:"",tag:""});

    const handleClick=(e)=>{
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({title:"",description:"",tag:""});
        props.showAlert("Added successfully","success");
    }

    const onChange=(e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }
      return (
        <div className="container my-3">
        <h2>Add a Note</h2>
        <form className='my-3'>
            <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input type="text" className="form-control" id="title" aria-describedby="emailHelp" onChange={onChange} name='title' minLength={5} value={note.title} required/>
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <input type="text" name="description" className="form-control" id="description" onChange={onChange} minLength={5} value={note.description} required/>
            </div>

            <div className="mb-3">
                <label htmlFor="tag" className="form-label">Tag</label>
                <input type="text" name="tag" className="form-control" id="tag" onChange={onChange} minLength={5} value={note.tag} required/>
            </div>
            
            <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
        </form>
        </div>
      )
};
