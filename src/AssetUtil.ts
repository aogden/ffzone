import {NFLTeams} from './Contracts'

const BASE_ASSET_URL = 'https://s3-us-west-1.amazonaws.com/ffzone-assets/'

export class AssetUtil {
	public static getLogoForProTeam(proTeamId:number) : string {
		const team = NFLTeams[proTeamId];
		if(team) {
			return `${BASE_ASSET_URL}${team.abbr}.png`
		}
		return ''
	}
}