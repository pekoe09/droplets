import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Droplet from '../droplets/droplet'
import DropletFilterMenu from '../droplets/dropletFilterMenu'

const projectDropletContainerStyle = {
  backgroundColor: '#045f84',
  //display: 'flex',
  //flex: 1,
  //flexDirection: 'column',
  marginTop: 5,
  minHeight: '100vh'
}

const ProjectDropletContainer = ({ project, droplets, dropletFilterText }) => {
  const mapDroplets = () => droplets
    .filter(d =>
      d.text.includes(dropletFilterText) || d.summary.includes(dropletFilterText) || d.header.includes(dropletFilterText)
    )
    .map(d =>
      <Droplet
        key={d._id}
        dropletId={d._id}
        projectId={project._id}
      />
    )

  return (
    <div style={projectDropletContainerStyle}>
      <DropletFilterMenu />
      {mapDroplets()}
    </div>
  )
}

const mapStateToProps = store => ({
  dropletFilterText: store.filters.dropletTextFilter
})

export default withRouter(connect(
  mapStateToProps
)(ProjectDropletContainer))