import React from 'react'

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

const Keyword = ({ keyword }) => {
  return (
    <span style={keywordStyle}>
      <span>{keyword.name}</span>
    </span>
  )
}

export default Keyword