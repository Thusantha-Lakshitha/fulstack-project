import "./Dashbord.css";

function Dashboard() {
  const dashboardBackground = `${process.env.PUBLIC_URL}/ChatGPT%20Image%20May%205,%202026,%2010_16_15%20AM.png`;

  return (
    <div className="dashboard-page" style={{ backgroundImage: `url(${dashboardBackground})` }}>
      <div className="dashboard-content">
        <h1>Choose the right theme for education</h1>
        <p>Explore our wide range of courses and find the perfect fit for your learning journey. The institute is also mandated to provide<br></br> quality teacher education and professional development of personnel engaged in the educational sector</p>
      </div>
      <div className="dashboard-buttons">
        <button className="explore-button">Read More</button>
        <button className="contact-button">Get Started</button>
      </div>
    </div>
    
  );
}



export default Dashboard;