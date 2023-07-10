import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GenreData } from "./Genre.type";
import { ErrorResponse } from "./Error.type";

export const Genres = () => {
  const [genres, setGenres] = useState<GenreData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    fetch(`http://localhost:4000/v1/genres`, requestOptions)
      .then((response) => response.json())
      .then((data: unknown) => {
        if ((data as ErrorResponse)?.error) {
          setError((data as ErrorResponse)?.message);
        } else {
          setGenres(data as GenreData[]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (error !== null) {
    return <div>Error: {error}</div>;
  } else {
    return (
      <>
        <div className="card w-full bg-base-200">
          <div className="card-body">
            <h2 className="card-title">List of Genres</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <tbody>
                  {genres.map((g: GenreData) => (
                    <tr key={g.id}>
                      <th key={g.id}>
                        <Link
                          key={g.id}
                          className=""
                          to={`/genres/${g.id}`}
                          state={{
                            genreName: g.genre,
                          }}
                        >
                          {g.genre}
                        </Link>
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
};
