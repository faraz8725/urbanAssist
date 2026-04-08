/*import { useParams } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

function Login() {
  const { role } = useParams(); // customer / provider

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(`/auth/${role}/login`, form);
      console.log(res.data);
      alert("Login Successful");
    } catch (err) {
      console.log(err);
      alert("Login Failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{role.toUpperCase()} Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          onChange={(e)=>setForm({...form,email:e.target.value})}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setForm({...form,password:e.target.value})}
        /><br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login; 

*/


import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

function Login() {
  const { role } = useParams(); // customer / provider
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(`/auth/${role}/login`, form);
      console.log(res.data);
      alert("Login Successful");
    } catch (err) {
      console.log(err);
      alert("Login Failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{role.toUpperCase()} Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          onChange={(e)=>setForm({...form,email:e.target.value})}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setForm({...form,password:e.target.value})}
        /><br /><br />

        <button type="submit">Login</button>
      </form>

      {/* 🔥 IMPORTANT PART */}
      <p style={{ marginTop: "20px" }}>
        Don't have an account?{" "}
        <span 
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate(`/signup/${role}`)}
        >
          Signup first
        </span>
      </p>
    </div>
  );
}

export default Login;