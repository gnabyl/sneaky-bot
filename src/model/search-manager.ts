import { SearchStrategy } from '@/model/search-strategy';
import { Track } from '@/utils/track';
import { YoutubeSearchStrategy } from '@/utils/youtube-search-strategy';

const availableSearchStrategies: SearchStrategy[] = [
  new YoutubeSearchStrategy(),
];

export class SearchManager {
  public static async search(input: string): Promise<Track> {
    const strategies = availableSearchStrategies.filter((s) => s.canGet(input));
    const searching = strategies.map((s) => s.getTrack(input));

    return Promise.all(searching).then((values) => {
      return values.find((r) => r !== null);
    });
  }
}
