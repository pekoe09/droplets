import React from 'react'
import PropTypes from 'prop-types'
import {
  DragSource,
  ConnectDragSource,
  DragSourceConnector,
  DragSourceMonitor,
  DragSourceCollector
} from 'react-dnd'
import DnDItemTypes from '../structure/dndItemTypes';

const keywordStyle = {
  backgroundColor: 'purple',
  color: 'white',
  paddingTop: 2,
  paddingBottom: 2,
  paddingLeft: 5,
  paddingRight: 5,
  margin: 2,
  borderRadius: 5
}

const sourceSpec = {
  beginDrag(props) {
    return {
      keyword: props.keyword
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class Keyword extends React.Component {

  render() {
    return this.props.connectDragSource(
      <span style={keywordStyle}>
        <span>{this.props.keyword.name}</span>
      </span>
    )
  }
}

export default DragSource(DnDItemTypes.KEYWORD, sourceSpec, collect)(Keyword)

Keyword.propTypes = {
  keyword: PropTypes.object.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}