"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import empleados from "@/data/empleados.json"
import styles from "./table.module.css"
import { getCoreRowModel, useReactTable, getPaginationRowModel } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function HomeTable() {

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5
    })

    const columns = [
        {
            header: "Legajo",
            accessorKey: "Legajo"
        },
        {
            header: "Nombre",
            accessorKey: "Nombre"
        },
        {
            header: "Apellido",
            accessorKey: "Apellido"
        },
        {
            header: "Estado",
            accessorKey: "Estado"
        },
        {
            header: "Periodo",
            accessorKey: "Periodo"
        }
    ]
    const table = useReactTable({
        data: empleados,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination
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
                                    <TableHead key={header.id} className={styles.tableHeaderItem}>{header.column.columnDef.header}</TableHead>
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
                    <Button onClick={() => table.setPageIndex(0)}>Primer Pagina</Button>
                    <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Siguiente</Button>
                    <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Anterior</Button>
                    <Button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>Ultima Pagina</Button>
            </div>
        </section>
    )
}


