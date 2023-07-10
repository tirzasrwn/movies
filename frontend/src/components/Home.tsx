import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <>
      <div className="card w-full bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Hello there!</h2>
          <p>Go see list of movies..</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">
              <Link to="/movies">Movies</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
