import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  return (
    <div>
      <h1>
        {" "}
        <Link to="/login">Login</Link>
      </h1>
      <br />
      <br />
      <h2>User Info</h2>
      <h4>Name:{loggedInUser.name}</h4>
      <h5>Email: {loggedInUser.email}</h5>
    </div>
  );
};

export default Home;
