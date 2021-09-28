import { ISongQueue } from '@/model/song-queue';
import { QueueObject } from './queue-object';
import { Service } from 'typedi';

@Service()
export class QueueManager {
  queues: ISongQueue;

  constructor() {
    this.queues = new ISongQueue();
  }

  setQueue(guildId: string, queue: QueueObject) {
    this.queues.set(guildId, queue);
  }

  getQueue(guildId: string) {
    return this.queues.get(guildId);
  }

  deleteQueue(guildId: string) {
    this.queues.delete(guildId);
  }
}
