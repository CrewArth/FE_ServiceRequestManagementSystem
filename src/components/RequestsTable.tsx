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

export function RequestsTable({
  requests,
  admin,
  filtered,
  onClear,
  onCreate,
  onSelect,
}: {
  requests: ServiceRequest[];
  admin: boolean;
  filtered: boolean;
  onClear: () => void;
  onCreate: () => void;
  onSelect: (request: ServiceRequest) => void;
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
          <button
            className="whitespace-nowrap font-semibold text-blue-700 hover:underline"
            onClick={() => onSelect(info.row.original)}
          >
            View details
          </button>
        ),
      }),
    ],
    [admin, onSelect],
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
      ? <EmptyState title="No requests match these filters" description="Try changing or clearing the active filters." action={<button type="button" className="button-secondary" onClick={onClear}>Clear filters</button>} />
      : <EmptyState title={admin ? 'No service requests found' : 'No requests yet'} description={admin ? 'Service requests will appear here when employees create them.' : 'Create your first service request to start tracking it here.'} action={!admin && <button type="button" className="button" onClick={onCreate}>Create request</button>} />;
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
            <div className="mt-3"><RequestBadge value={request.priority} kind="priority" /></div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {admin && (
                <div>
                  <dt className="text-xs text-slate-500">Employee</dt>
                  <dd className="mt-0.5 truncate font-medium">
                    {request.owner.name}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-slate-500">Category</dt>
                <dd className="mt-0.5 font-medium">
                  {requestLabel(request.category)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Created</dt>
                <dd className="mt-0.5 font-medium">
                  {date(request.createdAt)}
                </dd>
              </div>
            </dl>
            <button
              className="mt-4 text-sm font-semibold text-blue-700 hover:underline"
              onClick={() => onSelect(request)}
            >
              View details →
            </button>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-blue-100 bg-blue-50 text-xs uppercase tracking-wide text-blue-900">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th
                    className="whitespace-nowrap px-5 py-3 font-semibold"
                    key={header.id}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
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
      <nav aria-label="Request pages" className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-100 px-4 py-3 text-sm text-slate-600 sm:px-5">
        <span>
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, requests.length)} of {requests.length}
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="request-page-size" className="sr-only">Requests per page</label>
          <select id="request-page-size" className="field !w-auto !py-1" value={table.getState().pagination.pageSize} onChange={(event) => table.setPageSize(Number(event.target.value))}>
            {[10, 25, 50].map((size) => <option key={size} value={size}>{size} per page</option>)}
          </select>
          <button type="button" className="button-secondary !px-3 !py-1" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</button>
          <span className="whitespace-nowrap text-xs">{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
          <button type="button" className="button-secondary !px-3 !py-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</button>
        </div>
      </nav>
    </>
  );
}
