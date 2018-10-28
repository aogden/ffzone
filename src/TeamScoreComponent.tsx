import * as React from 'react'
import {Team} from './Model'
import './TeamScoreComponent.css';

type props = {
	team:Team
}
export class TeamScoreComponent extends React.Component<props,object> {
	render() {
		let slots = this.props.team.slots.map((slot, index) => {
			return (
			<div key={index} className="Player">
				<div>
					{slot.player.firstName} {slot.player.lastName}
				</div>
				<div className="PlayerScore">
					{slot.currentStatTotal} 
				</div>
			</div>
			);
		})
		return (
			<div className="TeamBox">
				<div>{this.props.team.name}</div>
				<div className="TeamScoreBox">
					<div>Projected Score: {this.props.team.appliedActiveProjectedTotal.toFixed(2)}</div>
					<div>Total Score: {this.props.team.totalRealScore.toFixed(2)}</div>
				</div>
				{slots}
			</div>
		);
	}
}