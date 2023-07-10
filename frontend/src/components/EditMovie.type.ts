import { GenreData } from "./Genre.type";
import { MovieData } from "./Movie.type";

export type Check = {
  id: number;
  genre: string;
  checked: boolean;
};

export type EditMovieResponse = {
  movie: MovieData;
  genres: GenreData[];
};
