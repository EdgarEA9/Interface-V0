'use client'

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { ChevronDown, ChevronRight, ChevronUp, RefreshCw, X, ThumbsUp, ThumbsDown, BarChart3, FileText, BookOpen, AlertCircle, CheckCircle2, Info } from 'lucide-react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  RowSelectionState,
  getPaginationRowModel,
} from "@tanstack/react-table"

type JournalEntry = {
  id: string
  date: string
  account: string
  description: string
  debit: number
  credit: number
  status: 'Passed' | 'Error'
  errorType?: string
  aiSuggestion?: string
  userOverride: boolean
}

const data: JournalEntry[] = [
  { id: 'JE001', date: '2023-06-15', account: 'Cash', description: 'Monthly rent payment', debit: 2000, credit: 0, status: 'Passed', userOverride: false },
  { id: 'JE002', date: '2023-06-16', account: 'Accounts Receivable', description: 'Invoice for services', debit: 5000, credit: 0, status: 'Error', errorType: 'VAT Error', aiSuggestion: 'Apply VAT code V1', userOverride: false },
  { id: 'JE003', date: '2023-06-17', account: 'Inventory', description: 'Purchase of goods', debit: 10000, credit: 0, status: 'Passed', userOverride: false },
  { id: 'JE004', date: '2023-06-18', account: 'Accounts Payable', description: 'Supplier payment', debit: 0, credit: 7500, status: 'Error', errorType: 'Unbalanced Entry', aiSuggestion: 'Adjust credit to 7000', userOverride: false },
  { id: 'JE005', date: '2023-06-19', account: 'Revenue', description: 'Sales income', debit: 0, credit: 15000, status: 'Passed', userOverride: false },
]

export default function AuditDashboard() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [expandedPanel, setExpandedPanel] = useState(false)

  const columns: ColumnDef<JournalEntry>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "JE ID",
    },
    {
      accessorKey: "date",
      header: "Entry Date",
    },
    {
      accessorKey: "account",
      header: "Account",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "debit",
      header: "Debit",
      cell: ({ row }) => (
        <div className="text-right">{row.getValue("debit").toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
      ),
    },
    {
      accessorKey: "credit",
      header: "Credit",
      cell: ({ row }) => (
        <div className="text-right">{row.getValue("credit").toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <div className="flex items-center">
            {status === 'Passed' ? (
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
            )}
            {status}
          </div>
        )
      },
    },
    {
      accessorKey: "errorType",
      header: "Error Type",
    },
    {
      accessorKey: "aiSuggestion",
      header: "AI Suggestion",
    },
    {
      accessorKey: "userOverride",
      header: "User Override",
      cell: ({ row }) => (
        <Checkbox
          checked={row.getValue("userOverride")}
          onCheckedChange={(value) => {
            // Here you would typically update the data source
            console.log(`User override for ${row.getValue("id")} set to ${value}`)
          }}
          aria-label="Override AI suggestion"
        />
      ),
    },
    {
      id: "auditTrail",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => console.log(`View audit trail for ${row.getValue("id")}`)}>
          <Info className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">FinTech Audit</h2>
        </div>
        <nav className="space-y-2">
          <a href="#" className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
            <BarChart3 size={16} className="mr-2" />
            <span>Journal Entries</span>
          </a>
          <a href="#" className="flex items-center text-sm font-medium text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md">
            <FileText size={16} className="mr-2" />
            <span>Reports</span>
          </a>
          <a href="#" className="flex items-center text-sm font-medium text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md">
            <BookOpen size={16} className="mr-2" />
            <span>Audit Logs</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Journal Entry Audit</h1>
          <Card>
            <CardHeader>
              <CardTitle>Audit Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <div className="w-1/3">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Passed', value: data.filter(entry => entry.status === 'Passed').length },
                        { name: 'Error', value: data.filter(entry => entry.status === 'Error').length },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#4ade80" />
                      <Cell fill="#f87171" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-2/3 pl-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Entries</p>
                    <p className="text-2xl font-bold">{data.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Passed Entries</p>
                    <p className="text-2xl font-bold text-green-500">{data.filter(entry => entry.status === 'Passed').length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Entries with Errors</p>
                    <p className="text-2xl font-bold text-red-500">{data.filter(entry => entry.status === 'Error').length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completion Rate</p>
                    <p className="text-2xl font-bold">{((data.filter(entry => entry.status === 'Passed').length / data.length) * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Filter accounts..."
              value={(table.getColumn("account")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("account")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <Select
              value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
              onValueChange={(value) =>
                table.getColumn("status")?.setFilterValue(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="Passed">Passed</SelectItem>
                <SelectItem value="Error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("Accept AI suggestions for selected entries")}
              disabled={Object.keys(rowSelection).length === 0}
            >
              Accept AI Suggestions
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("Reject AI suggestions for selected entries")}
              disabled={Object.keys(rowSelection).length === 0}
            >
              Reject AI Suggestions
            </Button>
            <Button>
              <RefreshCw size={16} className="mr-2" />
              Sync
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanSort() && (
                          <Button
                            variant="ghost"
                            onClick={() => header.column.toggleSorting()}
                          >
                            {{
                              asc: <ChevronUp className="ml-2 h-4 w-4" />,
                              desc: <ChevronDown className="ml-2 h-4 w-4" />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </Button>
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

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
      </main>

      {/* Right Panel */}
      <aside className={`bg-white border-l border-gray-200 transition-all duration-300 ease-in-out ${
        expandedPanel ? 'w-96' : 'w-16'
      }`}>
        <div className="p-4">
          {expandedPanel ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">AI Suggestions</h3>
                <Button variant="ghost" size="sm" onClick={() => setExpandedPanel(false)}>
                  <X size={16} />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Corrected VAT Codes</h4>
                  <p className="text-sm">Suggested VAT code: V1 (Standard Rate)</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Account Classifications</h4>
                  <p className="text-sm">Suggested classification: Operating Expense</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Amortization Schedule</h4>
                  <p className="text-sm">Suggested schedule: Straight-line, 5 years</p>
                </div>
              </div>
              <Button className="mt-4 w-full">
                <RefreshCw size={16} className="mr-2" />
                Sync Suggestions
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => setExpandedPanel(true)}>
              <ChevronRight size={16} />
            </Button>
          )}
        </div>
      </aside>
    </div>
  )
}