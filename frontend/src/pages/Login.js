import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser, setAuthSession } from "../services/userService";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location?.state?.message) {
            alert(location.state.message);
        }
    }, [location]);

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // simple validation
        if (!user.email || !user.password) {
            alert("Please fill all fields!");
            return;
        }

        loginUser(user)
            .then((res) => {
                setAuthSession({
                    token: res.data?.token,
                    username: res.data?.username || user.email,
                    email: res.data?.email || user.email,
                    role: res.data?.role || "STUDENT",
                });
                alert("Login Successful!");
                console.log(res.data);
                navigate((res.data?.role || "STUDENT").toUpperCase() === "ADMIN" ? "/admin" : "/dashboard");
            })
            .catch((err) => {
                alert("Invalid login!");
                console.log(err);
            });
    };

    return (
        <div className="login-page">
            <div className="container">
            <div className="form-box">
                <h2>Login</h2>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit">Login</button>
                </form>

                <p>
                    Don't have an account?{" "}
                    <Link to="/register" className="switch-link">Register</Link>
                </p>
            </div>
        </div>
        </div>
    );
}

export default Login;




