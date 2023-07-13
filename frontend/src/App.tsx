import { Link, Outlet, useNavigate } from "react-router-dom";
import { themeChange } from "theme-change";
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "./components/Alert";

function App() {
  const [jwtToken, setJwtToken] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("hidden");
  const [tickInterval, setTickInterval] = useState<
    NodeJS.Timer | number | undefined
  >();

  const navigate = useNavigate();

  const logOut = () => {
    const requestOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    };

    fetch(`http://localhost:4000/v1/logout`, requestOptions)
      .catch((error: Error) => {
        console.log("error logging out", error);
        setAlertClassName("alert-error");
        setAlertMessage(error.message);
      })
      .finally(() => {
        setJwtToken("");
        toggleRefresh(false);
      });

    navigate("/login");
  };
  const toggleRefresh = useCallback(
    (status: boolean) => {
      console.log("clicked");

      if (status) {
        console.log("turning on ticking");
        let i = setInterval(() => {
          const requestOptions: RequestInit = {
            method: "GET",
            credentials: "include",
          };

          fetch(`http://localhost:4000/v1/refresh`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
              if (data.access_token) {
                setJwtToken(data.access_token);
              }
            })
            .catch((error) => {
              console.log("user is not logged in", error);
            });
        }, 90000);
        setTickInterval(i);
        console.log("setting tick interval to", i);
      } else {
        console.log("turning off ticking");
        console.log("turning off tickInterval", tickInterval);
        setTickInterval(undefined);
        clearInterval(tickInterval);
      }
    },
    [tickInterval]
  );
  useEffect(() => {
    themeChange(false);
    if (jwtToken === "") {
      const requestOptions: RequestInit = {
        method: "GET",
        credentials: "include",
      };

      fetch(`http://localhost:4000/v1/refresh`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            setJwtToken(data.access_token);
            toggleRefresh(true);
          }
        })
        .catch((error) => {
          console.log("user is not logged in", error);
        });
    }
  }, [jwtToken, toggleRefresh]);
  return (
    <>
      <div className="flex flex-col h-screen justify-between">
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/movies">Movies</Link>
                </li>
                <li>
                  <Link to="/genres">Genres</Link>
                </li>
                {jwtToken !== "" && (
                  <>
                    <li>
                      <Link to="/admin/movie/0">Add Movie</Link>
                    </li>
                    <li>
                      <Link to="/manage-catalogue">Edit Movie</Link>
                    </li>
                  </>
                )}
                <li>
                  <Link to="/graphql">GraphQL</Link>
                </li>
                <li>
                  <a
                    href="http://localhost:4000/swagger/index.html"
                    target="_blank"
                  >
                    SwaggerAPI
                  </a>
                </li>
              </ul>
            </div>
            <a className="btn btn-ghost normal-case text-xl">Movie</a>
          </div>
          <div className="navbar-center"></div>
          <div className="navbar-end">
            <select className="select" data-choose-theme>
              <option disabled value="">
                Pick a theme
              </option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="dracula">Dracula</option>
            </select>
            {jwtToken === "" ? (
              <Link to="/login">
                <button className="btn btn-primary mx-4 px-5">Login</button>
              </Link>
            ) : (
              <button onClick={logOut} className="btn btn-primary mx-4 px-5">
                Logout
              </button>
            )}
          </div>
        </div>
        <div className="mb-auto px-4">
          <div className="flex flex-col">
            <div className="devider py-2" />
            <div className="gird">
              <Alert message={alertMessage} className={alertClassName} />
            </div>
            <div className="devider py-2" />
            <div className="gird">
              <Outlet
                context={{
                  jwtToken,
                  setJwtToken,
                  setAlertMessage,
                  setAlertClassName,
                  toggleRefresh,
                }}
              />
            </div>
          </div>
        </div>
        <footer className="footer footer-center p-4 bg-base-100 text-base-content">
          <div>
            <p>Copyright © 2023 - tirzasrwn</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
