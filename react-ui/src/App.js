import React from 'react';
import { Container } from 'semantic-ui-react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import FrontPage from './components/structure/frontPage'
import NavBar from './components/structure/navbar'
import Registration from './components/users/registration'
import Teams from './components/teams/teams'
import UIMessages from './components/structure/uiMessages'

class App extends React.Component {
  render() {
    return (
      <Container>
        <NavBar />
        <UIMessages />

        <Route exact path='/' render={() => <FrontPage />} />
        <Route exact path='/teams' render={() => <Teams />} />
        <Route exact path='/users/register' render={() => <Registration />} />
      </Container>
    )
  }
}

export default withRouter(connect(
  null
)(App))
