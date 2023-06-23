export abstract class GameEngine {
  public abstract addPoints(gameId: string, playerId: string, addedPoints: number): void;
}

export class SmartCampusGameEngine extends GameEngine {
  addPoints(gameId: string, playerId: string, addedPoints: number) {
    return;
  }
}