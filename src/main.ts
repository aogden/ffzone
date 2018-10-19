import fetch from 'node-fetch';
import * as dotenv from 'dotenv'
import * as Contracts from './Contracts';

dotenv.config();

const LEAGUE_ID = process.env.LEAGUE_ID
const SEASON = 2018

async function getScoreboard() : Promise<Contracts.ScoreboardResponseBody> {
	const resp = await fetch(`http://games.espn.com/ffl/api/v2/scoreboard?leagueId=${LEAGUE_ID}&seasonId=${SEASON}`)
	const score:Contracts.ScoreboardResponseBody = await resp.json();
	return score;
}

async function getBoxscore(matchupPeriod:number, teamId:number) : Promise<Contracts.BoxScoreResponseBody> {
	const resp = await fetch(`http://games.espn.com/ffl/api/v2/boxscore?leagueId=${LEAGUE_ID}&seasonId=${SEASON}&matchupPeriodId=${matchupPeriod}&teamId=${teamId}`)
	const boxscore:Contracts.BoxScoreResponseBody = await resp.json();
	return boxscore;
}

async function getData() {
	const scoreboard = await getScoreboard();
	let boxPromises: Promise<Contracts.BoxScoreResponseBody>[] = [];
	scoreboard.scoreboard.matchups.forEach(matchup => {
		boxPromises.push(getBoxscore(1,matchup.teams[0].teamId));
	})
	let boxScores = await Promise.all(boxPromises);
	let quarterbackData = [];
	boxScores.forEach(response => {
		quarterbackData.push(...response.boxscore.teams.map(team => {
			const qb = team.slots.find(slot => slot.slotCategoryId === 0)
			const fantasyTeam = team.team.teamLocation;
			const score = qb.currentPeriodRealStats.appliedStatTotal;
			const projScore = qb.currentPeriodProjectedStats.appliedStatTotal;
			const name = qb.player.lastName;
			return {team: fantasyTeam, score: score, projected: projScore, name: name}
		}))
	})
	console.log(quarterbackData);
}

getData();