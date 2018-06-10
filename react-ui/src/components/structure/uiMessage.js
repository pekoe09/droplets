import React from 'react'

const containerStyle = {
  borderStyle: 'solid',
  borderWidth: 2,
  borderRadius: 4,
  padding: 10
}

const successStyle = {
  color: 'green',
  borderColor: 'green',
}

const errorStyle = {
  color: 'red',
  borderColor: 'red',
}

const UIMessage = ({ message }) => {

  const compoundStyle = () => {
    if (message.type === 'success') {
      return { ...containerStyle, ...successStyle }
    } else if (message.type === 'error') {
      return { ...containerStyle, ...errorStyle }
    }
  }

  return (
    <div style={compoundStyle()}>{message.content}</div>
  )
}

export default UIMessage