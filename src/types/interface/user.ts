export interface User {
  username: string;
  password: string;
}

export interface LoginForm extends User {
  autoLogin?: boolean;
}
