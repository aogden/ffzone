import fetch from 'node-fetch';
import * as Contracts from './Contracts';
import { DataModel } from './Model';

const SEASON = 2018
const PERIOD_ID = 11

export class DataSource {
	public static async getData() : Promise<DataModel> {
		const scoreboardResp = await this.getScoreboard(PERIOD_ID);
		const boxPromises: Promise<Contracts.BoxScoreResponseBody>[] = [];
		scoreboardResp.scoreboard.matchups.forEach(matchup => {
			matchup.teams.forEach(team => boxPromises.push(this.getBoxscore(PERIOD_ID, team.teamId)))
		})
		const boxScoresResp = await Promise.all(boxPromises);
		const box = boxScoresResp.map(box => box.boxscore)
		const model = new DataModel(scoreboardResp.scoreboard, box, PERIOD_ID);
		console.log(model)
		console.log(PERIOD_ID)
		return model;
	}
	
	private static async getScoreboard(matchupPeriod:number) : Promise<Contracts.ScoreboardResponseBody> {
		console.log(process.env)
		const resp = await fetch(`http://games.espn.com/ffl/api/v2/scoreboard?leagueId=${process.env.REACT_APP_LEAGUE_ID}&seasonId=${SEASON}&matchupPeriodId=${matchupPeriod}`)
		const score:Contracts.ScoreboardResponseBody = await resp.json();
		return score;
	}
	
	private static async getBoxscore(matchupPeriod:number, teamId:number) : Promise<Contracts.BoxScoreResponseBody> {
		const resp = await fetch(`http://games.espn.com/ffl/api/v2/boxscore?leagueId=${process.env.REACT_APP_LEAGUE_ID}&seasonId=${SEASON}&matchupPeriodId=${matchupPeriod}&teamId=${teamId}`)
		const boxscore:Contracts.BoxScoreResponseBody = await resp.json();
		// console.log(boxscore);
		return boxscore;
	}
}