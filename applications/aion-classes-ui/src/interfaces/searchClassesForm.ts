export interface ISearchClassesForm {
  city: string;
  state?: { value: string; label: string };
  distance?: { value: number | string; label: string };
}
