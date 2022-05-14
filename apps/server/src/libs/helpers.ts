import GameUser from "../containers/GameUser";

/**
 * @param excluded - Joueur à exclure
 * @returns
 */
export function except(exclude: GameUser): (other: GameUser) => boolean {
  return function (other: GameUser) {
    return other.playerId !== exclude.playerId;
  };
}
