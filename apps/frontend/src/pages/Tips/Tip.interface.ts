export interface TipsItem {
  tip_id: number;
  title: string;
  thumbnail: string;
  content: string;
  genres: {
    genre_id: number;
    title: string;
  }[];
}
