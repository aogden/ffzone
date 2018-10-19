export interface RequestMetadata {
	serverDate: string,
	defaults: {},
	seasonId: number,
	leagueId: number,
	dateModifiedLeague: string,
	status: string
}

export interface ScoreboardResponseBody {
	metadata: RequestMetadata,
	scoreboard: Scoreboard
}

export interface Scoreboard {
	matchups: ScoreboardMatchup[],
	matchupPeriodId: number,
	scoringPeriodId: number,
	dateFirstProGameOfScoringPeriod: string, //Date format
	proGamesInProgress: boolean,
	nextProGameId: number,
	dateNextProGame: string //Date format
}

export interface ScoreboardMatchup {
	winner: string,
	teams: ScoreboardTeam[],
	bye: boolean
}

export interface ScoreboardTeam {
	score: number,
	teamId: number,
	liveStats: {},
	team: {
		division: {
			size: number,
			divisionName: string,
			divisionId: 0
		},
		teamAbbrev: string,
		waiverRank: number,
		teamId: number,
		record: {
			pointsAgainst: number,
			divisionTies: number,
			streakLength: number,
			homeTies: number,
			overallWins: number,
			pointsFor: number,
			divisionPercentage: number,
			homeLosses: number,
			awayWins: number,
			overallPercentage: number,
			overallLosses: number,
			divisionLosses: number,
			divisionWins: number,
			homeWins: number,
			awayPercentage: number,
			streakType: number,
			awayLosses: number,
			overallTies: 0,
			divisionStanding: number,
			overallStanding: number,
			homePercentage: number,
			awayTies: number
		},
		teamLocation: string,
		teamNickname: string,
		logoType: string,
		logoUrl: string
	},
	playerIDs: number[],
	home: boolean
}

export interface BoxScoreResponseBody {
	metadata: RequestMetadata,
	boxscore: {
		allScoringPeriodsInMatchupPeriod: number[],
		scheduleItems: BoxScoreScheduleItem[]
		teams: BoxScoreTeam[],
		progames: {
			[id:number]: {
				awayProTeamId:number
				awayScore:number
				gameDate:string
				gameId:number
				homeProTeamId:number
				homeScore:number
				period:number
				status:number
				timeRemainingInPeriod:string
			}
		},
		homeTeamBonus: number,
		scoringPeriodId: number
	}
}

export interface BoxScoreScheduleItem {
	matchups: BoxScoreScheduleMatchup[],
	matchupPeriodId: number
}

export interface BoxScoreScheduleMatchup {
	awayTeamAdjustment: number,
	homeTeamAdjustment: number,
	matchupTypeId: number,
	awayTeam: {
		division: {
			size: number,
			divisionName: string,
			divisionId: number
		},
		teamAbbrev: string,
		waiverRank: number,
		teamId: number,
		teamLocation: string,
		teamNickname: string,
		logoType: string,
		logoUrl: string
	},
	isBye: false,
	homeTeam: {
		division: {
			size: number,
			divisionName: string,
			divisionId: number
		},
		teamAbbrev: string,
		waiverRank: number,
		teamId: number,
		teamLocation: string,
		teamNickname: string,
		logoType: string,
		logoUrl: string
	},
	awayTeamScores: number[],
	homeTeamBonus: number,
	homeTeamId: number,
	awayTeamId: number,
	homeTeamScores: number[],
	outcome: number
}

export interface BoxScoreTeam {
 slots: BoxScoreTeamSlot[],
 teamId: number,
 appliedActiveProjectedTotal: number,
 team: {
	 division: {
		 size: number,
		 divisionName: string,
		 divisionId: number
	 },
	 teamAbbrev: string,
	 waiverRank: number,
	 teamId: number,
	 teamLocation: string,
	 teamNickname: string,
	 divisionStanding: number,
	 logoType: string,
	 overallStanding: number,
	 logoUrl: string
 },
 appliedInactiveProjectedTotal: number
}

export interface BoxScoreTeamSlot {
	currentPeriodRealStats: {
		appliedStatTotal: number,
		appliedStats: {},
		rawStats: {}
	},
	lockStatus: number,
	currentPeriodProjectedStats: {
		appliedStatTotal: number,
		appliedStats: {},
		rawStats: {}
	},
	opponentProTeamId: number,
	isQueuedWaiverLocked: false,
	isTradeLocked: false,
	watchList: false,
	slotCategoryId: number,
	player: {
		lastName: string,
		percentOwned: number,
		lastNewsDate: string,
		universeId: number,
		isActive: true,
		jersey: string,
		isIREligible: false,
		playerRatingSeason: number,
		value: number,
		playerId: number,
		percentChange: number,
		lastVideoDate: string,
		percentStarted: number,
		droppable: false,
		firstName: string,
		defaultPositionId: number,
		positionRank: number,
		healthStatus: number,
		draftRank: number,
		totalPoints: number,
		eligibleSlotCategoryIds: [
			number,
			number
		],
		proTeamId: number,
		tickerId: number,
		sportsId: number,
		gameStarterStatus: number
	},
}