import React from 'react'
import { Button } from 'semantic-ui-react'
import ListSubItemHeader from '../structure/listSubItemHeader'

const projectListItemStyle = {
  marginTop: 5,
  backgroundColor: '#f8edf8',
  color: 'purple',
  borderRadius: 4,
  padding: 5
}

const rightBtnStyle = {
  marginLeft: 5,
  float: 'right'
}

const ProjectListItem = ({ project, handleDelete }) => {
  return (
    <div style={projectListItemStyle}>
      <div style={{ overflowX: 'hidden' }}>
        <ListSubItemHeader text={project.name} />
        <Button
          size='mini'
          color='red'
          onClick={handleDelete}
          style={rightBtnStyle}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

export default ProjectListItem