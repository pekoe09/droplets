import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import ListSubItemHeader from '../structure/listSubItemHeader'

const projectListItemStyle = {
  marginTop: 5,
  backgroundColor: '#E3F6FF',
  color: '"045f84"',
  borderRadius: 4,
  padding: 5
}

const rightBtnStyle = {
  marginLeft: 5,
  float: 'right'
}

const deleteBtnStyle = {
  borderStyle: 'solid',
  borderColor: '#ff1f49',
  borderWidth: 1,
  backgroundColor: 'white',
  color: '#ff1f49'
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
          onClick={props.handleDelete}
          style={{ ...rightBtnStyle, ...deleteBtnStyle }}
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