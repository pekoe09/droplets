import React from 'react'
import Droplet from '../droplets/droplet'

const projectDropletContainerStyle = {
  backgroundColor: 'yellow',
  display: 'flex',
  flex: 1,
  flexDirection: 'column'
}

const ProjectDropletContainer = ({ project, droplets }) => {
  const mapDroplets = () => droplets.map(d =>
    <Droplet
      key={d._id}
      initialDroplet={d}
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