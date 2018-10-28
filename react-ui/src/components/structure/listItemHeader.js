import React from 'react'

const listItemHeaderStyle = {
  fontSize: '1.5em',
  fontWeight: 'bold',
  fontFamily: 'Lato,"Helvetica Neue",Arial,Helvetica,sans-serif',
  color: '#045f84'
}

const ListItemHeader = ({ text }) => {
  return <span style={listItemHeaderStyle}>{text}</span>
}

export default ListItemHeader