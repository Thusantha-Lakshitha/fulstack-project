import React, { useState } from "react";
import { loginUser } from "../services/userService";
import "./Login.css";

function Login({ onGoRegister }) {

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
                alert("Login Successful!");
                console.log(res.data);
            })
            .catch((err) => {
                alert("Invalid login!");
                console.log(err);
            });
    };

    return (
        <div className="container">
            <div className="form-box">
                <h2>Student Login</h2>

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
                    <button type="button" onClick={onGoRegister}>Register</button>
                </p>
            </div>
        </div>
    );
}

export default Login;