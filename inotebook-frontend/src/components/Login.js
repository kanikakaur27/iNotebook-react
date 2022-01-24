import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = (props) => {
    const [credentials, setCredentials] = useState({email:"", password:""});

    let navigate = useNavigate();

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const host = "http://localhost:5000"
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: credentials.email, password:credentials.password})
          });
          const json = await response.json();
          console.log(json);
          if(json.success){
            // Save the authtoken and redirect
            localStorage.setItem("token",json.authtoken)
            navigate("/");
            props.showAlert("Logged in successfully","success")
          }
          else{
            props.showAlert("Invalid Credentials","danger")
          }
    }

    const onChange=(e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className='mt-4'>
          <h2 className='my-2'>Login to continue to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input onChange={onChange} value={credentials.email} type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp"/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input onChange={onChange} value={credentials.password} type="password" name="password" className="form-control" id="password"/>
                </div>
                
                <button type="submit" className="btn btn-primary">Submit</button>
                </form>
        </div>
    )
};

export default Login;
