import { QueueObject } from '@/utils/queue-object';

export class ISongQueue extends Map<string, QueueObject> {
  constructor(...args) {
    super(...args);
  }
}
