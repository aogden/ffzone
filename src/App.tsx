import * as React from 'react';
import './App.css';
import { TeamScoreComponent } from './TeamScoreComponent';
import { PlayerScorePopup, PlayerScorePopupProps } from './PlayerScorePopup';
import { DataSource } from './DataSource'
import { DataModel, TeamSlot, Team } from './Model'

type State = {
	data: DataModel,
	currentPopup?: PlayerScorePopupProps
	scoreLog:string[],
	currentMatchupId:number
}

class App extends React.Component<object, State> {
	constructor(props: Readonly<{}>) {
		super(props);
		this.state = {
			data: {
				teams: [],
				currentPeriodId: 0,
				matchups: []
			},
			scoreLog: [],
			currentMatchupId: 0
		}
	}

	public render() {
		const matchup = this.state.data.matchups[this.state.currentMatchupId];
		const teamComp0 = this.getTeamScoreComponent(matchup ? matchup.homeTeamId : -1);
		const teamComp1 = this.getTeamScoreComponent(matchup ? matchup.awayTeamId : -1);
		let popup = null;
		if (this.state.currentPopup) {
			popup = <PlayerScorePopup team={this.state.currentPopup.team} slot={this.state.currentPopup.slot} scoreDelta={this.state.currentPopup.scoreDelta} />
		}
		const logElements = this.state.scoreLog.map((log, index)=> <p key={index}>{log}</p>)
		return (
			<div className="App">
				<div>
					{teamComp0}
					{teamComp1}
				</div>
				{popup}
				<div className='Logs'>
					{logElements}
				</div>
			</div>
		);
	}

	getTeamScoreComponent(index: number): JSX.Element | null {
		if (!this.state.data.teams[index]) {
			return null;
		}

		return <TeamScoreComponent team={this.state.data.teams[index]} />
	}

	componentDidMount() {
		DataSource.getData().then(data => {
			this.setState({ data, scoreLog:[], currentMatchupId: 0});
		})

		setInterval(() => {
			console.log('getting data')
			DataSource.getData().then(data => {
				data.teams[1].slots[0].currentStatTotal = Math.round(Math.random() * 100);
				let stateCopy = Object.assign({}, this.state);
				const newMatchup = this.state.currentMatchupId + 1 < this.state.data.matchups.length ? this.state.currentMatchupId + 1 : 0;
				this.setState(Object.assign(stateCopy, { data, currentMatchupId: newMatchup }));
			});
		}, 10000)
	}

	setState(state: State) {
		const prevState = this.state;
		super.setState(state);

		//check for player point updates
		let teamIds: number[] = [];
		prevState.data.matchups.forEach(matchup => {
			teamIds.push(...[matchup.homeTeamId, matchup.awayTeamId])
		})
		teamIds.forEach(id => {
			const prevTeam = prevState.data.teams[id];
			const newTeam = state.data.teams[id];
			newTeam.slots.forEach((slot, index) => {
				let delta = slot.currentStatTotal - prevTeam.slots[index].currentStatTotal;
				if (delta !== 0) {
					this.onPlayerScoreChange(slot, newTeam, delta);
				}
			})
		})
	}

	onPlayerScoreChange(slot: TeamSlot, team: Team, scoreDelta: number) {
		const log = `${slot.player.fullName} scored ${scoreDelta} points for ${team.name}`;
		const stateCopy = Object.assign({}, this.state);
		stateCopy.scoreLog.push(log);
		// this.setState(Object.assign(stateCopy, { currentPopup: { slot, team, scoreDelta } }));
		this.setState(stateCopy);
	}
}

export default App;
