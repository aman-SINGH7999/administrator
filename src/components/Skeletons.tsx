import React from 'react'
import { Table, TableBody, TableCell, TableRow } from './ui/table'
import { Skeleton } from './ui/skeleton'

interface TableSkeletonProps {
  rows: number
  columns: number
}

export function TableSkeleton({ rows, columns }: TableSkeletonProps) {
  const rowArray = Array.from({ length: rows })
  const colArray = Array.from({ length: columns })

  return (
    <>
      <TableBody>
        {rowArray.map((_, rIdx) => (
          <TableRow key={`row-${rIdx}`}>
            {colArray.map((_, cIdx) => (
              <TableCell key={`cell-${rIdx}-${cIdx}`}><Skeleton className="h-4 w-full" /></TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </>
  )
}
