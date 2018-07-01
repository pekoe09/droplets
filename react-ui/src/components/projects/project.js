import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ProjectBar from './projectBar'
import ProjectDropletContainer from './projectDropletContainer'

const projectStyle = {
  height: '100%',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column'
}

const Project = ({ project }) => {
  console.log('Rendering project')
  return (
    <div style={projectStyle}>
      <ProjectBar project={project} />
      <ProjectDropletContainer project={project} />
    </div>
  )
}

const mapStateToProps = (store, ownProps) => ({
  project: store.projects.items.find(p => p._id === ownProps.match.params.id)
})

export default withRouter(connect(
  mapStateToProps
)(Project))