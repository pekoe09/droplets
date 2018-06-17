import React from 'react'
import ListItemHeader from '../structure/listItemHeader'

const TeamListItem = ({ team }) => {
  return (
    <div>
      <ListItemHeader text={team.name} />
      <p>Owner: {team.owner.username}</p>
    </div>
  )
}

export default TeamListItem