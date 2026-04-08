import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SelectRole from "./pages/SelectRole";
import Login from "./pages/Login";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/services" element={<Services />} />
  <Route path="/contact" element={<Contact />} />

  {/* NEW ROUTES */}
  <Route path="/select-role" element={<SelectRole />} />
  <Route path="/login/:role" element={<Login />} />
</Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;





