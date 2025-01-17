import * as React from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDownIcon, EllipsisVertical, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { Link, useNavigate } from "react-router-dom";

interface GenericTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  viewMode: "Table" | "Card";
  detailsPath?: string; // Default to 'item' for backward compatibility
  searchField?: string; // Default to 'name' for backward compatibility
  searchPlaceholder?: string; // Default to 'Filter items...' for backward compatibility
  context: string;
  onDeleteSelected?: (selectedIds: string[]) => void;
}

export function GenericTable<T>({
  data,
  columns,
  viewMode,
  context,
  detailsPath = "item", // Default to 'item' for backward compatibility
  searchField = "name", // Default to 'name' for backward compatibility
  onDeleteSelected,
  searchPlaceholder = "Filter items...",
}: GenericTableProps<T>) {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  console.log(data);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      // description: true, // Hidden by default
      unit: false, // Hidden by default
      sku: false, // Hidden by default
      expiryDate: false, // Hidden by default
      manufacturer: false, // Hidden by default
      batchNumber: false, // Hidden by default
      category: false, // Hidden by default
      storageConditions: false, // Hidden by default
      description: false, // Hidden by default
      image: false, // Hidden by default
      status: false, // Hidden by default
      type: false, // Hidden by default
      customValue: false,
      username: false,
      lastUpdatedDate: false,
      createdDate: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});
  // const [viewMode, setViewMode] = React.useState<"table" | "card">("Table");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDeleteSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);
    onDeleteSelected?.(selectedIds);
    setRowSelection({});
  };

  const handleRowClick = (id: string) => {
    navigate(`/admin/${context}/${detailsPath}/${id}`);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Filter stocks..."
          className="max-w-sm py-0 h-10"
          value={
            (table.getColumn(searchField)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(searchField)?.setFilterValue(event.target.value)
          }
        />
        {Object.keys(rowSelection).length > 0 && (
          <Button
            variant="destructive"
            size="lg"
            onClick={handleDeleteSelected}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected ({Object.keys(rowSelection).length})
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {viewMode === "Table" ? (
        <div className="rounded-md max-w-full border overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100 rounded">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead className="text-slate-700" key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length || 1 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={(e) => {
                      // Prevent navigation when clicking checkbox or action buttons
                      if (
                        (e.target as HTMLElement).closest(
                          'input[type="checkbox"], button, a'
                        )
                      )
                        return;
                      handleRowClick(row.original.id);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.column.id === "image" ? (
                          <img
                            src={cell.getValue() as string}
                            alt="Image"
                            className="aspect-square max-w-full h-10"
                          />
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns?.length || 1}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {table.getRowModel().rows.map((row) => (
            <Card
              key={row.id}
              className="p-6 shadow-md transition-transform flex flex-col items-center transform hover:scale-105 hover:shadow-2xl rounded-lg"
              onClick={() => handleRowClick(row.original.id)}
            >
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="mb-4 bg-red-100 ">
                  <strong className="text-gray-700 w-100 mr-2 font-semibold">
                    {cell.column.columnDef.header}
                  </strong>
                  {cell.column.id === "image" ? (
                    <div className="w-full h-48 overflow-hidden rounded-lg">
                      <img
                        src={cell.getValue() as string}
                        alt="Image"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </div>
              ))}
              <div className="mt-6 flex justify-between items-center">
                <Link
                  to={`/inventory/item/edit/${row.original.id}`}
                  className="inline-flex items-center justify-center rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 py-2 px-4 transition-colors"
                >
                  <EllipsisVertical className="h-5 w-5 mr-2" />
                  Edit
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
