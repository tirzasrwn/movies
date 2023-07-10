import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { MovieData } from "./Movie.type";

export const ManageCatalogue = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const { jwtToken } = useOutletContext<{ jwtToken: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (jwtToken === "") {
      navigate("/login");
      return;
    }
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + jwtToken);

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    fetch(`http://localhost:4000/v1/admin/movies`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [jwtToken, navigate]);

  return (
    <>
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title text-center">Manage Cataloge</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Release Date</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m: MovieData) => (
                  <tr className="hover" key={m.id}>
                    <td className="px-6 py-4">
                      <Link to={`/admin/movie/${m.id}`}>{m.title}</Link>
                    </td>
                    <td>{m.release_date}</td>
                    <td>{m.mpaa_rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
