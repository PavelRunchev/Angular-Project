import { GameModel } from '../../components/games/models/game.model';

export interface GamesState {
    all: GameModel[],
    allSearch: GameModel[],
    detail: GameModel,
    toEdit: GameModel
}