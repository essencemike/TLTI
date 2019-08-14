export interface ApiConfig {
  name: string;
  method: string;
  path: string;
  desc?: string;
  mockPath?: string;
  query?: string[];
  params?: string[];
}

export interface ApiMakerOptions {
  mockBaseURL?: string;
  mock?: boolean;
  debug?: boolean;
  config?: any;
}

export interface ApiBuilderOptions {
  namespace: string;
  config: ApiConfig[];
  mockBaseURL?: string;
  mock?: boolean;
  debug?: boolean;
}
