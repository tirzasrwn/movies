import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MovieData } from "./Movie.type";

export const Movie = () => {
  const [movie, setMovie] = useState<MovieData>({} as MovieData);
  let { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    fetch(`http://localhost:4000/v1/movies/${id}`, requestOptions)
      .then((response: Response) => {
        if (response.status !== 200) {
          console.log("movie not found:", response);
          navigate("/movies");
        }
        return response.json();
      })
      .then((data: unknown) => {
        setMovie(data as MovieData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, navigate]);

  if (movie.genres) {
    movie.genres = Object.values(movie.genres);
  } else {
    movie.genres = [];
  }

  return (
    <>
      <div className="flex items-center card lg:card-side bg-base-200 shadow-xl">
        <div className="flex-shrink min-w-md max-w-md w-full rounded-full">
          <figure>
            <img src={movie.image} alt={movie.title} />
          </figure>
        </div>
        <div className="card-body">
          <small>
            <em>
              {movie.release_date}, {movie.runtime} minutes, Rated{" "}
              {movie.mpaa_rating}
            </em>
          </small>
          <h2 className="card-title">{movie.title}</h2>
          <div className="card-actions items-center">
            {movie.genres.map((g) => (
              <Link
                to={`/genres/${g.id}`}
                state={{
                  genreName: g.genre,
                }}
                key={g.id}
              >
                <div className="badge badge-outline" key={g.id}>
                  {g.genre}
                </div>
              </Link>
            ))}
          </div>
          <p>{movie.description}</p>
        </div>
      </div>
    </>
  );
};
