import { Link } from "react-router-dom";
import "./Dashbord.css";

function Dashboard() {
  const dashboardBackground = `${process.env.PUBLIC_URL}/ChatGPT%20Image%20May%205,%202026,%2010_16_15%20AM.png`;
  const username = localStorage.getItem("username");

  return (
    <div className="dashboard-page" style={{ backgroundImage: `url(${dashboardBackground})` }}>
      <div className="dashboard-overlay"></div>
      <div className="dashboard-content">
        {username ? <h2 className="dashboard-user-greeting">Welcome, {username}</h2> : null}
        <h1>Choose the right theme for education</h1>
        <p>
          Explore our wide range of courses and find the perfect fit for your learning journey.
          The institute is also mandated to provide quality teacher education and professional
          development of personnel engaged in the educational sector.
        </p>
      </div>
      <div className="dashboard-buttons">
        <Link to="/ReadMore"><button className="explore-button">Read More</button></Link>
        <Link to="/course"><button className="contact-button">Get Started</button></Link>
      </div>
    </div>
  );
}

export default Dashboard;