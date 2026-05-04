import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register"; 

function App() {
  const [page, setPage] = React.useState("login");

  return (
    <div>
      {page === "login" ? (
        <Login onGoRegister={() => setPage("register")} />
      ) : (
        <Register onGoLogin={() => setPage("login")} />
      )}
    </div>
  );
}

export default App;