import React from 'react'

const projectBarStyle = {
  backgroundColor: 'magenta',
  height: 50,
  display: 'flex',
  flexDirection: 'column'
}

const ProjectBar = ({ project }) => {
  return (
    <div style={projectBarStyle}>
      <p>ProjectBar</p>
    </div>
  )
}

export default ProjectBar