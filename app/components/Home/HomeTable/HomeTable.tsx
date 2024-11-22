"use client"

import styles from "./table.module.css"
import { useState } from "react"
import empleados from "@/data/empleados.json"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, ColumnDef, PaginationState, SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { SelectTrigger } from "@radix-ui/react-select"

type Empleado = {
    legajo: number;
    nombre: string;
    apellido: string;
    estado: string;
    periodo: string;
};
export default function HomeTable() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 15
    })

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const columns: ColumnDef<Empleado>[] = [
        {
            header: "Nro Legajo",
            accessorKey: "legajo",
        },
        {
            header: "Nombre",
            accessorKey: "nombre"
        },
        {
            header: "Apellido",
            accessorKey: "apellido"
        },
        {
            header: "Estado",
            accessorKey: "estado"
        },
        {
            header: "Periodo",
            accessorKey: "periodo"
        }
    ]
    const table = useReactTable({
        data: empleados,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        state: {
            pagination,
            sorting,
            columnFilters
        }
    })

    return (
        <section className={styles.tableSection}>
            <Table className={styles.table}>
                <TableHeader className={styles.tableHeader}>

                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {
                                headerGroup.headers.map(header => (
                                    <TableHead
                                        key={header.id}
                                        className={styles.tableHeaderItem}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {header.column.columnDef.header}
                                        {header.column.getIsSorted() === 'asc' ? ' 🔼' : header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}

                                        {header.column.getCanFilter() && (
                                            <input
                                                type="text"
                                                value={(table.getState().columnFilters.find(filter => filter.id === header.id)?.value) ?? ""}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => header.column.setFilterValue(e.target.value as string)}
                                                onClick={(e) => e.stopPropagation()}
                                                className={styles.searchInput}
                                            />

                                        )}
                                    </TableHead>
                                ))
                            }
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className={styles.tableBody}>


                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id} className={styles.tableBodyItem}>{cell.renderValue()}</TableCell>
                            ))}
                        </TableRow>
                    ))}

                </TableBody>
            </Table>

            <div className={styles.pagination}>
                <Button className={styles.paginationBtn} onClick={() => table.setPageIndex(0)}>Primer Pagina</Button>
                <Button className={styles.paginationBtn} onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Anterior</Button>
                <Button className={styles.paginationBtn} onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Siguiente</Button>
                <Button className={styles.paginationBtn} onClick={() => table.setPageIndex(table.getPageCount() - 1)}>Ultima Pagina</Button>
                <Select
                    value={String(table.getState().pagination.pageIndex)}
                    onValueChange={(value) => table.setPageIndex(Number(value))}
                    
                >
                    <SelectTrigger className={styles.pageSelect}>
                        <SelectValue placeholder={`Página ${table.getState().pagination.pageIndex + 1}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: table.getPageCount() }).map((_, index) => (
                            <SelectItem key={index} value={String(index)}>
                                {index + 1}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </section>
    )
}


