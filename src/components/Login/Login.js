import React, { useContext, useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";
import { useForm } from "react-hook-form";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Login = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [newUser, setNewUser] = useState(false);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  // history.replace(from);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = useRef({});
  password.current = watch("password", "");

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log("from on auth ", user);
        const loggedInUserInfo = {
          name: user.displayName,
          email: user.email,
        };
        setLoggedInUser(loggedInUserInfo);
      } else {
        console.log("please Sign In or Up from state change");
      }
    });
  }, []);
  const onSubmit = (data, e) => {
    // console.log(data);
    if (newUser) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          console.log("Registered User", user);

          updateUserName(data.name);
          // ...
          alert("New user Registered Successful");
          e.target.reset();
          setNewUser(false);
        })
        .catch((error) => {
          // var errorCode = error.code;
          var errorMessage = error.message;
          setErrorMessage(errorMessage);
          // ..
        });
    }
    if (!newUser) {
      firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          // ...
          console.log("logged In", user);
          history.replace(from);
        })
        .catch((error) => {
          // var errorCode = error.code;
          var errorMessage = error.message;
          setErrorMessage(errorMessage);
        });
    }
  };
  const updateUserName = (name) => {
    const user = firebase.auth().currentUser;

    user
      .updateProfile({
        displayName: name,
      })
      .then(function () {})
      .catch(function (error) {});
  };
  const handleLogOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("signed Out");
      })
      .catch((error) => {
        console.log("error From Log Out", error);
      });
  };
  const handleGoogleSignIn = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        // var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log("signned In by Google", user);
        history.replace(from);

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        // var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // ...
        setErrorMessage(errorMessage);
      });
  };
  return (
    <div className="w-50 mx-auto mt-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Authentication</h1>
        <div className="form-group">
          {newUser && (
            <div>
              <label htmlFor="name">Name</label>
              <input
                required
                type="name"
                className="form-control"
                name="name"
                placeholder="Name"
                {...register("name", { required: true })}
              ></input>
              {errors.name && (
                <span className="text-danger">This field is required</span>
              )}
            </div>
          )}
          <label htmlFor="email-address">Email address</label>
          <input
            required
            type="email"
            name="email"
            className="form-control"
            id="email-address"
            placeholder="Enter email"
            {...register("email", { required: true })}
          ></input>
          {errors.email && (
            <span className="text-danger">This field is required</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            {...register("password", {
              required: true,
              pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            })}
          ></input>
          {errors.password && (
            <span className="text-danger">
              Minimum eight characters, at least one letter, one number and one
              special character:
            </span>
          )}
        </div>
        <div className="form-group">
          {newUser && (
            <div>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                title="Password must contain uppercase, lowercase, number , special character and length 6-16"
                required
                name="confirmPassword"
                type="password"
                className="form-control"
                id="confirm-password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: true,
                  validate: (value) =>
                    value === password.current || (
                      <span className="text-danger">
                        The password do not match
                      </span>
                    ),
                })}
              ></input>
              {errors.confirmPassword && (
                <span>{errors.confirmPassword.message}</span>
              )}
            </div>
          )}
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
            onChange={() => setNewUser(!newUser)}
            name="newUser"
          ></input>
          <label className="form-check-label" htmlFor="exampleCheck1">
            New User?
          </label>
        </div>
        <input
          className="btn btn-primary"
          type="submit"
          value={newUser ? "Sign Up" : "Sign In"}
        />
      </form>
      {errorMessage && <small className="text-danger">{errorMessage}</small>}
      <h5>Or</h5>
      <button className="btn btn-primary" onClick={handleGoogleSignIn}>
        Sign In With Google
      </button>
      <br />
      <button className="btn btn-danger my-3" onClick={handleLogOut}>
        Log Out
      </button>
      {/* 
      {user.isSignedIn ? (
        <button className="btn btn-primary" onClick={handleSignOut}>
          Sign Out With Google
        </button>
      ) : (
        <button className="btn btn-primary" onClick={handleGoogleSignIn}>
          Sign In With Google
        </button>
      )}
      {user.success ? (
        <p style={{ color: "green" }}>
          Your {newUser ? "registration" : "Logged In"} is successful
        </p>
      ) : (
        <p style={{ color: "red" }}>{user.error}</p>
      )} */}
    </div>
  );
};

export default Login;
