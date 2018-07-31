import React from 'react'

const linkedDropletStyle = {
  backgroundcolor: 'grey'
}

const LinkedDroplet = ({ droplet, openDroplet }) => {
  return (
    <div
      style={linkedDropletStyle}
      onClick={openDroplet}
    >
      {droplet.header}
    </div>
  )
}

export default LinkedDroplet