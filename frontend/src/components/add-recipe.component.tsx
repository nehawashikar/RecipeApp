import { Component, ChangeEvent } from "react";
import RecipeDataService from "../services/recipe.service";
import IRecipeData from '../types/recipe.type';
import UserService from "../services/user.service";


type Props = {};

type State = IRecipeData & {
  submitted: boolean
  content: string;
};

export default class AddRecipe extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);
    this.newRecipe = this.newRecipe.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "",
      published: false,
      submitted: false,
      content: ""
    };
  }


  onChangeTitle(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeDescription(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      description: e.target.value
    });
  }

  saveRecipe() {
    const data: IRecipeData = {
      title: this.state.title,
      description: this.state.description
    };

    RecipeDataService.create(data)
      .then((response: any) => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          published: response.data.published,
          submitted: true
        });
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  newRecipe() {
    this.setState({
      id: null,
      title: "",
      description: "",
      published: false,
      submitted: false
    });
  }
  
  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

    render() {
      const { submitted, title, description } = this.state;
  
      return (
        <div className="submit-form">
          {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <button className="btn btn-success" onClick={this.newRecipe}>
                Add
              </button>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label htmlFor="title">Recipe Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  required
                  value={title}
                  onChange={this.onChangeTitle}
                  name="title"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  required
                  value={description}
                  onChange={this.onChangeDescription}
                  name="description"
                />
              </div>
  
              <button onClick={this.saveRecipe} className="btn btn-success mt-2">
                Submit
              </button>
            </div>
          )}
        </div>
      );
    }
  
}