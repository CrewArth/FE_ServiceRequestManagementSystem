import { lazy } from "react";

export const LoginPage = lazy(() =>
  import("../auth/pages/LoginPage").then((module) => ({
    default: module.LoginPage,
  })),
);

export const RegisterPage = lazy(() =>
  import("../auth/pages/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  })),
);

export const AppLayout = lazy(() =>
  import("../layouts/AppLayout").then((module) => ({
    default: module.AppLayout,
  })),
);

export const DashboardPage = lazy(() =>
  import("../dashboard/pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  })),
);

export const RequestsPage = lazy(() =>
  import("../requests/pages/RequestsPage").then((module) => ({
    default: module.RequestsPage,
  })),
);
