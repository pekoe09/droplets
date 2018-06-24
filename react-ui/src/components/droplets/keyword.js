import React from 'react'

const keywordStyle = {
  backgroundColor: 'purple',
  color: 'white'
}

const Keyword = ({ keyword }) => {
  return (
    <div style={keywordStyle}>
      <p>{keyword.name}</p>
    </div>
  )
}

export default Keyword