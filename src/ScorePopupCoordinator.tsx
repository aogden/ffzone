import * as React from 'react'
import { TeamSlot, Team, DataModel } from './Model'
import { PlayerScorePopup, SimpleMatchupData } from './PlayerScorePopup'

export const DISPLAY_TIME = 500 * 1000;
const INTERESTING_SCORE_THRESHOLD = 0.2;
const QUEUE_EXPIRATION_TIME = 20 * 1000;

type QueueItem = {
	team: Team
	slot: TeamSlot
	scoreDelta: number
	creationTime: number
}

export interface MatchupDataSource {
	getData():DataModel
}

export class ScorePopupCoordinator {
	private popupQueue: QueueItem[] = [];
	private currentPopupItem?: QueueItem;
	private dataSource:MatchupDataSource;

	constructor(dataSource:MatchupDataSource) {
		this.dataSource = dataSource;
	}

	onPlayerScoreChange(slot: TeamSlot, team: Team, scoreDelta: number) {
		if (!slot.player) return;
		console.log(`${slot.player.fullName} scored ${scoreDelta} points for ${team.name} (${team.totalRealScore.toFixed(2)})`);
		//Check queue for this player
		let found = false;
		for (let i = 0; i < this.popupQueue.length; i++) {
			const element = this.popupQueue[i];
			if (element.slot.player.playerId === slot.player.playerId) {
				element.scoreDelta += scoreDelta;
				found = true;
				break;
			}
		}

		if (!found) {
			this.popupQueue.push({ team, slot, scoreDelta, creationTime: Date.now() })
		}
		console.log(`queue is `, this.popupQueue)
		this.processQueue();
	}

	processQueue() {
		if (this.currentPopupItem) return;
		if (this.popupQueue.length === 0) return;

		//check queue for acceptable popup, throwing out any non-interesting ones
		const now = Date.now();
		this.popupQueue = this.popupQueue.filter((el => {
			return !(Math.abs(el.scoreDelta) < INTERESTING_SCORE_THRESHOLD && el.creationTime + QUEUE_EXPIRATION_TIME < now);
		}))

		//grab front
		this.currentPopupItem = this.popupQueue.shift();
		console.log(`post process queue is `, this.popupQueue)

		//schedule popup disappear and reprocess
		setTimeout(() => {
			this.currentPopupItem = undefined;
			this.processQueue();
		}, DISPLAY_TIME)
	}

	getPlayerScorePopup(): JSX.Element | null {
		if (!this.currentPopupItem) return null;

		console.log('returning el for popup item ', this.currentPopupItem)

		const matchup = this.getSimpleMatchupForTeam(this.currentPopupItem.team.teamId);
		const el = <PlayerScorePopup team={this.currentPopupItem.team} slot={this.currentPopupItem.slot} scoreDelta={this.currentPopupItem.scoreDelta} matchup={matchup} />

		return el
	}

	getSimpleMatchupForTeam(teamId:number): SimpleMatchupData {
		const data = this.dataSource.getData();
		const matchup = data.matchups.find(el => el.awayTeamId === teamId || el.homeTeamId === teamId) as any;
		const transformTeam = (teamId: number) => {
			const team = data.teams[teamId];
			return {
				name: team.name,
				projectedScore: team.appliedActiveProjectedTotal,
				actualScore: team.totalRealScore
			}
		}
		return {
			home: transformTeam(matchup.homeTeamId),
			away: transformTeam(matchup.awayTeamId)
		}
	}

}