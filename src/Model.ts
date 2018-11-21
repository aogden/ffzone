import * as lodash from 'lodash'
import * as Contracts from './Contracts'

const TIME_PER_PRO_GAME_MIN = 15 * 4;

type ProGame = {
	awayProTeamId: number,
	homeProTeamId: number,
	period: number,
	timeRemainingInPeriod: string
}

export class DataModel {
	teams: {
		[id: number]: Team
	};
	currentPeriodId: number;
	matchups: {
		homeTeamId: number,
		awayTeamId: number
	}[]
	proGames: ProGame[]

	constructor(scoreboard: Contracts.Scoreboard, boxscores: Contracts.BoxScore[], currentPeriodId: number) {
		this.matchups = [];
		let scoreTeams: Contracts.ScoreboardTeam[] = [];
		scoreboard.matchups.forEach(matchup => {
			scoreTeams.push(...matchup.teams)
			this.matchups.push({ homeTeamId: matchup.teams[0].teamId, awayTeamId: matchup.teams[1].teamId })
		})
		scoreTeams = lodash.uniq(scoreTeams);
		this.proGames = [];
		if(boxscores.length > 0) {
			//Populate pro games from first boxscore (all are the same)
			lodash.forOwn(boxscores[0].progames, (value, key) => {
				this.proGames.push({
					awayProTeamId: value.awayProTeamId,
					homeProTeamId: value.homeProTeamId,
					period: value.period,
					timeRemainingInPeriod: value.timeRemainingInPeriod
				})
			})
		}
		let teams = {};
		scoreTeams.forEach(team => {
			const boxscore = boxscores.find(box => !!box.teams.find(val => val.teamId === team.teamId))
			if(boxscore) {
				const boxTeam = boxscore.teams.find(val => val.teamId === team.teamId);
				if(boxTeam) {
					const newTeam = new Team(team, boxTeam);
					newTeam.updateProjectedTotal(this.proGames);
					teams[team.teamId] = newTeam;
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

		//naiive projected total
		//use determine projected total with pro game data for accurate projection
		this.appliedActiveProjectedTotal = this.slots.map(slot => {
			return slot.slotCategoryId !== Contracts.LineupPosition.Bench ? slot.projectedStatTotal : 0
		}).reduce((acc, curr) => acc + curr);
	}

	public updateProjectedTotal(proGames:ProGame[]) {
		this.slots.forEach(slot => {
			slot.projectedStatTotal = Team.getProjection(slot,proGames);
		});
		this.appliedActiveProjectedTotal = this.slots.map(slot => {
				return slot.projectedStatTotal;
		}).reduce((acc, curr) => acc + curr);
	}

	private static getProjection(slot:TeamSlot, proGames:ProGame[]): number {
		if(slot.slotCategoryId === Contracts.LineupPosition.Bench) {
			return 0;
		}
		const proGame = proGames.find((game) => {
			return slot.player.proTeamId === game.awayProTeamId || slot.player.proTeamId === game.homeProTeamId
		})
		if(!proGame) {
			console.warn(`no pro game found for ${slot.player.fullName} returning base projection`)
			return slot.projectedStatTotal;
		}
		const percentComplete = Team.getPercentComplete(proGame);
		const projection = slot.currentStatTotal + (1 - percentComplete) * slot.projectedStatTotal;
		console.log(`projecting ${projection} points for ${slot.player.fullName} with ${slot.currentStatTotal} current points ${slot.projectedStatTotal} projected points and their game ${percentComplete} complete`)
		return projection;
	}

	private static getPercentComplete(game:ProGame): number {
		if(game.period === 0) {
			return 0;
		}
		const timeRemainingTokens = game.timeRemainingInPeriod.split(':');
		const minRemainingInPeriod = parseInt(timeRemainingTokens[0]) + parseInt(timeRemainingTokens[1])/60;
		const timeRemaining = TIME_PER_PRO_GAME_MIN - (game.period * (TIME_PER_PRO_GAME_MIN/4)) + minRemainingInPeriod;
		return (TIME_PER_PRO_GAME_MIN - timeRemaining) / TIME_PER_PRO_GAME_MIN;
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