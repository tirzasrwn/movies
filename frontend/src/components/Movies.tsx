import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type MovieData = {
  id: number;
  title: string;
  release_date: string;
  mpaa_rating: string;
};

export const Movies = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    fetch(`http://localhost:4000/v1/movies`, requestOptions)
      .then((response: Response) => response.json())
      .then((data: MovieData[]) => {
        setMovies(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title text-center">List of Movies</h2>
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
