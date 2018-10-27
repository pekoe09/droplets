import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Label } from 'semantic-ui-react'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { register } from '../../actions/userActions'
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
      email: '',
      touched: {
        username: false,
        password: false,
        password2: false,
        lastName: false,
        firstNames: false,
        email: false
      }
    }
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handlePasswordChange = (event) => {
    console.log(event.target.value)
    this.setState({ [event.target.name]: event.target.value })
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
      await this.props.register(user)
      if (!this.props.error) {
        this.props.addUIMessage(
          `Hi ${user.firstNames}, welcome to use Droplets! Please login with your new username and password.`,
          'success',
          10
        )
        this.props.history.push('/')
      } else {
        this.props.addUIMessage('Registration failed!', 'error', 10)
      }
    }
  }

  handleBlur = (field) => () => {
    this.setState({
      touched: {
        ...this.state.touched,
        [field]: true
      }
    })
  }

  validate = () => {
    return {
      username: !this.state.username,
      password: !this.state.password,
      password2: !this.state.password2,
      lastName: !this.state.lastName,
      firstNames: !this.state.firstNames,
      email: !this.state.email
    }
  }

  render() {
    const errors = this.validate()
    const isEnabled = !Object.keys(errors).some(x => errors[x])

    return (
      <div>
        <ViewHeader text='Register to use Droplets!' />
        {this.props.registering && <h3>Handling registration...</h3>}
        <Form onSubmit={this.handleSubmit}>
          <Form.Field
            required
            control={Input}
            width={6}
            label='Username'
            name='username'
            value={this.state.username}
            error={errors.username && this.state.touched.username}
            onChange={this.handleChange}
            onBlur={this.handleBlur('username')}
          />
          <Form.Field required width={6}>
            <label>Password</label>
            <input
              type='password'
              name='password'
              value={this.state.password}
              error={errors.password && this.state.touched.password}
              onChange={this.handlePasswordChange}
              onBlur={this.handleBlur('password')}
              style={
                {
                  borderColor: errors.password && this.state.touched.password ? '#e0b4b4' : '',
                  color: errors.password && this.state.touched.password ? '#9f3a38' : '',
                  backgroundColor: errors.password && this.state.touched.password ? '#FFF6F6' : ''
                }
              }
            />
          </Form.Field>
          <Form.Field required width={6}>
            <label>Confirm password</label>
            <input
              type='password'
              name='password2'
              value={this.state.password2}
              error={errors.password2 && this.state.touched.password2}
              onChange={this.handlePasswordChange}
              onBlur={this.handleBlur('password2')}
              style={
                {
                  borderColor: errors.password && this.state.touched.password ? '#e0b4b4' : '',
                  color: errors.password && this.state.touched.password ? '#9f3a38' : '',
                  backgroundColor: errors.password && this.state.touched.password ? '#FFF6F6' : ''
                }
              }
            />
          </Form.Field>
          <Form.Field
            required
            control={Input}
            width={6}
            label='Email'
            name='email'
            value={this.state.email}
            error={errors.email && this.state.touched.email}
            onChange={this.handleChange}
            onBlur={this.handleBlur('email')}
          />
          <Form.Field
            required
            control={Input}
            width={6}
            label='Last name'
            name='lastName'
            value={this.state.lastName}
            error={errors.lastName && this.state.touched.lastName}
            onChange={this.handleChange}
            onBlur={this.handleBlur('lastName')}
          />
          <Form.Field
            required
            control={Input}
            width={6}
            label='First names'
            name='firstNames'
            value={this.state.firstNames}
            error={errors.firstNames && this.state.touched.firstNames}
            onChange={this.handleChange}
            onBlur={this.handleBlur('firstNames')}
          />
          <Form.Field>
            <Button
              primary
              disabled={!isEnabled}
            >
              Register!
            </Button>
            <LinkButton text='Cancel' to='/' type='default' />
          </Form.Field>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  registering: store.users.registering,
  error: store.users.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    addUIMessage,
    register
  }
)(Registration))