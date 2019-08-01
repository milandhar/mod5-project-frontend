import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapBrowser from './components/mapBrowser.js';
import LoginForm from './components/loginForm';
import Profile from './components/Profile';
import CreateUserForm from './components/createUserForm';
import ProjectBrowser from './components/ProjectBrowser';
import DonatePage from './components/DonatePage';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Loader } from 'semantic-ui-react'

const initialState = {
  userThemes: [],
  themes: [],
  updatedThemes: false,
  selectedCountry: "",
  updatedSelectedCountry: false,
  selectedProject: {},
  user: {}
}

class App extends Component {

  constructor(){
    super()
    this.state = initialState
  }

  componentDidMount(){
    this.getThemes()
  }


  getThemeFromId = (themeId) => {
    console.log(themeId)
    let theme = this.state.themes.find(theme=>theme.id===themeId)
    return theme
  }

  getThemes = () => {
    const url = 'http://localhost:3000/api/v1/themes'
    fetch(url)
    .then(res=>res.json())
    .then(json => {
      this.setState({themes: json}, this.fetchUserThemes())
    })
  }

  fetchUserThemes = () => {
    console.log('in app get themes')
    let themeArray = []
    let token = localStorage.getItem("jwt")
      fetch('http://localhost:3000/api/v1/profile', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(res=>res.json())
      .then(json=> {
        if(!json["error"]){
          console.log(json)
          if(json.user.theme1){
            themeArray.push(this.getThemeFromId(json.user.theme1).name)
          }
          if(json.user.theme2){
            themeArray.push(this.getThemeFromId(json.user.theme2).name)
          }
          if(json.user.theme3) {
            themeArray.push(this.getThemeFromId(json.user.theme3).name)
          }
          this.setState({
            userThemes: themeArray,
            updatedThemes: true
          })
        }
      })
  }


  updateAppThemes = (themes) => {
    this.setState({userThemes: themes})

  }

  updateSelectedCountry = (country) => {
    console.log('in update selected')
    if(country){
      this.setState({
        updatedSelectedCountry: true,
        selectedCountry: country
      }, console.log(this.state.selectedCountry))
    }
  }

  handleDonate = (project) => {
    this.setState({selectedProject: project})
    localStorage.removeItem('selectedProject')
    localStorage.setItem('selectedProject', JSON.stringify(project))
  }

  logout = () => {
    localStorage.setItem('jwt', '')
    localStorage.setItem('username', '')
    localStorage.setItem('email_address', '')
    localStorage.setItem('first_name', '')
    localStorage.setItem('last_name', '')
    localStorage.setItem('selectedProject', '')
    this.resetState()
    return true
  }

  resetState = () =>{
    this.setState(initialState)
  }

  setUser = (user) => {
    console.log('in set user')
    this.setState({user: user, selectedCountry: user.defaultCountry})
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Route
            exact path="/"
            render={(props) => (
            <LoginForm {...props}
              resetState={this.resetState}
              onLogin={this.updateUser}
              setUser={this.setUser}
              updateSelectedCountry={this.updateSelectedCountry}
              getThemes={this.getThemes}/>
              )}
            />
          {(this.state.updatedThemes)
            ? <Route
              path={'/map'}
              render={()=><MapBrowser
                updateSelectedCountry={this.updateSelectedCountry}
                updateAppThemes={this.updateAppThemes}
                themes={this.state.themes}
                userThemes={this.state.userThemes}
                fetchUserThemes={this.fetchUserThemes}
                logout={this.logout}
              />}
            />
          : <div></div>}
            <Route
              path={'/create_user'}
              render={()=><CreateUserForm
              getThemes={this.getThemes}
              themes={this.state.themes}
              />}
            />
            <Route
              path={'/profile'}
              render={()=><Profile
                            updateAppThemes={this.updateAppThemes}
                            handleDonate={this.handleDonate}
                            logout={this.logout}
                            getThemes={this.fetchUserThemes}
                          />}
            />
            {(this.state.updatedThemes)
          ? <Route
              path={'/projects'}
              render={()=><ProjectBrowser
                            handleDonate={this.handleDonate}
                            updatedSelectedCountry={this.state.updatedSelectedCountry}
                            updateSelectedCountry={this.updateSelectedCountry}
                            appSelectedCountry={this.state.selectedCountry}
                            updateAppThemes={this.updateAppThemes}
                            themes={this.state.themes}
                            userThemes={this.state.userThemes}
                            fetchUserThemes={this.fetchUserThemes}
                            logout={this.logout}
                          />}
              />
            : <div></div>}

          {(this.state.selectedProject)
          ? <Route
            path={'/donate'}
            render={()=><DonatePage
              project={this.state.selectedProject}
              logout={this.logout}
              />}
            />
          : <div></div>}
          </Router>
      </div>

    );
  }
}


export default App;
