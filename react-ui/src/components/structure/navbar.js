import React from 'react'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import Login from '../users/login'
import Logout from '../users/logout'

const menuLogoStyle = {
  marginLeft: 5,
  marginTop: 4
}

const menuStyle = {
  marginTop: 5
}

const menuDropdownStyle = {
  height: 40,
  display: 'inline-block',
  alignSelf: 'flex-end'
}

const UnknownUserActions = () => {
  return (
    <Menu.Menu position='right'>
      <Menu.Item style={menuDropdownStyle}>
        <NavLink to='/users/register'>Register</NavLink>
      </Menu.Item>
      <Menu.Item style={menuDropdownStyle}>
        <Login />
      </Menu.Item>
    </Menu.Menu>
  )
}

const LoggedInActions = () => {
  return (
    <Menu.Menu position='left'>
      <Menu.Item style={menuDropdownStyle}>
        <NavLink to='/teams'>Teams and Projects</NavLink>
      </Menu.Item>
    </Menu.Menu>
  )
}

const NavBar = ({ currentUser }) => {
  return (
    <Menu style={menuStyle}>
      <Menu.Header style={menuLogoStyle}>
        <NavLink to='/'><img src='/favicon.ico' /></NavLink>
      </Menu.Header>

      {currentUser && <LoggedInActions />}

      <Menu.Menu position='right'>
        {!currentUser && <UnknownUserActions />}
        {currentUser && <Logout />}
      </Menu.Menu>
    </Menu>
  )
}

const mapStateToProps = store => ({
  currentUser: store.users.currentUser
})

export default withRouter(connect(
  mapStateToProps
)(NavBar))