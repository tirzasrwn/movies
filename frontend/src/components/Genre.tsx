import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { MovieData } from "./Movie.type";
import { ErrorResponse } from "./Error.type";

export const Genre = () => {
  const location = useLocation();
  const { genreName } = location.state;

  const [movies, setMovies] = useState<MovieData[]>([]);

  let { id } = useParams();

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    fetch(`http://localhost:4000/v1/movies/genres/${id}`, requestOptions)
      .then((response: Response) => response.json())
      .then((data: unknown) => {
        if ((data as ErrorResponse).error) {
          console.log((data as ErrorResponse)?.message);
        } else {
          setMovies(data as MovieData[]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <>
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title text-center">
            List of Movies for Genre {genreName}
          </h2>
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
                      <Link to={`/movies/${m.id}`}>{m.title}</Link>
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
