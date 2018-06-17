import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import { logout } from '../../actions/userActions'

const logoutButtonStyle = {
  fontSize: '0.9rem'
}

const Logout = ({ logout, history }) => {
  const handleLogout = () => {
    logout()
    history.push('/')
  }

  return (
    <Button
      onClick={handleLogout}
      style={logoutButtonStyle}
      size='mini'
    >
      Logout
    </Button>
  )
}

export default withRouter(connect(
  null,
  {
    logout
  }
)(Logout))