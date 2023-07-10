import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ErrorResponse } from "./Error.type";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setJwtToken } = useOutletContext<{
    setJwtToken: (jwtToken: string) => void;
  }>();
  const { setAlertClassName } = useOutletContext<{
    setAlertClassName: (alertClassName: string) => void;
  }>();
  const { setAlertMessage } = useOutletContext<{
    setAlertMessage: (alertMessage: string) => void;
  }>();
  const { toggleRefresh } = useOutletContext<{
    toggleRefresh: (status: boolean) => void;
  }>();

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let payload: LoginPayload = {
      email: email,
      password: password,
    };
    console.log(payload);

    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    };

    fetch(`http://localhost:4000/v1/authenticate`, requestOptions)
      .then((response: Response) => response.json())
      .then((data: unknown) => {
        if ((data as ErrorResponse)?.error) {
          setAlertClassName("alert-error");
          setAlertMessage((data as ErrorResponse)?.message);
          setTimeout(() => {
            setAlertClassName("hidden");
            setAlertMessage("");
          }, 3000);
        } else {
          setJwtToken((data as LoginResponse)?.access_token);
          toggleRefresh(true);
          navigate("/");
        }
      })
      .catch((error) => {
        console.log("catch error:", error);
        navigate("/");
      });
  };

  return (
    <>
      <div className="card w-full bg-base-200 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Log in to your account!</h2>
          <div className="card-actions">
            <form
              className="grid grid-flow-row auto-rows-max"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full max-w-xs"
                onChange={(event) => setEmail(event.target.value)}
              />
              <div className="devider py-1"></div>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full max-w-xs"
                onChange={(event) => setPassword(event.target.value)}
              />
              <div className="devider py-1"></div>
              <button type="submit" className="btn btn-primary">
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="devider py-2"></div>
      <div className="card w-full bg-base-200">
        <div className="card-body items-center text-center">
          <h2 className="card-title">--- Creadential login for trial ---</h2>
          <p>email: admin@example.com</p>
          <p>password: secret</p>
        </div>
      </div>
    </>
  );
};
