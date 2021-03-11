export class EloResult {
  id: string;
  previousElo: number;
  newElo: number;

  constructor(id: string, previousElo: number, newElo: number)
  {
    this.id = id;
    this.previousElo = previousElo;
    this.newElo = newElo;
  }
}
