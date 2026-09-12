"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty } from "@/components/ui/empty"
import { cn } from "@/lib/utils"
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export interface Column<T> {
  key: keyof T | string
  header: string
  cell?: (item: T) => React.ReactNode
  className?: string
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  searchPlaceholder?: string
  searchKey?: keyof T
  isLoading?: boolean
  emptyMessage?: string
  emptyDescription?: string
  pageSize?: number
  className?: string
  onRowClick?: (item: T) => void
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchPlaceholder = "Search...",
  searchKey,
  isLoading = false,
  emptyMessage = "No results found",
  emptyDescription = "Try adjusting your search or filters",
  pageSize = 10,
  className,
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)

  const filteredData = React.useMemo(() => {
    if (!search || !searchKey) return data
    return data.filter((item) => {
      const value = item[searchKey]
      if (typeof value === "string") {
        return value.toLowerCase().includes(search.toLowerCase())
      }
      return false
    })
  }, [data, search, searchKey])

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  React.useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const getCellValue = (item: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(item)
    }
    const value = item[column.key as keyof T]
    if (value === null || value === undefined) return "-"
    return String(value)
  }

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {searchKey && <Skeleton className="h-10 w-full max-w-sm" />}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={String(column.key)} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)} className={column.className}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {searchKey && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn("font-semibold", column.className)}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48">
                  <Empty>
                    <Empty.Title>{emptyMessage}</Empty.Title>
                    <Empty.Description>{emptyDescription}</Empty.Description>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow
                  key={index}
                  className={cn(onRowClick && "cursor-pointer")}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <TableCell key={String(column.key)} className={column.className}>
                      {getCellValue(item, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
            {filteredData.length} results
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <span className="px-3 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
