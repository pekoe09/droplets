import React from 'react'
import ListItemHeader from '../structure/listItemHeader'
import TeamProjectList from '../projects/teamProjectList'

const teamListItemStyle = {
  marginTop: 5,
  borderStyle: 'solid',
  borderColor: 'purple',
  borderRadius: 4,
  borderWidth: 1,
  padding: 5
}

const TeamListItem = ({ team }) => {
  return (
    <div style={teamListItemStyle}>
      <ListItemHeader text={team.name} />
      <span style={{ float: 'right' }}>Owner: {team.owner.username}</span>
      <TeamProjectList
        projects={team.projects}
        teamId={team._id}
      />
    </div>
  )
}

export default TeamListItem