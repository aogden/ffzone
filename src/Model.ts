import * as lodash from 'lodash'
import * as Contracts from './Contracts'

export class DataModel {
	teams: {
		[id:number]: Team
	};
	currentPeriodId: number;
	matchups: {
		homeTeamId: number,
		awayTeamId: number
	}[]

	constructor(scoreboard: Contracts.Scoreboard, boxscores:Contracts.BoxScore[]) {
		this.matchups = [];
		let scoreTeams: Contracts.ScoreboardTeam[] = [];
		scoreboard.matchups.forEach(matchup => {
			scoreTeams.push(...matchup.teams)
			this.matchups.push({homeTeamId: matchup.teams[0].teamId, awayTeamId: matchup.teams[1].teamId})
		})
		scoreTeams = lodash.uniq(scoreTeams);
		let teams = {};
		scoreTeams.forEach(team => {
			const boxscore = boxscores.find(box => !!box.teams.find(val => val.teamId === team.teamId))
			const boxTeam = boxscore.teams.find(val => val.teamId === team.teamId);
			teams[team.teamId] = new Team(team, boxTeam);
		})
		this.teams = teams;
	}
}

export class Team {
	name: string;
	id: string;
	record: {
		overallWins: number;
		overallLosses: number;
		overallStanding: number
	};
	logoUrl: string;
	appliedActiveProjectedTotal: number;
	appliedInactiveProjectedTotal: number;
	slots: TeamSlot[];

	constructor(scoreboardSource: Contracts.ScoreboardTeam, boxscoreSource: Contracts.BoxScoreTeam) {
		
	}
}

export class TeamSlot {
	slotCategoryId: number;
	currentStatTotal: number;
	projectedStatTotal: number
	player: {
		lastName: string;
		firstName: string;
		playerId: number;
		proTeamId: number;
	}
}