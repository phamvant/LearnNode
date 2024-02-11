export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  username: string;
  verified: boolean;
  status: string;
  roles: string[];
}
