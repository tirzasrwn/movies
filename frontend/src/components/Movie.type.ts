import { GenreData } from "./Genre.type";

export type MovieData = {
  id: number;
  title: string;
  release_date: string;
  mpaa_rating: string;
  genres: GenreData[];
  genres_array: number[];
  runtime: number;
  image: string;
  description: string;
};
