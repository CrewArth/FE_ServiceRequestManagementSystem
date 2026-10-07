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

export const EmployeeDashboard = lazy(() =>
  import("../employee/pages/EmployeeDashboard").then((module) => ({
    default: module.EmployeeDashboard,
  })),
);

export const AdminDashboard = lazy(() =>
  import("../admin/pages/AdminDashboard").then((module) => ({
    default: module.AdminDashboard,
  })),
);
