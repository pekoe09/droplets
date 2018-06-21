import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button } from 'semantic-ui-react'
import { login } from '../../actions/userActions'
import { addUIMessage } from '../../reducers/uiMessageReducer'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const credentials = {
      username: this.state.username,
      password: this.state.password
    }
    await this.props.login(credentials)
    if (this.props.error) {
      await this.props.addUIMessage('Wrong username or password', 'error', 10)
    }
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group inline>
          <Form.Input
            inline
            label='Username'
            name='username'
            size='mini'
            value={this.state.username}
            onChange={this.handleChange}
          />
          <Form.Input
            inline
            label='Password'
            name='password'
            size='mini'
            value={this.state.password}
            onChange={this.handleChange}
          />
          <Form.Field>
            <Button primary size='mini'>Login</Button>
          </Form.Field>
        </Form.Group>
      </Form>
    )
  }
}

const mapStateToProps = store => ({
  loggingIn: store.users.loggingIn,
  error: store.users.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    login,
    addUIMessage
  }
)(Login))