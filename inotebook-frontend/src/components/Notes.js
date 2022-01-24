import React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import noteContext from "../context/notes/noteContext";
import { AddNotes } from './AddNotes';
import NoteItem from './NoteItem';

const Notes = (props) => {
    const context = useContext(noteContext);
    const {notes,  getNotes, editNote} = context;
    let navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('token')){
            getNotes();
        }
        else{
            navigate('/login')
        }
      // eslint-disable-next-line
    }, []);

    const ref = useRef(null);
    const refClose = useRef(null);

    const [note, setNote] = useState({id:"", etitle:"",edescription:"",etag:"default"});

    const updateNote = (currentNote)=>{
        ref.current.click();
        setNote({id:currentNote._id,etitle:currentNote.title, edescription:currentNote.description,etag:currentNote.tag})
    }


    const handleClick=(e)=>{
        // console.log("updating the note");
        // e.preventDefault();
        editNote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click();
        props.showAlert("Updated successfully","success");
    }

    const onChange=(e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }
    return (
        <>
        <AddNotes showAlert={props.showAlert}/>

        {/* <!-- Button trigger modal --> */}
        <button ref={ref} type="button" className="btn btn-primary" style={{display:"none"}}data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
        </button>

    
        {/* <!-- Modal --> */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <form className='my-3'>
            <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input type="text" className="form-control" id="etitle" aria-describedby="emailHelp" onChange={onChange} name='etitle' value={note.etitle} minLength={5} required/>
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <input type="text" name="edescription" className="form-control" id="edescription" value={note.edescription} onChange={onChange} minLength={5} required/>
            </div>

            <div className="mb-3">
                <label htmlFor="etag" className="form-label">Tag</label>
                <input type="text" name="etag" className="form-control" id="tag" value={note.etag} onChange={onChange} minLength={5} required/>
            </div>
            
        </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={refClose}>Close</button>
                <button disabled={note.etitle.length<5 || note.edescription.length<5} type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
            </div>
            </div>
        </div>
        </div>

            <div className="row my-3">
            <h2>Your Notes</h2>
            <div className='container mx-2'>
            {notes.length === 0 && "No notes to display"}
            </div>
                {notes.map((note)=>{
                    return <NoteItem key={note._id} updateNote={updateNote} note={note} showAlert={props.showAlert}/>;
                })}
            </div>
            </>
    )
};

export default Notes;
