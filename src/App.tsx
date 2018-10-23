import * as React from 'react';
import './App.css';
import fetch from 'node-fetch';
import * as Contracts from './Contracts';
import { DataModel } from './Model';
import { TeamScoreComponent } from './TeamScoreComponent';

const SEASON = 2018
const PERIOD_ID = 1

class App extends React.Component {
	public render() {
		return (
			<div className="App">
				<TeamScoreComponent />
			</div>
		);
	}

	componentDidMount() {
		this.getData();
	}

	public async getData() {
		const scoreboardResp = await this.getScoreboard();
		const boxPromises: Promise<Contracts.BoxScoreResponseBody>[] = [];
		scoreboardResp.scoreboard.matchups.forEach(matchup => {
			matchup.teams.forEach(team => boxPromises.push(this.getBoxscore(PERIOD_ID, team.teamId)))
		})
		const boxScoresResp = await Promise.all(boxPromises);
		const box = boxScoresResp.map(box => box.boxscore)
		const model = new DataModel(scoreboardResp.scoreboard, box, PERIOD_ID);
		console.log(model)
		console.log(PERIOD_ID)
	}

	private async getScoreboard() : Promise<Contracts.ScoreboardResponseBody> {
		console.log(process.env)
		const resp = await fetch(`http://games.espn.com/ffl/api/v2/scoreboard?leagueId=${process.env.REACT_APP_LEAGUE_ID}&seasonId=${SEASON}`)
		const score:Contracts.ScoreboardResponseBody = await resp.json();
		return score;
	}
	
	private async getBoxscore(matchupPeriod:number, teamId:number) : Promise<Contracts.BoxScoreResponseBody> {
		const resp = await fetch(`http://games.espn.com/ffl/api/v2/boxscore?leagueId=${process.env.REACT_APP_LEAGUE_ID}&seasonId=${SEASON}&matchupPeriodId=${matchupPeriod}&teamId=${teamId}`)
		const boxscore:Contracts.BoxScoreResponseBody = await resp.json();
		return boxscore;
	}
}

export default App;
