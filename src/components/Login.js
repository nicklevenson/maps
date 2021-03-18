import React from 'react'
import googleLogin from '../assets/btn_google.png'
import {connect} from 'react-redux'  
import {fetchUser} from '../actions/UserActions.js'
import { Redirect } from 'react-router-dom'
class Login extends React.Component {
 
  componentDidMount() { 
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token')) {
      const jwt = urlParams.get('token');
      const id = parseInt(urlParams.get('id'))
      sessionStorage.setItem("jwt", jwt)
      sessionStorage.setItem("userId", id)
      this.props.fetchUser()
      this.setState({redirect: true})
    }
  

  }
  render(){
    return(
      <div className="login-page">
        <h2>Login/Signup with Google</h2>
        {this.props.heading ? <h5><i>{this.props.heading}</i></h5>: null}
        <a href="http://localhost:3000/authenticate"><img src={googleLogin} alt="Login with Google"/></a>
        {sessionStorage.jwt ? <Redirect to="my-maps" /> : null}

      </div>
    )
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser: () => dispatch(fetchUser())
  }
}


export default connect(null, mapDispatchToProps)(Login)