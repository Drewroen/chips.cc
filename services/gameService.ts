import { Constants } from '../constants/constants';
import { Game } from '../objects/game';
import { ForceTile } from '../objects/gameTiles/terrain/forceTile';
import { BlockTile } from '../objects/mobTile';
import { Helper } from '../static/helper';
import { MobService } from './mobService';
import { PlayerService } from './playerService';

export class GameService {
  static tick(game: Game) {
    if (game.gameStatus === Constants.GAME_STATUS_PLAYING) {
      game.timer.tick();
      if (game.timer.remaining <= 0) this.endGameplay(game);

      game.mobs
        .filter((mob) => game.findMobTile(mob.id) instanceof BlockTile)
        .forEach((block) => {
          (game.findMobTile(block.id) as BlockTile).lastHitTime--;
        });

      game.gameTick++;
      game.players?.map((player) => {
        player.incrementCooldown();
        if (!player.alive) {
          player.incrementRespawnTime();
          if (player.respawnTimer === 0 && !player.playerHasQuit)
            game.addPlayerToGame(player.id, player.name);
        }
        if (!game.findPlayerTile(player.id) && player.alive) player.kill();
      });
      game.players?.forEach((player) => {
        const playerCoords = game.findPlayerCoordinates(player.id);
        if (playerCoords) {
          const playerTerrain = game.gameMap.getTerrainTile(
            playerCoords
          );
          if (
            playerCoords &&
            player.slipCooldown <= 0 &&
            Helper.isForceField(playerTerrain.value) &&
            !player.inventory.forceBoots
          ) {
            const forceTile = playerTerrain as ForceTile;
            const playerTile = game.findPlayerTile(player.id);
            PlayerService.movePlayer(
              game,
              playerTile,
              forceTile.direction,
              Constants.MOVE_TYPE_AUTOMATIC
            );
            player.slipCooldown = Constants.MOVEMENT_SPEED;
            player.cooldown = 1;
          } else if (
            playerCoords &&
            player.slipCooldown <= 0 &&
            Helper.isRandomForceField(playerTerrain.value) &&
            !player.inventory.forceBoots
          ) {
            const forceTile = playerTerrain as ForceTile;
            forceTile.direction = Math.floor(Math.random() * 4);
            const playerTile = game.findPlayerTile(player.id);
            PlayerService.movePlayer(
              game,
              playerTile,
              forceTile.direction,
              Constants.MOVE_TYPE_AUTOMATIC
            );
            player.slipCooldown = Constants.MOVEMENT_SPEED;
            player.cooldown = 1;
          } else if (
            playerCoords &&
            player.slipCooldown <= 0 &&
            Helper.isIce(playerTerrain.value) &&
            !player.inventory.iceSkates
          ) {
            const playerTile = game.findPlayerTile(player.id);
            PlayerService.movePlayer(
              game,
              playerTile,
              playerTile.direction,
              Constants.MOVE_TYPE_AUTOMATIC
            );
            player.slipCooldown = Constants.MOVEMENT_SPEED;
            player.cooldown = Constants.MOVEMENT_SPEED / 2;
          } else if (
            playerCoords &&
            playerTerrain.value === Constants.TERRAIN_TELEPORT
          ) {
            const possibleTeleports = game.getTeleportLocations()
              .filter(
                (coords) =>
                  !(
                    coords.x === playerCoords.x &&
                    coords.x === playerCoords.y
                  )
              )
              .concat([playerCoords]);

            let teleported = false;
            let previousCoords = playerCoords;
            possibleTeleports.forEach((coords) => {
              if (!teleported && player.alive) {
                game.gameMap.setMobTile(
                  coords,
                  game.findPlayerTile(player.id)
                );
                if (
                  !(
                    previousCoords.x === coords.x &&
                    previousCoords.y === coords.y
                  )
                )
                  game.gameMap.setMobTile(
                    previousCoords,
                    null
                  );
                const playerTile = game.findPlayerTile(player.id);
                PlayerService.movePlayer(
                  game,
                  playerTile,
                  playerTile.direction,
                  Constants.MOVE_TYPE_AUTOMATIC
                );
                previousCoords = coords;
              }
              const movedPlayerCoords = game.findPlayerCoordinates(player.id);
              if (
                movedPlayerCoords &&
                game.gameMap.getTerrainTile(
                  movedPlayerCoords
                ).value !== Constants.TERRAIN_TELEPORT
              )
                teleported = true;
            });
            const finalPlayerCoords = game.findPlayerCoordinates(player.id);
            if (
              finalPlayerCoords &&
              finalPlayerCoords.x === playerCoords.y &&
              finalPlayerCoords.x === playerCoords.y
            ) {
              const playerTile = game.findPlayerTile(player.id);
              PlayerService.movePlayer(
                game,
                playerTile,
                (playerTile.direction + 2) % 4,
                Constants.MOVE_TYPE_AUTOMATIC
              );
            }
          }
          if (
            player.cooldown <= 0 &&
            player.movement[0] !== null &&
            player.keyEligibleForMovement()
          ) {
            const playerTile = game.findPlayerTile(player.id);
            if (playerTile) {
              PlayerService.movePlayer(
                game,
                playerTile,
                player.movement[0].direction,
                Constants.MOVE_TYPE_PLAYER
              );
            }
          }
          player.movement.forEach((move) => move.timeHeld++);
        }
      });
      if (game.gameTick % Constants.MOVEMENT_SPEED === 0) {
        game.mobs?.forEach((mob) => {
          const mobCoords = game.findMobTileCoordinates(mob.id);
          if (mobCoords) {
            const terrainTile = game.gameMap.getTerrainTile(
              mobCoords
            );
            if (
              mob.alive &&
              terrainTile.value !== Constants.TERRAIN_CLONE_MACHINE
            ) {
              const mobTile = game.findMobTile(mob.id);
              if (terrainTile.value === Constants.TERRAIN_TELEPORT) {
                const possibleTeleports = game.getTeleportLocations()
                  .filter(
                    (coords) =>
                      !(
                        coords.x === mobCoords.x && coords.y === mobCoords.y
                      )
                  )
                  .concat([mobCoords]);

                let teleported = false;
                let previousCoords = mobCoords;
                possibleTeleports.forEach((coords) => {
                  if (!teleported && mob.alive) {
                    game.gameMap.setMobTile(coords, mobTile);
                    if (
                      !(
                        previousCoords.x === coords.x &&
                        previousCoords.y === coords.y
                      )
                    )
                      game.gameMap.setMobTile(
                        previousCoords,
                        null
                      );
                    MobService.move(game, game.findMobTile(mob.id));
                    previousCoords = coords;
                  }
                  const movedMobCoords = game.findPlayerCoordinates(mob.id);
                  if (
                    movedMobCoords &&
                    game.gameMap.getTerrainTile(
                      movedMobCoords
                    ).value !== Constants.TERRAIN_TELEPORT
                  )
                    teleported = true;
                });
                const finalMobCoords = game.findPlayerCoordinates(mob.id);
                if (
                  finalMobCoords &&
                  finalMobCoords.x === mobCoords.x &&
                  finalMobCoords.y === mobCoords.y
                ) {
                  mobTile.direction = (mobTile.direction + 2) % 4;
                  MobService.move(game, mobTile);
                }
              } else if (
                game.gameTick % (mobTile.speed * Constants.MOVEMENT_SPEED) ===
                0 &&
                !Helper.isForceField(terrainTile.value) &&
                !Helper.isIce(terrainTile.value) &&
                !Helper.isRandomForceField(terrainTile.value) &&
                !(mobTile instanceof BlockTile)
              )
                MobService.move(game, mobTile);
              else if (
                Helper.isForceField(terrainTile.value) ||
                Helper.isIce(terrainTile.value) ||
                Helper.isRandomForceField(terrainTile.value)
              ) {
                MobService.move(game, mobTile);
              }
            }
          }
        });
      }
      if (game.gameTick % Constants.GAME_FPS == 0)
        game.gameMap.spawnItems();
    } else if (game.gameStatus === Constants.GAME_STATUS_NOT_STARTED) {
      game.timer.tick();
      if (game.timer.remaining <= 0) this.startGamePlay(game);
    } else if (game.gameStatus === Constants.GAME_STATUS_FINISHED) {
      game.timer.tick();
    }
  }

  private static endGameplay(game: Game): void {
    game.timer.restart(Constants.GAME_STATUS_FINISHED);
    game.gameStatus = Constants.GAME_STATUS_FINISHED;
  }

  private static startGamePlay(game: Game): void {
    game.timer.restart(Constants.GAME_STATUS_PLAYING);
    game.gameStatus = Constants.GAME_STATUS_PLAYING;
  }
}