import React from 'react'
import {
  DropTarget,
  DropTargetMonitor,
  DropTargetConnector,
  DropTargetCollector,
  ConnectDropTarget,
} from 'react-dnd'
import PropTypes from 'prop-types'
import DnDItemTypes from '../structure/dndItemTypes'

const desktopTarget = {
  drop(props, monitor) {
    console.log('Dropping')
    const dropletId = monitor.getItem()
    console.log(dropletId)
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

const ProjectDesktop = ({ connectDropTarget, isOver }) => {

  return connectDropTarget(
    <div style={{ backgroundColor: 'blue', minHeight: '100vh' }}>
      <p>desktop</p>
    </div>
  )

}

export default DropTarget(DnDItemTypes.DROPLET, desktopTarget, collect)(ProjectDesktop)

DropTarget.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired
}