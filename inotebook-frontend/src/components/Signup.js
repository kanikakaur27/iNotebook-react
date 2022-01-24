import React from 'react';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name:"",email:"", password:"",cpassword:""});

    let navigate = useNavigate();

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const host = "http://localhost:5000"
        const {name, email,password} = credentials;
        const response = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email, password})
          });
          const json = await response.json();
          console.log(json);
          if(json.success){
            // Save the authtoken and redirect
            localStorage.setItem("token",json.authtoken)
            navigate("/");
            props.showAlert("Account created successfully","success")
          }
          else{
            props.showAlert("Invalid Credentials","danger")
          }
    }

    const onChange=(e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className='container mt-3'>
            <h2 className='my-2'>Create an account to use iNotebook</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input onChange={onChange} value={credentials.name} type="text" className="form-control" id="name" name="name" aria-describedby="emailHelp" onChange={onChange} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input onChange={onChange} value={credentials.email} type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" onChange={onChange} required/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input onChange={onChange} value={credentials.password} type="password" name="password" className="form-control" id="password" onChange={onChange} minLength={5} required/>
                </div>
                
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input onChange={onChange} value={credentials.cpassword} type="password" name="cpassword" className="form-control" id="cpassword" onChange={onChange} minLength={5} required/>
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
                </form>
        </div>
    )
};

export default Signup;