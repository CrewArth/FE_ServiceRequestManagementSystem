import { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ServiceRequest } from "../common/types/api.types";
import { EmptyState } from "../common/components/EmptyState";
import { RequestBadge, requestLabel } from "../requests/components/RequestBadge";

const column = createColumnHelper<ServiceRequest>();
const date = (value: string) => new Date(value).toLocaleDateString();

function getStatusIconSrc(status: string) {
  if (status === "RESOLVED") return "/icons/status-resolved.svg";
  if (status === "IN_PROGRESS") return "/icons/status-inprogress.svg";
  return "/icons/status-open.svg";
}

function RowActions({
  request,
  admin,
  statuses,
  onView,
  onDelete,
  onStatusChange,
}: {
  request: ServiceRequest;
  admin: boolean;
  statuses: string[];
  onView: (r: ServiceRequest) => void;
  onDelete: (r: ServiceRequest) => void;
  onStatusChange?: (r: ServiceRequest, status: string) => void;
}) {
  const canDelete = admin || request.status === "OPEN";

  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        title="View details"
        aria-label={`View details for "${request.title}"`}
        onClick={() => onView(request)}
        className="flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-150 hover:bg-blue-50"
      >
        <img src="/icons/view.svg" alt="" aria-hidden="true" className="h-4 w-4 pointer-events-none" />
      </button>

      {admin && onStatusChange && statuses.length > 0 && (
        <div className="relative flex h-7 w-7 items-center justify-center">
          <span
            title={`Change status (current: ${requestLabel(request.status)})`}
            className="flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-150 hover:bg-amber-50"
          >
            <img src={getStatusIconSrc(request.status)} alt="" aria-hidden="true" className="h-4 w-4 pointer-events-none" />
          </span>
          <select
            aria-label={`Change status for "${request.title}"`}
            value={request.status}
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => {
              if (e.target.value !== request.status) {
                onStatusChange(request, e.target.value);
              }
            }}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {requestLabel(s)}
              </option>
            ))}
          </select>
        </div>
      )}

      {canDelete && (
        <button
          type="button"
          title="Delete request"
          aria-label={`Delete "${request.title}"`}
          onClick={() => onDelete(request)}
          className="flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-150 hover:bg-red-50"
        >
          <img src="/icons/delete.svg" alt="" aria-hidden="true" className="h-4 w-4 pointer-events-none" />
        </button>
      )}
    </div>
  );
}


export function RequestsTable({
  requests,
  admin,
  filtered,
  statuses = [],
  onClear,
  onCreate,
  onSelect,
  onDelete,
  onStatusChange,
}: {
  requests: ServiceRequest[];
  admin: boolean;
  filtered: boolean;
  statuses?: string[];
  onClear: () => void;
  onCreate: () => void;
  onSelect: (request: ServiceRequest) => void;
  onDelete: (request: ServiceRequest) => void;
  onStatusChange?: (request: ServiceRequest, status: string) => void;
}) {
  const columns = useMemo(
    () => [
      column.accessor("title", {
        header: "Request",
        cell: (info) => (
          <button
            className="max-w-[18rem] truncate text-left font-semibold text-blue-800 hover:underline"
            title={info.getValue()}
            onClick={() => onSelect(info.row.original)}
          >
            {info.getValue()}
          </button>
        ),
      }),
      ...(admin ? [column.accessor("owner.name", { header: "Employee" })] : []),
      column.accessor("category", {
        header: "Category",
        cell: (info) => requestLabel(info.getValue()),
      }),
      column.accessor("priority", {
        header: "Priority",
        cell: (info) => <RequestBadge value={info.getValue()} kind="priority" />,
      }),
      column.accessor("status", {
        header: "Status",
        cell: (info) => <RequestBadge value={info.getValue()} kind="status" />,
      }),
      column.accessor("createdAt", {
        header: "Created",
        cell: (info) => date(info.getValue()),
      }),
      column.accessor("updatedAt", {
        header: "Updated",
        cell: (info) => date(info.getValue()),
      }),
      column.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <RowActions
            request={info.row.original}
            admin={admin}
            statuses={statuses}
            onView={onSelect}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ),
      }),
    ],
    [admin, statuses, onSelect, onDelete, onStatusChange],
  );

  const table = useReactTable({
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: true,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  if (!requests.length) {
    return filtered
      ? (
        <EmptyState
          title="No requests match these filters"
          description="Try changing or clearing the active filters."
          action={<button type="button" className="button-secondary" onClick={onClear}>Clear filters</button>}
        />
      ) : (
        <EmptyState
          title={admin ? "No service requests found" : "No requests yet"}
          description={
            admin
              ? "Service requests will appear here when employees create them."
              : "Create your first service request to start tracking it here."
          }
          action={!admin && <button type="button" className="button" onClick={onCreate}>Create request</button>}
        />
      );
  }

  return (
    <>
      <div className="grid gap-3 p-4 lg:hidden">
        {table.getRowModel().rows.map(({ original: request }) => (
          <article
            className="rounded-lg border border-blue-100 bg-white p-4 transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50/40"
            key={request.id}
          >
            <div className="flex items-start justify-between gap-3">
              <button
                className="min-w-0 text-left font-semibold text-blue-900 hover:underline"
                onClick={() => onSelect(request)}
              >
                {request.title}
              </button>
              <RequestBadge value={request.status} kind="status" />
            </div>
            <div className="mt-3">
              <RequestBadge value={request.priority} kind="priority" />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {admin && (
                <div>
                  <dt className="text-xs text-slate-500">Employee</dt>
                  <dd className="mt-0.5 truncate font-medium">{request.owner.name}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-slate-500">Category</dt>
                <dd className="mt-0.5 font-medium">{requestLabel(request.category)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Created</dt>
                <dd className="mt-0.5 font-medium">{date(request.createdAt)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center gap-1 border-t border-blue-50 pt-3">
              <RowActions
                request={request}
                admin={admin}
                statuses={statuses}
                onView={onSelect}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
              <span className="ml-1 text-xs text-slate-400">
                {admin ? "View · Status · Delete" : (request.status === "OPEN" ? "View · Delete" : "View")}
              </span>
            </div>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-blue-100 bg-blue-50 text-xs uppercase tracking-wide text-blue-900">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th className="whitespace-nowrap px-5 py-3 font-semibold" key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                className="border-b border-blue-50 transition-colors duration-200 last:border-b-0 hover:bg-blue-50/60"
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className="px-5 py-4 align-middle" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav
        aria-label="Request pages"
        className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-100 px-4 py-3 text-sm text-slate-600 sm:px-5"
      >
        <span>
          Showing{" "}
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            requests.length,
          )}{" "}
          of {requests.length}
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="request-page-size" className="sr-only">Requests per page</label>
          <select
            id="request-page-size"
            className="field !w-auto !py-1"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>{size} per page</option>
            ))}
          </select>
          <button type="button" className="button-secondary !px-3 !py-1" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </button>
          <span className="whitespace-nowrap text-xs">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <button type="button" className="button-secondary !px-3 !py-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </button>
        </div>
      </nav>
    </>
  );
}
