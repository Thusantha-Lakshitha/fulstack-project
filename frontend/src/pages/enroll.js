import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./enroll.css";
import courseService from "../services/courseService";
import enrollmentService from "../services/enrollmentService";
import { subscribeDataUpdates, publishDataUpdate } from "../services/liveUpdates";

function Enroll() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Credit/Debit Card");

  // Credit/Debit Card Fields State
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    let active = true;

    const loadCourse = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await courseService.fetchCourseById(id);
        if (active) {
          setCourse(data);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.error || requestError.message || "Course not found");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCourse();

    return subscribeDataUpdates(({ resource }) => {
      if (!resource || resource === "courses") {
        loadCourse();
      }
    });
  }, [id]);

  const handleEnroll = async (e) => {
    e.preventDefault();
    setEnrolling(true);
    setError("");

    try {
      const paymentDetails = paymentMethod === "Credit/Debit Card" ? {
        cardNumber: cardNumber.replace(/\s+/g, ""),
        cvv,
        cardName,
        expiryMonth,
        expiryYear,
      } : {};

      await enrollmentService.enroll(id, paymentMethod, paymentDetails);
      publishDataUpdate("enrollments");
      alert("Enrollment successful! A confirmation email has been sent.");
      navigate(`/classroom/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || "Could not enroll");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <h2>Loading course...</h2>;
  }

  if (error || !course) {
    return <h2>{error || "Course not found"}</h2>;
  }

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "";
  const email = localStorage.getItem("email") || "";

  if (!token) {
    return (
      <div className="enroll-page">
        <div className="enroll-card">
          <h1>Enroll Course</h1>
          <p className="auth-note">Please <Link to="/login">log in</Link> to enroll in this course.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enroll-page">
      <div className="enroll-card">
        <h1>Checkout</h1>

        <div className="course-box">
          <h2>{course.title}</h2>
          <p>{course.description}</p>

          <div className="course-info">
            <p><strong>Instructor:</strong> {course.instructorName || "TBA"}</p>
            <p><strong>Duration:</strong> {course.duration}</p>
            <p><strong>Price:</strong> {course.price != null && course.price > 0 ? `LKR ${course.price}` : "Free"}</p>
          </div>
        </div>

        <form className="enroll-form" onSubmit={handleEnroll}>
          <input type="text" value={username} readOnly disabled />
          <input type="email" value={email} readOnly disabled />
          
          <div className="payment-section">
            <label htmlFor="paymentMethod" style={{display: 'block', textAlign: 'left', fontWeight: 'bold', marginBottom: '8px'}}>Select Payment Method:</label>
            <select 
              id="paymentMethod" 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
              required
              style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '20px'}}
            >
              {(!course.price || course.price === 0) ? (
                <option value="Free Course">Free Course</option>
              ) : (
                <>
                  <option value="Credit/Debit Card">Credit/Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash Payment">Cash Payment</option>
                </>
              )}
            </select>
          </div>

          {paymentMethod === "Credit/Debit Card" && (
            <div className="card-details-section">
              <div className="card-input-group">
                <label>Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe" 
                  value={cardName} 
                  onChange={(e) => setCardName(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="card-input-group">
                <label>Card Number</label>
                <input 
                  type="text" 
                  maxLength="19"
                  placeholder="1234 5678 1234 5678" 
                  value={cardNumber} 
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, "");
                    let formatted = val.replace(/(\d{4})(?=\d)/g, "$1 ");
                    setCardNumber(formatted);
                  }} 
                  required 
                />
              </div>

              <div className="card-row">
                <div className="card-col">
                  <label>Expiry Month</label>
                  <select 
                    value={expiryMonth} 
                    onChange={(e) => setExpiryMonth(e.target.value)} 
                    required
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => {
                      const m = String(i + 1).padStart(2, "0");
                      return <option key={m} value={m}>{m}</option>;
                    })}
                  </select>
                </div>
                <div className="card-col">
                  <label>Expiry Year</label>
                  <select 
                    value={expiryYear} 
                    onChange={(e) => setExpiryYear(e.target.value)} 
                    required
                  >
                    <option value="">YYYY</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const y = String(new Date().getFullYear() + i);
                      return <option key={y} value={y}>{y}</option>;
                    })}
                  </select>
                </div>
                <div className="card-col">
                  <label>CVV</label>
                  <input 
                    type="text" 
                    maxLength="4" 
                    placeholder="123" 
                    value={cvv} 
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))} 
                    required 
                  />
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={enrolling}>
            {enrolling ? "Processing..." : "Confirm & Pay"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Enroll;
