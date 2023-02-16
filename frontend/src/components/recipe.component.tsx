import { Component, ChangeEvent } from "react";
import { RouteComponentProps } from 'react-router-dom';

import RecipeDataService from "../services/recipe.service";
import IRecipeData from "../types/recipe.type";


interface RouterProps { // type for `match.params`
  id: string; // must be type `string` since value comes from the URL
}

type Props = RouteComponentProps<RouterProps>;

type State = {
  currentRecipe: IRecipeData;
  message: string;
}

export default class Recipe extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getRecipe = this.getRecipe.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateRecipe = this.updateRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);

    this.state = {
      currentRecipe: {
        id: null,
        title: "",
        description: "",
        published: false,
      },
      message: "",
    };
  }

  componentDidMount() {
    this.getRecipe(this.props.match.params.id);
  }

  onChangeTitle(e: ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;

    this.setState(function (prevState) {
      return {
        currentRecipe: {
          ...prevState.currentRecipe,
          title: title,
        },
      };
    });
  }

  onChangeDescription(e: ChangeEvent<HTMLInputElement>) {
    const description = e.target.value;

    this.setState((prevState) => ({
      currentRecipe: {
        ...prevState.currentRecipe
      },
    }));
  }

  getRecipe(id: string) {
    RecipeDataService.get(id)
      .then((response: any) => {
        this.setState({
          currentRecipe: response.data,
        });
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  updatePublished(status: boolean) {
    const data: IRecipeData = {
      id: this.state.currentRecipe.id,
      title: this.state.currentRecipe.title,
      description: this.state.currentRecipe.description,
      published: status,
    };

    RecipeDataService.update(data, this.state.currentRecipe.id)
      .then((response: any) => {
        this.setState((prevState) => ({
          currentRecipe: {
            ...prevState.currentRecipe,
            published: status,
          },
          message: "The status was updated successfully!"
        }));
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  updateRecipe() {
    RecipeDataService.update(
      this.state.currentRecipe,
      this.state.currentRecipe.id
    )
      .then((response: any) => {
        console.log(response.data);
        this.setState({
          message: "The recipe was updated successfully!",
        });
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  deleteRecipe() {
    RecipeDataService.delete(this.state.currentRecipe.id)
      .then((response: any) => {
        console.log(response.data);
        this.props.history.push("/recipes");
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  render() {
    const { currentRecipe} = this.state;

    return (
      <div>
        {currentRecipe ? (
          <div className="edit-form">
            <h4>Selected Recipe</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Recipe Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentRecipe.title}
                  onChange={this.onChangeTitle}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentRecipe.description}
                  onChange={this.onChangeDescription}
                />
              </div>

              <div className="form-group">
                <label>
                  <strong>Tags: </strong>
                </label>{" "}
                {currentRecipe.published ? "Published" : "Pending"}
              </div>
            </form>

            <div className="mt-3">
                {currentRecipe.published ? (
                    <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => this.updatePublished(false)}
                    >
                        UnPublish
                    </button>
                ) : (
                    <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => this.updatePublished(true)}
                    >
                        Publish
                    </button>
                )}

                <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={this.deleteRecipe}
                >
                Delete
                </button>

                <button
                type="submit"
                className="btn btn-sm btn-success"
                onClick={this.updateRecipe}
                >
                Update
                </button>
                <p>{this.state.message}</p>
            </div>
          </div>
        ) : (
          <div>
            <br />
            <p>Click on a Recipe for more details!</p>
          </div>
        )}
      </div>
    );
  }
}