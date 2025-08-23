import { HttpMethod } from './resources';

export interface IActionGenerator {
  [key: string]: any;
}

export interface IReducerAction {
  type: string;
  response?: any;
  error?: any;
  actionData?: any;
}

export interface IApiCall {
  types: string[];
  url: string;
  method: HttpMethod;
  data?: any;
}

export interface IActionData {
  errorMessage: string;
}
