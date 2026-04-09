import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ProviderProfile from "./pages/ProviderProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddService from "./pages/AddService";
import Chat from "./pages/Chat";
import Inbox from "./pages/Inbox";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-service" element={<AddService />} />
        <Route path="/chat/:providerId" element={<Chat />} />
        <Route path="/inbox" element={<Inbox />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
