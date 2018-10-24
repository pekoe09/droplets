import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  DropTarget,
  DropTargetMonitor,
  DropTargetConnector,
  DropTargetCollector,
  ConnectDropTarget,
} from 'react-dnd'
import PropTypes from 'prop-types'
import DnDItemTypes from '../structure/dndItemTypes'
import Droplet from '../droplets/droplet'
import { addDropletToDesktop } from '../../actions/projectActions'

const targetSpec = {
  drop(props, monitor, component) {
    console.log('Dropping')
    console.log(monitor)
    props.addDropletToDesktop({
      dropletId: monitor.getItem().dropletId,
      projectId: props.projectId
    })
    console.log('added')
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

const ProjectDesktop = ({ desktopDroplets, projectId, connectDropTarget, isOver }) => {

  const mapDroplets = () => {
    return desktopDroplets.map(d =>
      <Droplet
        dropletId={d.dropletId}
        projectId={projectId}
      />
    )
  }

  return connectDropTarget(
    <div style={{ backgroundColor: 'lightgrey', minHeight: '100vh' }}>
      {mapDroplets()}
    </div>
  )
}

export default _.flow([
  DropTarget(DnDItemTypes.DROPLET, targetSpec, collect),
  connect(
    null,
    {
      addDropletToDesktop
    }
  )
])(ProjectDesktop)

DropTarget.propTypes = {
  desktopDroplets: PropTypes.array.isRequired,
  projectId: PropTypes.string.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired
}