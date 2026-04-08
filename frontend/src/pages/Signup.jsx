import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

function Signup() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/register", {
        ...form,
        role // 👈 IMPORTANT
      });

      console.log(res.data);
      alert("Signup Success");

      navigate(`/login/${role}`); // 👈 auto redirect
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Signup Failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{role} Signup</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name"
          onChange={(e)=>setForm({...form,name:e.target.value})}
        /><br /><br />

        <input placeholder="Email"
          onChange={(e)=>setForm({...form,email:e.target.value})}
        /><br /><br />

        <input type="password" placeholder="Password"
          onChange={(e)=>setForm({...form,password:e.target.value})}
        /><br /><br />

        <button type="submit">Signup</button>
      </form>

      <p>
        Already have an account?{" "}
        <span onClick={() => navigate(`/login/${role}`)} style={{color:"blue",cursor:"pointer"}}>
          Login
        </span>
      </p>
    </div>
  );
}

export default Signup;