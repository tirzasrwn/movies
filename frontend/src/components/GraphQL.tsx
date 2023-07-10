import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "./form/Input";
import { MovieData } from "./Movie.type";

type GraphResponse = {
  data: {
    list: MovieData[];
    search: MovieData[];
  };
};

export const GraphQL = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fullList, setFullList] = useState<MovieData[]>([]);

  const peformSearch = () => {
    const payload = `
        {
            search(titleContains: "${searchTerm}") {
                id
                title
                runtime
                release_date
                mpaa_rating
            }
        }`;

    const headers = new Headers();
    headers.append("Content-Type", "application/grapql");

    const requestOptions: RequestInit = {
      method: "POST",
      headers: headers,
      body: payload,
    };

    fetch(`http://localhost:4000/v1/graph`, requestOptions)
      .then((response: Response) => response.json())
      .then((d: unknown) => {
        let theList: MovieData[] = Object.values(
          (d as GraphResponse).data.search
        );
        setMovies(theList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    let value = event.target.value;
    setSearchTerm(value);
    if (value.length > 2) {
      peformSearch();
    } else {
      setMovies(fullList);
    }
  };

  useEffect(() => {
    const payload = `
        {
            list {
                id
                title
                runtime
                release_date
                mpaa_rating
            }
        }`;

    const headers = new Headers();
    headers.append("Content-Type", "application/grapql");

    const requestOptions: RequestInit = {
      method: "POST",
      headers: headers,
      body: payload,
    };

    fetch(`http://localhost:4000/v1/graph`, requestOptions)
      .then((response: Response) => response.json())
      .then((d: unknown) => {
        let theList: MovieData[] = Object.values(
          (d as GraphResponse).data.list
        );
        setMovies(theList);
        setFullList(theList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="card w-full bg-base-200">
      <div className="card-body">
        <h2 className="card-title">GraphQL</h2>
        <div className="devider px-2"></div>

        <form onSubmit={handleSubmit}>
          <Input
            title={"Search"}
            type={"search"}
            name={"search"}
            className={""}
            value={searchTerm}
            onChange={handleChange}
          />
        </form>
        <div className="card bg-base-300">
          {movies ? (
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Release Date</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <Link to={`/movies/${m.id}`}>{m.title}</Link>
                    </td>
                    <td>{new Date(m.release_date).toLocaleDateString()}</td>
                    <td>{m.mpaa_rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No movies (yet)!</p>
          )}
        </div>
      </div>
    </div>
  );
};
