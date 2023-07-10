import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { ErrorPage } from "./components/ErrorPage.tsx";
import { Home } from "./components/Home.tsx";
import { Movies } from "./components/Movies.tsx";
import { Genres } from "./components/Genres.tsx";
import { Movie } from "./components/Movie.tsx";
import { Genre } from "./components/Genre.tsx";
import { Login } from "./components/Login.tsx";
import { EditMovie } from "./components/EditMovie.tsx";
import { ManageCatalogue } from "./components/ManageCataloge.tsx";
import { GraphQL } from "./components/GraphQL.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/movies", element: <Movies /> },
      { path: "/genres", element: <Genres /> },
      { path: "/movies/:id", element: <Movie /> },
      { path: "/genres/:id", element: <Genre /> },
      { path: "/login", element: <Login /> },
      { path: "/admin/movie/0", element: <EditMovie /> },
      { path: "/admin/movie/:id", element: <EditMovie /> },
      { path: "/manage-catalogue", element: <ManageCatalogue /> },
      { path: "/graphql", element: <GraphQL /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
