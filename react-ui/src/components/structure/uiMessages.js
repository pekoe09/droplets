import React from 'react'
import { connect } from 'react-redux'
import UIMessage from './uiMessage'

const UIMessages = ({ uiMessages }) => {
  return (
    <div>
      {uiMessages ? uiMessages.map(m => <UIMessage key={m.timestamp + m.content} message={m} />) : ''}
    </div>
  )
}

const mapStateToProps = (store) => {
  return {
    uiMessages: store.uiMessages
  }
}

export default connect(
  mapStateToProps
)(UIMessages)