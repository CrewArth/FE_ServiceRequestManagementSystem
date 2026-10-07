import { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ServiceRequest } from "../common/types/api.types";

const column = createColumnHelper<ServiceRequest>();
const label = (value: string) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
const date = (value: string) => new Date(value).toLocaleDateString();

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
      {label(status)}
    </span>
  );
}

export function RequestsTable({
  requests,
  admin,
  onSelect,
}: {
  requests: ServiceRequest[];
  admin: boolean;
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
        cell: (info) => label(info.getValue()),
      }),
      column.accessor("priority", {
        header: "Priority",
        cell: (info) => label(info.getValue()),
      }),
      column.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      column.accessor("createdAt", {
        header: "Created",
        cell: (info) => date(info.getValue()),
      }),
      column.display({
        id: "actions",
        header: "",
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
  });

  if (!requests.length) {
    return (
      <div className="px-5 py-12 text-center">
        <p className="font-semibold text-blue-950">No requests found</p>
        <p className="mt-1 text-sm text-slate-500">
          Try another status or priority filter.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 p-4 lg:hidden">
        {requests.map((request) => (
          <article
            className="rounded-lg border border-blue-100 bg-white p-4"
            key={request.id}
          >
            <div className="flex items-start justify-between gap-3">
              <button
                className="min-w-0 text-left font-semibold text-blue-900 hover:underline"
                onClick={() => onSelect(request)}
              >
                {request.title}
              </button>
              <StatusBadge status={request.status} />
            </div>
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
                  {label(request.category)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Priority</dt>
                <dd className="mt-0.5 font-medium">
                  {label(request.priority)}
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
                className="border-b border-blue-50 last:border-b-0 hover:bg-blue-50/60"
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
    </>
  );
}
