import * as React from 'react'
import {Team, TeamSlot} from './Model'
// import './PlayerScorePopup.css';

export type PlayerScorePopupProps = {
	team:Team,
	slot:TeamSlot,
	scoreDelta:number
}

export class PlayerScorePopup extends React.Component<PlayerScorePopupProps,object> {
	render() {
		let el = null;
		if(this.props.team) {
			el =
			<div className="Container">
				<p>{this.props.slot.player.fullName} scored {this.props.scoreDelta} points for {this.props.team.name}</p>
			</div>
		}
		return (el);
	}
}