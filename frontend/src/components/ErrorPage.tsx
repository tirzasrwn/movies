import { useRouteError } from "react-router";
import { Link } from "react-router-dom";

export const ErrorPage = () => {
  const error: unknown = useRouteError();
  return (
    <>
      <div className="w-full p-4">
        <div className="card w-full bg-neutral text-neutral-content">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Opps!</h2>
            <p>Sorry, an unexpected error has occurred. Details: </p>
            <p>
              <em>
                {(error as { statusText: string })?.statusText ||
                  (error as Error)?.message}
              </em>
            </p>
            <div className="card-actions justify-end">
              <Link to="/">
                <button className="btn btn-primary">OK</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
