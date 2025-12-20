export const convertTeamToColor = (
    team: 'WHITE' | 'BLACK'
): 'WHITE' | 'BLACK' => {
    return team === 'WHITE' ? 'WHITE' : 'BLACK';
};

export const convertColorToTeam = (
    color: 'WHITE' | 'BLACK'
): 'WHITE' | 'BLACK' => {
    return color === 'WHITE' ? 'WHITE' : 'BLACK';
};
