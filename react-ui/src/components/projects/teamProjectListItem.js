import React from 'react'
import ListSubItemHeader from '../structure/listSubItemHeader'

const projectListItemStyle = {
  marginTop: 5,
  backgroundColor: 'purple',
  color: 'white',
  borderRadius: 4,
  padding: 5
}

const ProjectListItem = ({ project }) => {
  return (
    <div>
      <ListSubItemHeader text={project.name} />
    </div>
  )
}

export default ProjectListItem