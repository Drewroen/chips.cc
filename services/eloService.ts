import { EloResult } from "./../objects/eloResult";
import { Constants } from "./../constants/constants";
import { GameRoom } from "./../objects/gameRoom";
import { Dynamo } from "./../static/dynamo/dynamo";

export class EloService {
  public dynamoDb: AWS.DynamoDB.DocumentClient;

  constructor(dynamoDb: AWS.DynamoDB.DocumentClient) {
    this.dynamoDb = dynamoDb;
  }

  async calculateEloValues(game: GameRoom): Promise<EloResult[]> {
    const accountsToScore = game.game.players
      .map((player) => player.name)
      .filter((name) => name !== "Chip");

    const accountParams: any = {
      RequestItems: {
        ChipsMMOAccounts: {
          Keys: accountsToScore.map((name) => {
            return { Username: name };
          }),
        },
      },
    };

    const accountBatchGetResponse = await Dynamo.batchGet(
      accountParams,
      this.dynamoDb
    );

    const eloResults: EloResult[] =
      accountBatchGetResponse.Responses.ChipsMMOAccounts.map((account) => {
        return new EloResult(
          account.Username as string,
          account.ELO as number,
          account.ELO as number
        );
      });

    for (let i = 0; i < eloResults.length; i++)
      for (let j = i + 1; j < eloResults.length; j++) {
        const firstPlayer = game.game.players.filter(
          (player) => player.name === eloResults[i].id
        )[0];
        const secondPlayer = game.game.players.filter(
          (player) => player.name === eloResults[j].id
        )[0];
        if (firstPlayer.score > secondPlayer.score || firstPlayer.winner) {
          const eloChange = this.calculateRatingChange(
            eloResults[i].previousElo,
            eloResults[j].previousElo
          );
          eloResults[i].newElo += eloChange;
          eloResults[j].newElo -= eloChange;
        } else if (
          secondPlayer.score > firstPlayer.score ||
          firstPlayer.winner
        ) {
          const eloChange = this.calculateRatingChange(
            eloResults[j].previousElo,
            eloResults[i].previousElo
          );
          eloResults[j].newElo += eloChange;
          eloResults[i].newElo -= eloChange;
        }
      }

    return eloResults;
  }

  async updateEloValues(eloResults: EloResult[]) {
    eloResults.forEach(async (result) => {
      const accountResponse = await Dynamo.get(
        this.createEloRequest(result.id),
        this.dynamoDb
      );
      const updateEloRequest = this.createUpdateEloRequest(
        accountResponse,
        result.newElo
      );

      await Dynamo.put(updateEloRequest, this.dynamoDb);
    });
  }

  private calculateRatingChange(winnerElo: number, loserElo: number) {
    const winnerExpected =
      1.0 / (1.0 + Math.pow(10, (loserElo - winnerElo) / 400));
    return Math.round(
      Math.max(
        Constants.ELO_MAX_RATING_CHANGE * (1 - winnerExpected),
        Constants.ELO_MIN_RATING_CHANGE
      )
    );
  }

  private createEloRequest(id: string): any {
    return {
      TableName: "ChipsMMOAccounts",
      Key: {
        Username: id,
      },
    };
  }

  private createUpdateEloRequest(user: any, newElo: number) {
    return {
      TableName: "ChipsMMOAccounts",
      Item: {
        Username: user.Item.Username,
        Password: user.Item.Password,
        Banned: user.Item.Banned,
        ELO: newElo,
        Email: user.Item.Email,
        Verified: user.Item.Verified,
      },
    };
  }
}
