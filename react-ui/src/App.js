import React from 'react';
import { Container } from 'semantic-ui-react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import FrontPage from './components/structure/frontPage'
import NavBar from './components/structure/navbar'
import Project from './components/projects/project'
import Registration from './components/users/registration'
import Teams from './components/teams/teams'
import UIMessages from './components/structure/uiMessages'

class App extends React.Component {
  render() {
    return (
      <Container
        fluid
      >
        <NavBar />
        <UIMessages />

        <Route exact path='/' render={() => <FrontPage />} />
        <Route exact path='/projects/:id' render={() => <Project />} />
        <Route exact path='/teams' render={() => <Teams />} />
        <Route exact path='/users/register' render={() => <Registration />} />
      </Container>
    )
  }
}

export default DragDropContext(HTML5Backend)(withRouter(connect(
  null
)(App)))
