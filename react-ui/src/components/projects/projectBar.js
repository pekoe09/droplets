import React from 'react'
import { Button } from 'semantic-ui-react'
import ListItemHeader from '../structure/listItemHeader'

const projectBarStyle = {
  backgroundColor: 'white',
  height: 50,
  display: 'inline-block',
  padding: 10
}

const createDropletBtnStyle = {
  float: 'right',
  color: 'white',
  background: '#0492cc',
  marginRight: 5
}

const ProjectBar = ({ project, isSideBarVisible, handleCreateDroplet, handleToggleSidebar }) => {
  return (
    <div style={projectBarStyle}>
      <ListItemHeader text={project.name} />
      {
        isSideBarVisible &&
        <Button
          onClick={handleToggleSidebar}
          style={createDropletBtnStyle}
        >
          Hide droplet bar
        </Button>
      }
      {
        !isSideBarVisible &&
        <Button
          onClick={handleToggleSidebar}
          style={createDropletBtnStyle}
        >
          Show droplet bar
        </Button>
      }
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