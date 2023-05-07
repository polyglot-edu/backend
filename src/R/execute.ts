import R from "./R";


export const execTest = () => {
  const res = R.callMethod("./src/R/scripts/API_1_html.R", "run", ["software engineering","documentation"]);
  console.log(res);
}