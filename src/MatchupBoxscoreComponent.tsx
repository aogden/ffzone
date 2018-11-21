import * as React from 'react'
import { DataModel } from './Model'
import { TeamScoreComponent } from './TeamScoreComponent'
// import './MatchupBoxscoreComponent.css';

type Props = {
	data: DataModel
}
type State = {
	currentMatchupId: number
	autoProgress:boolean
}

const MATCHUP_CYCLE_INTERVAL = 5 * 1000;

export class MatchupBoxscoreComponent extends React.Component<Props, State> {
	private autoProgressInterval?:NodeJS.Timeout;
	constructor(props: Props) {
		super(props);
		this.state = { currentMatchupId: 0, autoProgress: true }
	}
	render() {
		return null;
		const matchup = this.props.data.matchups[this.state.currentMatchupId];
		const teamComp0 = this.getTeamScoreComponent(matchup ? matchup.homeTeamId : -1);
		const teamComp1 = this.getTeamScoreComponent(matchup ? matchup.awayTeamId : -1);
		return <div>
			<button onClick={() => { this.handleCycleClick(false) }}>BACK</button>
			<button onClick={() => { this.setAutoProgress(!this.state.autoProgress) }}>
				{this.state.autoProgress ? 'STOP' : 'START'}
			</button>
			<button onClick={() => { this.handleCycleClick(true) }}>NEXT</button>
			<div>
				{teamComp0}
				{teamComp1}
			</div>
		</div>;
	}

	getTeamScoreComponent(index: number): JSX.Element | null {
		if (!this.props.data.teams[index]) {
			return null;
		}

		return <TeamScoreComponent team={this.props.data.teams[index]} />
	}

	componentDidMount() {
		this.setAutoProgress(true);
	}

	handleCycleClick(direction:boolean) {
		this.setAutoProgress(false);
		this.cycleMatchup(direction)
	}

	cycleMatchup(forward: boolean) {
		let newMatchup = this.state.currentMatchupId + (forward ? 1 : -1);
		if (newMatchup < 0) newMatchup = this.props.data.matchups.length - 1;
		if (newMatchup >= this.props.data.matchups.length) newMatchup = 0;
		console.log('new matchup ', newMatchup);
		this.setState({ currentMatchupId: newMatchup })
	}

	setAutoProgress(auto:boolean) {
		if(auto && !this.autoProgressInterval) {
			this.autoProgressInterval = setInterval(() => {
				this.cycleMatchup(true);
			}, MATCHUP_CYCLE_INTERVAL)
		} else if(this.autoProgressInterval) {
			clearInterval(this.autoProgressInterval);
			this.autoProgressInterval = undefined;
		}
		this.setState({ autoProgress: auto })
		console.log(`auto is ${auto}`)
	}
}