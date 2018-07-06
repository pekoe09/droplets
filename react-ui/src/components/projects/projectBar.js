import React from 'react'
import { Button } from 'semantic-ui-react'
import ListItemHeader from '../structure/listItemHeader'

const projectBarStyle = {
  backgroundColor: 'white',
  height: 50,
  display: 'inline-block',
  paddingTop: 7,
  paddingLeft: 5
}

const createDropletBtnStyle = {
  float: 'right',
  color: 'white',
  background: 'purple',
  marginRight: 5
}

const ProjectBar = ({ project, handleCreateDroplet }) => {
  return (
    <div style={projectBarStyle}>
      <ListItemHeader text={project.name} />
      <Button
        onClick={handleCreateDroplet}
        style={createDropletBtnStyle}
      >
        Create droplet
      </Button>
    </div>
  )
}

export default ProjectBar