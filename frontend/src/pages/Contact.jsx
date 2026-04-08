import { useState } from "react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    // yaha API call lagani hai
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})} />
      <input placeholder="Phone" onChange={(e)=>setForm({...form,phone:e.target.value})} />
      <input placeholder="Service" onChange={(e)=>setForm({...form,service:e.target.value})} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Contact;