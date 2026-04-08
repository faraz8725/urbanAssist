function ServiceCard({ title }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <button>Book Now</button>
    </div>
  );
}

export default ServiceCard;