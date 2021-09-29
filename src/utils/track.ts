import { TrackData } from '@/model/track-data';
import { AudioResource, createAudioResource } from '@discordjs/voice';
import * as ytdl from 'ytdl-core';

export class Track implements TrackData {
  public readonly url: string;
  public readonly title: string;
  public readonly author: string;
  public readonly duration: string;
  public readonly onStart: () => void; // Execute this when start playing
  public readonly onFinish: () => void; // Execute this when finish playing
  public readonly onError: (error: Error) => void; // Execute this when error

  constructor({
    url,
    title,
    author,
    duration,
    onStart,
    onFinish,
    onError,
  }: TrackData) {
    this.url = url;
    this.title = title;
    this.author = author;
    this.duration = duration;
    this.onStart = onStart;
    this.onFinish = onFinish;
    this.onError = onError;
  }

  /**
   * Creates an AudioResource from this Track.
   */
  public createAudioResource(): AudioResource<Track> {
    return createAudioResource(
      ytdl(this.url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25, // workaround for conflict between ytdl and node 16
      })
    );
  }
}
