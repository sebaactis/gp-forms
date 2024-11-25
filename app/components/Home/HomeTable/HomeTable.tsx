"use client"

import styles from "./table.module.css"
import { useState } from "react"
import empleados from "@/data/empleados.json"
import { getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, ColumnDef, PaginationState, SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { TableComponent } from "./TableComponent"
import PaginationComponent from "./PaginationComponent"
import { TableFilters } from "./TableFilters"

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
        { header: "Nro Legajo", accessorKey: "legajo", },
        { header: "Nombre", accessorKey: "nombre" },
        { header: "Apellido", accessorKey: "apellido" },
        { header: "Estado", accessorKey: "estado" },
        { header: "Periodo", accessorKey: "periodo" }
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

    const headers = table.getHeaderGroups().flatMap((headerGroup) => headerGroup.headers);

    return (
        <section className={styles.tableSection}>
            <TableComponent tableData={table} styles={styles} />
            <TableFilters headers={headers} styles={styles} />
            <PaginationComponent tableData={table} styles={styles} />
        </section>
    )
}


