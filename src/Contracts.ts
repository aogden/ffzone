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
	boxscore: BoxScore
}

export interface BoxScore {
	allScoringPeriodsInMatchupPeriod: number[],
	scheduleItems: BoxScoreScheduleItem[]
	teams: BoxScoreTeam[],
	progames: {
		[id: number]: ProGameMatchup
	},
	homeTeamBonus: number,
	scoringPeriodId: number
}

export interface ProGameMatchup {
	awayProTeamId: number
	awayScore: number
	gameDate: string
	gameId: number
	homeProTeamId: number
	homeScore: number
	period: number
	status: number
	timeRemainingInPeriod: string
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
	currentPeriodRealStats?: {
		appliedStatTotal: number,
		appliedStats: {},
		rawStats: {}
	},
	lockStatus?: number,
	currentPeriodProjectedStats?: {
		appliedStatTotal: number,
		appliedStats: {},
		rawStats: {}
	},
	opponentProTeamId?: number,
	isQueuedWaiverLocked?: false,
	isTradeLocked?: false,
	watchList?: false,
	slotCategoryId: LineupPosition,
	player?: {
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
		eligibleSlotCategoryIds: number[],
		proTeamId: number,
		tickerId: number,
		sportsId: number,
		gameStarterStatus: number
	},
}

export enum LineupPosition {
	'QB' = 0,
	'RB' = 2,
	'WR' = 4,
	'TE' = 6,
	'Def' = 16,
	'K' = 17,
	'Bench' = 20,
	'Flex' = 23
};

export const NFLTeams = {
	'22': { fullName: 'Arizona Cardinals', abbr: 'Ari' },
	'1': { fullName: 'Atlanta Falcons', abbr: 'Atl' },
	'33': { fullName: 'Baltimore Ravens', abbr: 'Bal' },
	'2': { fullName: 'Buffalo Bills', abbr: 'Buf' },
	'29': { fullName: 'Carolina Panthers', abbr: 'Car' },
	'3': { fullName: 'Chicago Bears', abbr: 'Chi' },
	'4': { fullName: 'Cincinnati Bengals', abbr: 'Cin' },
	'5': { fullName: 'Cleveland Browns', abbr: 'Cle' },
	'6': { fullName: 'Dallas Cowboys', abbr: 'Dal' },
	'7': { fullName: 'Denver Broncos', abbr: 'Den' },
	'8': { fullName: 'Detroit Lions', abbr: 'Det' },
	'9': { fullName: 'Green Bay Packers', abbr: 'GB' },
	'34': { fullName: 'Houston Texans', abbr: 'Hou' },
	'11': { fullName: 'Indianapolis Colts', abbr: 'Ind' },
	'30': { fullName: 'Jacksonville Jaguars', abbr: 'Jax' },
	'12': { fullName: 'Kansas City Chiefs', abbr: 'KC' },
	'24': { fullName: 'Los Angeles Chargers', abbr: 'LAC' },
	'14': { fullName: 'Los Angeles Rams', abbr: 'LAR' },
	'15': { fullName: 'Miami Dolphins', abbr: 'Mia' },
	'16': { fullName: 'Minnesota Vikings', abbr: 'Min' },
	'17': { fullName: 'New England Patriots', abbr: 'NE' },
	'18': { fullName: 'New Orleans Saints', abbr: 'NO' },
	'19': { fullName: 'New York Giants', abbr: 'NYG' },
	'20': { fullName: 'New York Jets', abbr: 'NYJ' },
	'13': { fullName: 'Oakland Raiders', abbr: 'Oak' },
	'21': { fullName: 'Philadelphia Eagles', abbr: 'Phi' },
	'23': { fullName: 'Pittsburgh Steelers', abbr: 'Pit' },
	'25': { fullName: 'San Francisco 49ers', abbr: 'SF' },
	'26': { fullName: 'Seattle Seahawks', abbr: 'Sea' },
	'27': { fullName: 'Tampa Bay Buccaneers', abbr: 'TB' },
	'10': { fullName: 'Tennessee Titans', abbr: 'Ten' },
	'28': { fullName: 'Washington Redskins', abbr: 'Wsh' },
	'-1': { fullName: 'Bye', abbr: 'Bye' }
};