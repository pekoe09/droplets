import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import ListSubItemHeader from '../structure/listSubItemHeader'

const projectListItemStyle = {
  marginTop: 5,
  backgroundColor: '#f8edf8',
  color: 'purple',
  borderRadius: 4,
  padding: 5
}

const rightBtnStyle = {
  marginLeft: 5,
  float: 'right'
}

const ProjectListItem = (props) => {
  const handleProjectClick = () => {
    console.log('Getting project ' + props.project._id)
    props.history.push(`/projects/${props.project._id}`)
  }

  return (
    <div style={projectListItemStyle}>
      <div
        style={{
          overflowX: 'hidden',
          cursor: 'pointer'
        }}
        onDoubleClick={handleProjectClick}
      >
        <ListSubItemHeader
          text={props.project.name}

        />
        <Button
          size='mini'
          color='red'
          onClick={props.handleDelete}
          style={rightBtnStyle}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

export default withRouter(connect(
  null
)(ProjectListItem))