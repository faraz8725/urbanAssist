import "../styles/home.css";
import ServiceCard from "../components/ServiceCard";

function Home() {
  const services = ["Maid", "Cook", "Baby Care", "Elder Care"];

  return (
    <div className="home">
      <div className="hero">
        <h1>Book Trusted Home Services</h1>
        <p>Professional helpers at your doorstep</p>
      </div>

      <h2 className="title">Our Services</h2>

      <div className="services">
        {services.map((s, i) => (
          <ServiceCard key={i} title={s} />
        ))}
      </div>
    </div>
  );
}

export default Home;