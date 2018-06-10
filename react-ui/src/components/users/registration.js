import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button } from 'semantic-ui-react'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { register } from '../../reducers/userReducer'
import { addUIMessage } from '../../reducers/uiMessageReducer'

class Registration extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      password2: '',
      lastName: '',
      firstNames: '',
      email: ''
    }
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    if (this.state.password !== this.state.password2) {
      this.props.addUIMessage('"Password and "Confirm password" fields do not match!', 'error', 10)
    } else {
      const user = {
        username: this.state.username,
        password: this.state.password,
        password2: this.state.password2,
        lastName: this.state.lastName,
        firstNames: this.state.firstNames,
        email: this.state.email
      }
      this.props.register(user)
      this.props.addUIMessage(
        `Hi ${user.firstNames}, welcome to use Droplets! Please login with your new username and password.`,
        'success',
        10
      )
      this.props.history.push('/')
    }
  }

  render() {
    return (
      <div>
        <ViewHeader text='Register to use Droplets!' />
        <LinkButton text='Cancel' to='/' type='default' />
        <Form onSubmit={this.handleSubmit}>
          <Form.Field required control={Input} width={6} label='Username' name='username'
            value={this.state.username} onChange={this.handleChange} />
          <Form.Field required control={Input} width={6} label='Password' name='password'
            value={this.state.password} onChange={this.handleChange} />
          <Form.Field required control={Input} width={6} label='Confirm password' name='password2'
            value={this.state.password2} onChange={this.handleChange} />
          <Form.Field required control={Input} width={6} label='Email' name='email'
            value={this.state.email} onChange={this.handleChange} />
          <Form.Field required control={Input} width={6} label='Last name' name='lastName'
            value={this.state.lastName} onChange={this.handleChange} />
          <Form.Field required control={Input} width={6} label='First names' name='firstNames'
            value={this.state.firstNames} onChange={this.handleChange} />
          <Form.Field>
            <Button primary>
              Register!
            </Button>
          </Form.Field>
        </Form>
      </div>
    )
  }
}

export default withRouter(connect(
  null,
  {
    addUIMessage,
    register
  }
)(Registration))