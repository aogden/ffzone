import * as React from 'react'
import {Team} from './Model'
import {LineupPosition} from './Contracts'
import './TeamScoreComponent.css';


type Props = {
	team:Team
}

export class TeamScoreComponent extends React.Component<Props,object> {
	render() {
		let slots = this.props.team.slots.map((slot, index) => {
			return (
			<div key={index} className={"Player " + (slot.slotCategoryId === LineupPosition.Bench ? 'BenchPlayer' : '')}>
				<div>
					{slot.player.firstName} {slot.player.lastName}
				</div>
				<div className="PlayerProjScore">
					{slot.projectedStatTotal || 0} 
				</div>
				<div className="PlayerScore">
					{slot.currentStatTotal || 0} 
				</div>
			</div>
			);
		})
		return (
			<div className="TeamBox">
				<h1>{this.props.team.name}</h1>
				<div className="TeamScoreBox">
					<div>Projected Score</div>
					<div>Total Score</div>
				</div>
				<div className="TeamScoreBox">
					<div className="TeamScore">{this.props.team.appliedActiveProjectedTotal.toFixed(2)}</div>
					<div className="TeamScore">{this.props.team.totalRealScore.toFixed(2)}</div>
				</div>
				<br></br>
				{slots}
			</div>
		);
	}
}