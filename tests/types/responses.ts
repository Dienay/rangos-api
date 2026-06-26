export type SignupResponse = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  typeUser: string;
  token: string;
  message: string;
};

export type LoginResponse = {
  _id: string;
  token: string;
  message: string;
};

export type UserResponse = {
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    typeUser: string;
  };
};

export type UpdateUserResponse = {
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    typeUser: string;
  };
  message: string;
};

export type ErrorResponse = {
  error: {
    status: number;
    message: string;
  };
};
