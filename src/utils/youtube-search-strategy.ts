import { isURL, SearchStrategy } from '@/model/search-strategy';
import { search } from 'yt-search';
import * as ytdl from 'ytdl-core';
import { Track } from './track';

export class YoutubeSearchStrategy implements SearchStrategy {
  canGet(input: string): boolean {
    if (!isURL(input)) {
      return true;
    }
    return ytdl.validateURL(input);
  }
  async getTrack(input: string): Promise<Track> {
    if (!isURL(input)) {
      const searchResult = (await search(input)).videos[0];
      return new Track({
        url: searchResult.url,
        title: searchResult.title,
        author: searchResult.author.name,
        duration: searchResult.timestamp,
      });
    } else {
      const searchResult = (await ytdl.getBasicInfo(input)).videoDetails;
      return new Track({
        url: searchResult.video_url,
        title: searchResult.title,
        author: searchResult.author.name,
        duration: searchResult.lengthSeconds,
      });
    }
  }
}
