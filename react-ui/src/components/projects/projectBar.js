import React from 'react'
import { Button } from 'semantic-ui-react'
import ListItemHeader from '../structure/listItemHeader'

const projectBarStyle = {
  backgroundColor: 'magenta',
  height: 50,
  display: 'inline-block'
}

const ProjectBar = ({ project, handleCreateDroplet }) => {
  return (
    <div style={projectBarStyle}>
      <ListItemHeader text={project.name} />
      <Button onClick={handleCreateDroplet} style={{ float: 'right' }}>Create droplet</Button>
    </div>
  )
}

export default ProjectBar