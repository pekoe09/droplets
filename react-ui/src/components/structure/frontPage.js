import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const FrontPage = ({ currentUser }) => {
  return (
    <div>
      Droplets frontpage
    </div>
  )
}

const mapStateToProps = store => ({
  currentUser: store.users.currentUser
})

export default withRouter(connect(
  mapStateToProps
)(FrontPage))