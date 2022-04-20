import { IAutocompleteOption } from '@pec/aion-ui-core/interfaces/autocompleteOption';

export interface ISearchTraineesForm {
  birthDate: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  ssnLastFour: string;
  organization: IAutocompleteOption;
}
