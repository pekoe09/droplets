import React from 'react'

const projectDropletContainerStyle = {
  backgroundColor: 'yellow',
  display: 'flex',
  flex: 1,
  flexDirection: 'column'
}

const ProjectDropletContainer = ({ project }) => {
  return (
    <div style={projectDropletContainerStyle}>
      <p>ProjectDropletContainer</p>
    </div>
  )
}

export default ProjectDropletContainer