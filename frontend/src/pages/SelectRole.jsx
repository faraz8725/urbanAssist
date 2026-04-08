import { useNavigate } from "react-router-dom";

function SelectRole() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Select Login Type</h1>

      <button 
        onClick={() => navigate("/login/customer")}
        style={{ margin: "20px", padding: "10px" }}
      >
        Login as Customer
      </button>

      <button 
        onClick={() => navigate("/login/provider")}
        style={{ margin: "20px", padding: "10px" }}
      >
        Login as Provider
      </button>
    </div>
  );
}

export default SelectRole;