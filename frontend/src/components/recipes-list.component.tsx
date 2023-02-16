import { Component, ChangeEvent } from "react";
import RecipeDataService from "../services/recipe.service";
import { Link, RouteComponentProps } from "react-router-dom";
import IRecipeData from '../types/recipe.type';
import UserService from "../services/user.service";


type Props = {};

type State = {
  recipes: Array<IRecipeData>,
  currentRecipe: IRecipeData | null,
  currentIndex: number,
  searchTitle: string,
  content: string
};

export default class RecipesList extends Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveRecipes = this.retrieveRecipes.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveRecipe = this.setActiveRecipe.bind(this);
    this.removeAllRecipes = this.removeAllRecipes.bind(this);
    this.searchTitle = this.searchTitle.bind(this);

    this.state = {
      recipes: [],
      currentRecipe: null,
      currentIndex: -1,
      searchTitle: "",
      content: "",
    };
  }

  componentDidMount() {
    this.retrieveRecipes();
    UserService.getPublicContent().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  onChangeSearchTitle(e: ChangeEvent<HTMLInputElement>) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle
    });
  }

  retrieveRecipes() {
    RecipeDataService.getAll()
      .then((response: any) => {
        this.setState({
          recipes: response.data
        });
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveRecipes();
    this.setState({
      currentRecipe: null,
      currentIndex: -1
    });
  }

  setActiveRecipe(recipe: IRecipeData, index: number) {
    this.setState({
      currentRecipe: recipe,
      currentIndex: index
    });
  }

  removeAllRecipes() {
    RecipeDataService.deleteAll()
      .then((response: any) => {
        console.log(response.data);
        this.refreshList();
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  searchTitle() {
    this.setState({
      currentRecipe: null,
      currentIndex: -1
    });

    RecipeDataService.findByTitle(this.state.searchTitle)
      .then((response: any) => {
        this.setState({
          recipes: response.data
        });
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  render() {
    const { searchTitle, recipes, currentRecipe, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control rounded me-2"
              placeholder="Search by title"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>All Recipes</h4>

          <ul className="list-group">
            {recipes &&
              recipes.map((recipe: IRecipeData, index: number) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveRecipe(recipe, index)}
                  key={index}
                >
                  {recipe.title}
                </li>
              ))}
          </ul>

          <button
            className="my-3 btn btn-sm btn-danger"
            onClick={this.removeAllRecipes}
          >
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {currentRecipe ? (
            <div>
              <h4>Selected Recipe</h4>
              <div>
                <label>
                  <strong>Title:</strong>
                </label>{" "}
                {currentRecipe.title}
              </div>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentRecipe.description}
              </div>
              <div>
                <label>
                  <strong>Tags:</strong>
                </label>{" "}
                {currentRecipe.published ? "Published" : "Pending"}

              </div>

              <Link
                to={"/recipes/" + currentRecipe.id}
                className="mt-2 btn btn-sm btn-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p> Click on a Recipe for more details!</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
