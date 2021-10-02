import { Track } from '@/utils/track';

/**
 * Check if a given string is a valid URL
 * @param str string to check
 * @returns true if valid url
 */
export function isURL(str: string): boolean {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return pattern.test(str);
}

/**
 * Search Strategy base interface
 */
export interface SearchStrategy {
  /**
   * Check if an input (url, song name) can be parsed by this strategy
   * @param input input string to check
   * @returns true if this input can be parsed by this strategy
   */
  canGet(input: string): boolean;
  /**
   * Create a track from input
   * @param input string to parse
   * @returns Track
   */
  getTrack(input: string): Promise<Track>;
}
