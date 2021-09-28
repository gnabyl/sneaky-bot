import { QueueObject } from '@/utils/queue-object';

export class ISongQueue extends Map<string, QueueObject> {
  static create(array?: any[]): ISongQueue {
    const inst = new Map<string, QueueObject>(array);
    return inst as ISongQueue;
  }
}
