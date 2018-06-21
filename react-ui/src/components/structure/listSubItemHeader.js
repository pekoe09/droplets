import React from 'react'

const listSubItemHeaderStyle = {
  fontSize: '1.1em',
  fontWeight: 'bold',
  fontFamily: 'Lato,"Helvetica Neue",Arial,Helvetica,sans-serif'
}

const ListSubItemHeader = ({ text }) => {
  return <span style={listSubItemHeaderStyle}>{text}</span>
}

export default ListSubItemHeader