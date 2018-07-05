import React from 'react'
import Droplet from '../droplets/droplet'

const projectDropletContainerStyle = {
  backgroundColor: '#ffe6ff',
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  marginTop: 5
}

const ProjectDropletContainer = ({ project, droplets }) => {
  const mapDroplets = () => droplets.map(d =>
    <Droplet
      key={d._id}
      initialDroplet={d}
      projectId={project._id}
    />
  )

  return (
    <div style={projectDropletContainerStyle}>
      <p>ProjectDropletContainer</p>
      {mapDroplets()}
    </div>
  )
}

export default ProjectDropletContainer