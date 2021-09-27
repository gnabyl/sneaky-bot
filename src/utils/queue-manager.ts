import { ISongQueue } from '@/model/song-queue';
import { Service } from 'typedi';
import { QueueObject } from './queue-object';

@Service()
export class QueueManager {
  queues: ISongQueue;

  constructor() {
    this.queues = new Map<string, QueueObject>();
  }

  setQueue(guildId: string, queue: QueueObject) {
    this.queues.set(guildId, queue);
  }

  getQueue(guildId: string) {
    return this.queues.get(guildId);
  }
}
