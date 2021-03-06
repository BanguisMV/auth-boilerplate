import { Redirect, Route } from 'react-router-dom'
import Decode from 'jwt-decode'
import axios from '../axios'

export const checkToken = () => {
    const token = localStorage.getItem('accessToken')
    if(!token) { return false }
    try {
        const { exp } = Decode(token)
        const dateNow = new Date();
        if( exp < dateNow.getTime() / 1000) {
          axios.post('/users/token')
          .then(res => res.data)
          .then(data => {
            localStorage.setItem('accessToken', JSON.stringify(data.accessToken));
          }).catch(error => {
            return false
          })
         }
    } catch (error) { return false }
    return true
  }
  
export const PrivateRoute = ({ component: Component, auth, ...rest }) => {
    return (
    <Route {...rest} render = { props => 
          checkToken() ? (
            <Component {...props} />
            ) : (
            <Redirect to="/auth"/>
            )
         }
    />
    )
};


