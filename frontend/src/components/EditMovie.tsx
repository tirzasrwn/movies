import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { GenreData } from "./Genre.type";
import { Check, EditMovieResponse } from "./EditMovie.type";

import { MovieData } from "./Movie.type";
import { ErrorResponse } from "./Error.type";
import { Input } from "./form/Input";
import { Select } from "./form/Select";
import { TextArea } from "./form/TextArea";
import { Checkbox } from "./form/Checkbox";

export const EditMovie = () => {
  const navigate = useNavigate();
  const { jwtToken } = useOutletContext<{ jwtToken: string }>();

  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const mpaaOptions = [
    { id: "G", value: "G" },
    { id: "PG", value: "PG" },
    { id: "PG13", value: "PG13" },
    { id: "R", value: "R" },
    { id: "NC17", value: "NC17" },
    { id: "18A", value: "18A" },
  ];

  const hasError = (key: string) => {
    return errors.indexOf(key) !== -1;
  };

  const [movie, setMovie] = useState<MovieData>({
    id: 0,
    title: "",
    release_date: "",
    runtime: 0,
    mpaa_rating: "",
    description: "",
    genres: [],
    image: "",
    genres_array: [],
  });

  // get id from the URL
  let { id } = useParams();
  if (id === undefined) {
    id = "0";
  }

  useEffect(() => {
    if (jwtToken === "") {
      navigate("/login");
      return;
    }

    if (id === "0") {
      // adding a movie
      setMovie({
        id: 0,
        title: "",
        release_date: "",
        runtime: 0,
        mpaa_rating: "",
        description: "",
        genres: [],
        image: "",
        genres_array: [],
      });

      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      const requestOptions = {
        method: "GET",
        headers: headers,
      };

      fetch(`http://localhost:4000/v1/genres`, requestOptions)
        .then((response) => response.json())
        .then((data: GenreData[]) => {
          const checks: Check[] = [];

          data.forEach((g: GenreData) => {
            checks.push({ id: g.id, checked: false, genre: g.genre });
          });

          setMovie((m) => ({
            ...m,
            genres: checks,
            genres_array: [],
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // editing an existing movie
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", "Bearer " + jwtToken);

      const requestOptions = {
        method: "GET",
        headers: headers,
      };

      fetch(`http://localhost:4000/v1/admin/movies/${id}`, requestOptions)
        .then((response: Response) => {
          if (response.status !== 200) {
            setError("Invalid response code: " + response.status);
          }
          return response.json();
        })
        .then((data: EditMovieResponse) => {
          console.log("-->data:", data);
          // fix release date
          data.movie.release_date = new Date(data.movie.release_date)
            .toISOString()
            .split("T")[0];

          const checks: Check[] = [];

          data.genres.forEach((g: GenreData) => {
            if (data.movie.genres_array.indexOf(g.id) !== -1) {
              checks.push({ id: g.id, checked: true, genre: g.genre });
            } else {
              checks.push({ id: g.id, checked: false, genre: g.genre });
            }
          });

          // set state
          setMovie({
            ...data.movie,
            genres: checks,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id, jwtToken, navigate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let errors = [];
    let required = [
      { field: movie.title, name: "title" },
      { field: movie.image, name: "image" },
      { field: movie.release_date, name: "release_date" },
      { field: movie.runtime, name: "runtime" },
      { field: movie.description, name: "description" },
      { field: movie.mpaa_rating, name: "mpaa_rating" },
    ];

    required.forEach(function (obj) {
      if (obj.field === "") {
        errors.push(obj.name);
      }
    });

    if (movie.genres_array.length === 0) {
      alert("Error! You must choose at least one genre!");
      errors.push("genres");
    }

    setErrors(errors);

    if (errors.length > 0) {
      return false;
    }

    // passed validation, so save changes
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + jwtToken);

    // assume we are adding a new movie
    let method = "PUT";

    if (movie.id > 0) {
      method = "PATCH";
    }

    const requestBody = movie;
    // we need to covert the values in JSON for release date (to date)
    // and for runtime to int

    requestBody.release_date =
      new Date(movie.release_date).toISOString().split("T")[0] + "T00:00:00Z";
    requestBody.runtime = parseInt(movie.runtime.toString(), 10);

    let requestOptions: RequestInit = {
      body: JSON.stringify(requestBody),
      method: method,
      headers: headers,
      credentials: "include",
    };

    fetch(`http://localhost:4000/v1/admin/movies/${movie.id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          navigate("/manage-catalogue");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange =
    () =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      let value = event.target.value;
      let name = event.target.name;
      setMovie({
        ...movie,
        [name]: value,
      });
    };

  const handleCheck = (event: any, position: number) => {
    console.log("handleCheck called");
    console.log("value in handleCheck:", event.target.value);
    console.log("checked is", event.target.checked);
    console.log("position is", position);

    let tmpArr = movie.genres;
    tmpArr[position].checked = !tmpArr[position].checked;

    let tmpIDs: any = movie.genres_array;
    if (!event.target.checked) {
      tmpIDs.splice(tmpIDs.indexOf(event.target.value));
    } else {
      tmpIDs.push(parseInt(event.target.value, 10));
    }

    setMovie({
      ...movie,
      genres_array: tmpIDs,
    });
  };

  const confirmDelete = () => {
    var confirmation: Boolean = confirm("Delete movie?");
    if (confirmation) {
      let headers = new Headers();
      headers.append("Authorization", "Bearer " + jwtToken);

      const requestOptions: RequestInit = {
        method: "DELETE",
        headers: headers,
      };

      fetch(`http://localhost:4000/v1/admin/movies/${movie.id}`, requestOptions)
        .then((response: Response) => response.json())
        .then((data: unknown) => {
          if ((data as ErrorResponse).error == "true") {
            console.log(data as ErrorResponse);
          } else {
            navigate("/manage-catalogue");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  if (error !== null) {
    return <div>Error: {error}</div>;
  } else {
    return (
      <div className="card w-full bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Add/Edit Movie</h2>
          <div className="devider py-2"></div>
          {/* <pre>{JSON.stringify(movie, null, 3)}</pre> */}

          <form onSubmit={handleSubmit}>
            <input type="hidden" name="id" value={movie.id} id="id"></input>

            <Input
              title={"Title"}
              className={""}
              type={"text"}
              name={"title"}
              value={movie.title}
              onChange={handleChange()}
              errorDiv={hasError("title") ? "" : "hidden"}
              errorMsg={"Please enter a title"}
            />

            <Input
              title={"Image URL"}
              className={""}
              type={"text"}
              name={"image"}
              value={movie.image}
              onChange={handleChange()}
              errorDiv={hasError("title") ? "" : "hidden"}
              errorMsg={"Please enter a image url"}
            />

            <Input
              title={"Release Date"}
              className={""}
              type={"date"}
              name={"release_date"}
              value={movie.release_date}
              onChange={handleChange()}
              errorDiv={hasError("release_date") ? "" : "hidden"}
              errorMsg={"Please enter a release date"}
            />

            <Input
              title={"Runtime"}
              className={""}
              type={"number"}
              name={"runtime"}
              value={movie.runtime}
              onChange={handleChange()}
              errorDiv={hasError("runtime") ? "" : "hidden"}
              errorMsg={"Please enter a runtime"}
            />

            <Select
              title={"MPAA Rating"}
              name={"mpaa_rating"}
              options={mpaaOptions}
              value={movie.mpaa_rating}
              onChange={handleChange()}
              placeHolder={"Choose..."}
              errorMsg={"Please choose"}
              errorDiv={hasError("mpaa_rating") ? "" : "hidden"}
            />

            <TextArea
              title="Description"
              name={"description"}
              value={movie.description}
              rows={3}
              onChange={handleChange()}
              errorMsg={"Please enter a description"}
              errorDiv={hasError("description") ? "" : "hidden"}
            />

            <div className="devider py-2"></div>

            <div className="card bg-base-300">
              <div className="card-body">
                <h3 className="card-title">Genres</h3>
                {movie.genres && movie.genres.length > 1 && (
                  <>
                    {Array.from(movie.genres).map((g, index) => (
                      <Checkbox
                        title={g.genre}
                        name={"genre"}
                        key={index}
                        id={"genre-" + index.toString()}
                        onChange={(event) => handleCheck(event, index)}
                        value={g.id.toString()}
                        checked={movie.genres[index].checked}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="devider py-2"></div>

            <button className="btn btn-primary">Save</button>

            {movie.id > 0 && (
              <a
                href="#!"
                className="btn btn-danger ms-2"
                onClick={confirmDelete}
              >
                Delete Movie
              </a>
            )}
          </form>
        </div>
      </div>
    );
  }
};
