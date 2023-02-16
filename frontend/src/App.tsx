import { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import IUser from './types/user.type';

import Login from "./components/login.component";
import Register from "./components/register.component";
import AllRecipes from "./components/recipes-list.component";
import Profile from "./components/profile.component";
import Add from "./components/add-recipe.component";

import EventBus from "./common/EventBus";

import AddRecipe from "./components/add-recipe.component";
import Recipe from "./components/recipe.component";
import RecipesList from "./components/recipes-list.component";

type Props = {

}

type State = {
  currentUser: IUser | undefined
}

class App extends Component<Props, State> {
  render() {
    const { currentUser } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/recipes"} className="navbar-brand ms-3">
            Neha's Recipe Book 😋
          </Link>
          <div className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to={"/recipes"} className="nav-link">
                All Recipes
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link to={"/add"} className="nav-link">
                Add
              </Link>
            </li> */}
            {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  Add
                </Link>
              </li>
            )}
          </div>
          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/recipes"]} component={RecipesList} />
            <Route exact path="/add" component={AddRecipe} />
            <Route path="/recipes/:id" component={Recipe} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={Add} />
          </Switch>
        </div>
      </div>
    );
  }

  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user
      });
    }

    EventBus.on("logout", this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove("logout", this.logOut);
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
  }
}

export default App;