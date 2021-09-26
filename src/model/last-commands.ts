export type ILastCommand = Map<string, Map<string, ICommandObject>>;

export interface ICommandObject {
  command?: Commands;
  results?: any;
}

export enum Commands {
  MATH = 'math',
  SEARCH = 'search',
  PLAY = 'play',
  SKIP = 'skip',
  LEAVE = 'leave',
  JOIN = 'join',
}
