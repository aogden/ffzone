import * as lodash from 'lodash'
import * as Contracts from './Contracts'

export class DataModel {
	teams: {
		[id: number]: Team
	};
	currentPeriodId: number;
	matchups: {
		homeTeamId: number,
		awayTeamId: number
	}[]

	constructor(scoreboard: Contracts.Scoreboard, boxscores: Contracts.BoxScore[], currentPeriodId: number) {
		this.matchups = [];
		let scoreTeams: Contracts.ScoreboardTeam[] = [];
		scoreboard.matchups.forEach(matchup => {
			scoreTeams.push(...matchup.teams)
			this.matchups.push({ homeTeamId: matchup.teams[0].teamId, awayTeamId: matchup.teams[1].teamId })
		})
		scoreTeams = lodash.uniq(scoreTeams);
		let teams = {};
		scoreTeams.forEach(team => {
			const boxscore = boxscores.find(box => !!box.teams.find(val => val.teamId === team.teamId))
			if(boxscore) {
				const boxTeam = boxscore.teams.find(val => val.teamId === team.teamId);
				if(boxTeam) {
					teams[team.teamId] = new Team(team, boxTeam);
				}
			}
		})
		this.teams = teams;
		this.currentPeriodId = currentPeriodId;
	}
}

export class Team {
	name: string = '';
	teamId: number = 0;
	record: {
		overallWins: number;
		overallLosses: number;
		overallStanding: number
	} = { overallWins: 0, overallLosses: 0, overallStanding: 0};
	logoUrl: string = '';
	appliedActiveProjectedTotal: number = 0;
	appliedInactiveProjectedTotal: number = 0;
	totalRealScore: number = 0;
	slots: TeamSlot[] = [];

	constructor(scoreboardSource: Contracts.ScoreboardTeam, boxscoreSource: Contracts.BoxScoreTeam) {
		const properties = Object.getOwnPropertyNames(this);
		const scoreSource = lodash.pick(scoreboardSource, properties);
		const recordSource = lodash.pick(scoreboardSource.team, properties);
		const boxSource = lodash.pick(boxscoreSource, properties);
		Object.assign(this, ...[scoreSource, recordSource, boxSource]);
		this.name = `${scoreboardSource.team.teamLocation} ${scoreboardSource.team.teamNickname}`
		this.slots = boxscoreSource.slots.map(slotSource => new TeamSlot(slotSource));
		this.totalRealScore = this.slots.map(slot => {
			return slot.slotCategoryId !== Contracts.LineupPosition.Bench ? slot.currentStatTotal : 0
		}).reduce((acc, curr) => acc + curr);
		this.appliedActiveProjectedTotal = this.slots.map(slot => {
			return slot.slotCategoryId !== Contracts.LineupPosition.Bench ? slot.projectedStatTotal : 0
		}).reduce((acc, curr) => acc + curr);
	}
}

export class TeamSlot {
	slotCategoryId: Contracts.LineupPosition = -1;
	currentStatTotal: number = 0;
	projectedStatTotal: number = 0;
	player: {
		lastName: string;
		firstName: string;
		fullName: string;
		playerId: number;
		proTeamId: number;
	} = {lastName:'', firstName:'', fullName:'', playerId:0, proTeamId: 0}

	constructor(slotSource: Contracts.BoxScoreTeamSlot) {
		this.slotCategoryId = slotSource.slotCategoryId;
		if(slotSource.currentPeriodRealStats) this.currentStatTotal = slotSource.currentPeriodRealStats.appliedStatTotal || 0;
		if(slotSource.currentPeriodProjectedStats) this.projectedStatTotal = slotSource.currentPeriodProjectedStats.appliedStatTotal || 0;
		Object.assign(this, ...[slotSource]);
		if(slotSource.player && this.player) {
			this.player.fullName = `${slotSource.player.firstName} ${slotSource.player.lastName}`
		}
	}
}

export type ModelProps = {
	data: DataModel
}