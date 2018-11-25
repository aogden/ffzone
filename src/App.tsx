import * as React from 'react';
import './App.css';
import { TeamScoreComponent } from './TeamScoreComponent';
import { DataSource } from './DataSource'
import { DataModel, TeamSlot, Team } from './Model'
import { LineupPosition } from './Contracts'
import { ScorePopupCoordinator, MatchupDataSource } from './ScorePopupCoordinator'
import Iframe from 'react-iframe'

const DATA_POLL_INTERVAL = 10 * 1000;

type State = {
	data: DataModel,
	scoreLog: string[]
}

class App extends React.Component<object, State> implements MatchupDataSource {
	private dataInterval: NodeJS.Timeout;
	private popupCoordinator = new ScorePopupCoordinator(this);
	constructor(props: Readonly<{}>) {
		super(props);
		this.state = {
			data: {
				teams: [],
				currentPeriodId: 0,
				matchups: [],
				proGames: []
			},
			scoreLog: []
		}
	}

	public render() {
		let popup = this.popupCoordinator.getPlayerScorePopup();
		return (
			<div className="App">
				<Iframe url={process.env.REACT_APP_VIDEO_URL}
					width="100%"
					height="100%"
					display="initial"
					position="absolute"
					allowFullScreen />
				<img src="https://cdn.vox-cdn.com/thumbor/l_V-K3mdVi2sSlWjUNMROvN2_W4=/0x0:3384x2549/1820x1213/filters:focal(1970x816:2510x1356):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/61598345/usa_today_11351731.0.jpg"></img>
				{popup}
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
			this.setState({ data, scoreLog: [] });
		})

		this.dataInterval = setInterval(() => {
			DataSource.getData().then(data => {
				// data.teams[(Math.random() * Object.keys(data.teams).length).toFixed(0)].slots[2].currentStatTotal = Math.round(Math.random() * 100);
				let stateCopy = Object.assign({}, this.state);
				this.onDataSourceFetch(data);
				this.setState(Object.assign(stateCopy, { data, currentMatchupId: 5 }));
			});
		}, DATA_POLL_INTERVAL)
		console.log(this.dataInterval);
	}

	onDataSourceFetch(newData: DataModel) {
		const prevState = this.state;
		//check for player point updates
		let teamIds: number[] = [];
		prevState.data.matchups.forEach(matchup => {
			teamIds.push(...[matchup.homeTeamId, matchup.awayTeamId])
		})
		teamIds.forEach(id => {
			const prevTeam = prevState.data.teams[id];
			const newTeam = newData.teams[id];
			newTeam.slots.forEach((slot, index) => {
				if (slot.slotCategoryId === LineupPosition.Bench) return;
				let delta = slot.currentStatTotal - prevTeam.slots[index].currentStatTotal;
				delta = Math.round(delta * 10) / 10;
				if (delta !== 0) {
					this.onPlayerScoreChange(slot, newTeam, delta);
				}
			})
		})
	}

	onPlayerScoreChange(slot: TeamSlot, team: Team, scoreDelta: number) {
		if (!slot.player) return;
		const log = `${slot.player.fullName} scored ${scoreDelta} points for ${team.name} (${team.totalRealScore.toFixed(2)})`;
		const stateCopy = Object.assign({}, this.state);
		stateCopy.scoreLog.push(log);
		this.popupCoordinator.onPlayerScoreChange(slot, team, scoreDelta);
		this.setState(stateCopy);
	}

	getData() {
		return this.state.data;
	}
}

export default App;
