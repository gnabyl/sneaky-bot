/**
 * This is the data required to create a Track object
 */
export interface TrackData {
  title: string;
  author: string;
  url: string;
  duration: number;
  onStart: () => void;
  onFinish: () => void;
  onError: (error: Error) => void;
}