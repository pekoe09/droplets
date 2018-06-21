import React from 'react'
import { Button } from 'semantic-ui-react'
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

const rightBtnStyle = {
  marginLeft: 5
}

const TeamListItem = ({ team, handleDelete }) => {
  return (
    <div style={teamListItemStyle}>
      <div style={{ overflowX: 'hidden' }}>
        <ListItemHeader text={team.name} />
        <span style={{ float: 'right' }}>
          Owner: {team.owner.username}
          <Button
            size='mini'
            color='red'
            onClick={handleDelete}
            style={rightBtnStyle}
          >
            Delete
        </Button>
        </span>
      </div>
      <TeamProjectList
        projects={team.projects}
        teamId={team._id}
      />
    </div>
  )
}

export default TeamListItem