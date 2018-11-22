import * as React from 'react'
import {Team, TeamSlot} from './Model'
import './PlayerScorePopup.css';
import {AssetUtil} from './AssetUtil'
import {DISPLAY_TIME} from './ScorePopupCoordinator'

export type PlayerScorePopupProps = {
	team:Team,
	slot:TeamSlot,
	scoreDelta:number,
	matchup: SimpleMatchupData
}

export type SimpleMatchupData = {
	home:SimpleTeamData,
	away:SimpleTeamData
}

export type SimpleTeamData = {
	name:string,
	projectedScore:number,
	actualScore:number
}

type State = {
	showing: boolean
}


export class PlayerScorePopup extends React.Component<PlayerScorePopupProps,State> {
	constructor(props: PlayerScorePopupProps) {
		super(props);
		this.state = {showing:false};
	}

	render() {
		if(!this.state.showing) {
			return null;
		}

		let el = null;
		const playerNameStyle = {'fontWeight': 'bold', fontSize: '1.5em'} as React.CSSProperties
		const teamStyle = {fontSize: '0.9em'} as React.CSSProperties;
		const generateMatchupElements = (team:SimpleTeamData):JSX.Element[] => {
			return [
				<p key="name">{team.name}</p>,
				<p className='ProjectedScore' key="projScore">{team.projectedScore.toFixed(2)}</p>,
				<p key="actualScore">{team.actualScore.toFixed(2)}</p>
			]
		}
		if(this.props.team) {
			el = <div className="PopupContainer">
				<div className="PopupPlayer">
					<img src={AssetUtil.getLogoForProTeam(this.props.slot.player.proTeamId)}></img>
					<div className="PopupPlayerText">
					<p style={playerNameStyle}>{this.props.slot.player.fullName}</p>
					<p style={teamStyle}>{this.props.team.name}</p>
					</div>
				</div>
				<p className='PopupScore'>{this.props.scoreDelta >= 0 ? '+' : '-'}{Math.abs(this.props.scoreDelta)}</p>
				<div className='PopupMatchupContainer'>
					<div className='PopupTeamContainer'>{generateMatchupElements(this.props.matchup.home)}</div>
					<div className='PopupTeamContainer'>{generateMatchupElements(this.props.matchup.away)}</div>
				</div>
			</div>
		}
		return (el);
	}

	componentDidUpdate(prevProps:PlayerScorePopupProps) {
		if(prevProps !== this.props) {
			this.setState({showing:true})
			setTimeout(() => {
				console.log('Update state to hide')
				this.setState({showing:false});
			}, DISPLAY_TIME);
		}
	}
}