import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GameModel } from './models/game.model';
import { MyGameModel } from './models/my-game.model';
import { CreateGameModel } from './models/create-game.model';
import { CreateMyGameModel } from './models/create-my-game.model';

import { Observable } from '../../../../node_modules/rxjs';
import { AppState } from '../../store/app.state';
import { Store } from '../../../../node_modules/@ngrx/store';
import { map } from 'rxjs/operators';
import { GetAllGames, GetAllSearchedGames } from './../../store/actions/games.actions';
import { GetGameDetail, GetGameToEdit } from '../../store/actions/games.actions';

const appKey = "kid_SJkb3YSIQ";

const createGameUrl = `https://baas.kinvey.com/appdata/${appKey}/games`;
const allGamesUrl = `https://baas.kinvey.com/appdata/${appKey}/games?query={}&sort={"_kmd.ect": -1}`;
const detailsGameUrl = `https://baas.kinvey.com/appdata/${appKey}/games/`;
const editGameUrl = `https://baas.kinvey.com/appdata/${appKey}/games/`;
const gameById = `https://baas.kinvey.com/appdata/${appKey}/games/`;

const createMyGameUrl = `https://baas.kinvey.com/appdata/${appKey}/myGamesStore`;
const myDetailsGameUrl = `https://baas.kinvey.com/appdata/${appKey}/myGamesStore/`;
const postedAllGamesUrl = `https://baas.kinvey.com/appdata/${appKey}/myGamesStore?query={"isPost":true}&sort={"rank": -1}`;
const postGameUrl = `https://baas.kinvey.com/appdata/${appKey}/myGamesStore/`;

@Injectable()
export class GameService {
    constructor(
        private http: HttpClient, 
        private store: Store<AppState>
    ) { }

    createGame(body: CreateGameModel) {
        return this.http.post(createGameUrl, JSON.stringify(body),
            {
                headers: this.createAuthHeader()
            }
        );
    }

    getAllGames() {
        return this.http.get<GameModel[]>(allGamesUrl,
            {
                headers: this.createAuthHeader()
            }
        ).pipe(map((res: Response) => {
            const items = Object.keys(res);
            const games: GameModel[] = [];

            for (let i of items) {
                games.push(res[i]);
            }

            this.store.dispatch(new GetAllGames(games));
        }));
    }

    searchGame(value: string) {
        const searchGameUrl = `https://baas.kinvey.com/appdata/${appKey}/games?query={"title":"${value}"}&sort={"_kmd.ect": -1}`;
        return this.http.get<GameModel[]>(searchGameUrl,
            {
                headers: this.createAuthHeader()
            }
        ).pipe(map((res: Response) => {
            const items = Object.keys(res);
            const games: GameModel[] = [];

            for (let i of items) {
                games.push(res[i]);
            }

            this.store.dispatch(new GetAllSearchedGames(games));
        }));
    }

    detailsGame(id: string) {
        return this.http.get<GameModel>(detailsGameUrl + id,
            {
                headers: this.createAuthHeader()
            }
        ).pipe(map((game: GameModel) => {
            this.store.dispatch(new GetGameDetail(game));
        }));
    }

    getToEditById(id: string) {
        return this.http.get<GameModel>(detailsGameUrl + id,
            {
                headers: this.createAuthHeader()
            }
        ).pipe(map((game: GameModel) => {
            this.store.dispatch(new GetGameToEdit(game));
        }));
    }

    removeGame(id: string) {
        return this.http.delete<GameModel>(gameById + id,
            {
                headers: this.createAuthHeader()
            }
        );
    }

    editGame(id: string, body: GameModel) {
        return this.http.put<GameModel>(editGameUrl + id, JSON.stringify(body),
            {
                headers: this.createAuthHeader()
            }
        );
    }

    createMyGame(body: CreateMyGameModel) {
        return this.http.post(createMyGameUrl, body,
            {
                headers: this.createAuthHeader()
            }
        );
    }

    getMyGames() {
        let user = localStorage.getItem('username');
        const myGamesUrl = `https://baas.kinvey.com/appdata/${appKey}/myGamesStore?query={"taker":"${user}"}&sort={"_kmd.ect": -1}`;
        return this.http.get<MyGameModel[]>(myGamesUrl,
            {
                headers: this.createAuthHeader()
            }
        );
    }

    myDetailsGame(id: string) {
        return this.http.get<MyGameModel>(myDetailsGameUrl + id, 
            {
                headers: this.createAuthHeader()
            }
        );
    }

    postedAllGames() {
        return this.http.get<MyGameModel[]>(postedAllGamesUrl,
            {
                headers: this.createAuthHeader()
            }
        );
    }

    removeMyGame(id: string) {
        return this.http.delete<MyGameModel>(myDetailsGameUrl + id,
            {
                headers: this.createAuthHeader()
            }
        );
    }

    postGame(id: string, body: MyGameModel) {
        return this.http.put<MyGameModel>(postGameUrl + id, body, 
            {
                headers: this.createAuthHeader()
            }
        );
    }

    createAuthHeader() {
        return new HttpHeaders({
            'Authorization': `Kinvey ${localStorage.getItem('authtoken')}`,
            'Content-Type': 'application/json'
        });
    }
}
