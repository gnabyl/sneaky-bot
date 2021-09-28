import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  entersState,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { StageChannel, VoiceChannel } from 'discord.js';
import { Track } from './track';

/**
 * A QueueObject is an item in the SongQueue, which holds infor about connections/players and queue of songs.
 */
export class QueueObject {
  public readonly voiceConnection: VoiceConnection;
  public readonly audioPlayer: AudioPlayer;
  public readonly voiceChannel: VoiceChannel | StageChannel;
  public songs: Track[];
  public isLocked = false;
  public isConnecting = false;

  public constructor(
    voiceConnection: VoiceConnection,
    voiceChannel: VoiceChannel | StageChannel
  ) {
    this.voiceConnection = voiceConnection;
    this.audioPlayer = createAudioPlayer();
    this.songs = [];

    this.voiceChannel = voiceChannel;

    this.voiceConnection.on('stateChange', async (_, newState) => {
      if (newState.status === VoiceConnectionStatus.Disconnected) {
        // Try to reconnect here?
      } else if (newState.status === VoiceConnectionStatus.Destroyed) {
        // The connection has been destroyed
        this.stop();
      } else if (
        !this.isConnecting &&
        (newState.status === VoiceConnectionStatus.Connecting ||
          newState.status === VoiceConnectionStatus.Signalling)
      ) {
        /*
            In the Signalling or Connecting states, we wait for the connection to become ready
            before destroying the voice connection.
        */
        this.isConnecting = true;
        try {
          await entersState(
            this.voiceConnection,
            VoiceConnectionStatus.Ready,
            10000
          );
        } catch {
          if (
            this.voiceConnection.state.status !==
            VoiceConnectionStatus.Destroyed
          )
            this.voiceConnection.destroy();
        } finally {
          this.isConnecting = false;
        }
      }
    });

    // Configure audio player
    // https://discordjs.github.io/voice/interfaces/audioplayerbufferingstate.html#resource
    // https://discordjs.github.io/voice/classes/audioresource.html#metadata
    this.audioPlayer.on('stateChange', (oldState, newState) => {
      if (
        newState.status === AudioPlayerStatus.Idle &&
        oldState.status !== AudioPlayerStatus.Idle
      ) {
        // Previous state is non-idle => Has just finish playing
        // Non-idle AudioPlayerStatus has a property called `resource` which is the last resource played
        (oldState.resource as AudioResource<Track>).metadata.onFinish();
        this.playNext();
      } else if (newState.status === AudioPlayerStatus.Playing) {
        // If the Playing state has been entered, then a new track has started playback.
        (newState.resource as AudioResource<Track>).metadata.onStart();
      }
    });

    this.audioPlayer.on('error', (error) =>
      (error.resource as AudioResource<Track>).metadata.onError(error)
    );

    this.voiceConnection.subscribe(this.audioPlayer);
  }

  /**
   * Adds a new Track to the queue.
   *
   * @param track The track to add to the queue
   */
  public addTrack(track: Track) {
    this.songs.push(track);
    this.playNext();
  }

  /**
   * Stops audio playback
   */
  public stop() {
    this.isLocked = true;
    this.audioPlayer.stop(true);
  }

  /**
   * Attempts to play a Track from the queue
   */
  private playNext() {
    // If the queue is locked (already being processed), is empty, or the audio player is already playing something, return
    if (
      this.isLocked ||
      this.audioPlayer.state.status !== AudioPlayerStatus.Idle ||
      this.songs.length === 0
    ) {
      return;
    }
    // Lock the queue
    this.isLocked = true;

    // Take the first item from the queue
    const nextTrack = this.songs.shift();

    try {
      // Attempt to convert the Track into an AudioResource (i.e. start streaming the video)
      const resource = nextTrack.createAudioResource();
      resource.metadata = nextTrack;
      this.audioPlayer.play(resource);
    } catch (error) {
      // If an error occurred, try the next item of the queue instead
      nextTrack.onError(error as Error);
      this.playNext();
    }
    this.isLocked = false;
  }
}
