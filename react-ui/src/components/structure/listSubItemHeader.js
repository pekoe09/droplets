import React from 'react'

const listSubItemHeaderStyle = {
  fontSize: '1.1em',
  fontWeight: 'bold',
  fontFamily: 'Lato,"Helvetica Neue",Arial,Helvetica,sans-serif',
  color: '#045f84'
}

const ListSubItemHeader = ({ text }) => {
  return <span style={listSubItemHeaderStyle}>{text}</span>
}

export default ListSubItemHeader