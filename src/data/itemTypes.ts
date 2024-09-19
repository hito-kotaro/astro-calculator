export type material = {
  name: string;
  amount: number;
};

export type recipe = {
  id: number;
  name: string;
  printer: string;
  material: material[];
};

export type selectedRecipe = {
  recipe: recipe;
  amount: number;
};
