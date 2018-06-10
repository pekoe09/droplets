import React from 'react';
import { Container } from 'semantic-ui-react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import FrontPage from './components/structure/frontPage'
import Registration from './components/users/registration'

class App extends React.Component {
  render() {
    return (
      <Container>
        <Route exact path='/' render={() => <FrontPage />} />

        <Route exact path='/users/register' render={() => <Registration />} />
      </Container>
    )
  }
}

export default withRouter(connect(
  null
)(App))
