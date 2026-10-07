import { lazy } from 'react';

export const RequestsTable = lazy(() =>
  import('../components/RequestsTable').then((module) => ({ default: module.RequestsTable })),
);

export const NewRequestModal = lazy(() =>
  import('../employee/modal/NewRequestModal').then((module) => ({ default: module.NewRequestModal })),
);

export const RequestDetailsModal = lazy(() =>
  import('../components/RequestDetailsModal').then((module) => ({ default: module.RequestDetailsModal })),
);

export const DeleteRequestModal = lazy(() =>
  import('../components/DeleteRequestModal').then((module) => ({ default: module.DeleteRequestModal })),
);
