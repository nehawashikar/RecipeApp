import http from "../http-common";
import IRecipeData from "../types/recipe.type"

class RecipeDataService {
  getAll() {
    return http.get<Array<IRecipeData>>("/recipes");
  }

  get(id: string) {
    return http.get<IRecipeData>(`/recipes/${id}`);
  }

  create(data: IRecipeData) {
    return http.post<IRecipeData>("/recipes", data);
  }

  update(data: IRecipeData, id: any) {
    return http.put<any>(`/recipes/${id}`, data);
  }

  delete(id: any) {
    return http.delete<any>(`/recipes/${id}`);
  }

  deleteAll() {
    return http.delete<any>(`/recipes`);
  }

  findByTitle(title: string) {
    return http.get<Array<IRecipeData>>(`/recipes?title=${title}`);
  }
}

export default new RecipeDataService();