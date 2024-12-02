"use client"

import styles from "./table.module.css"
import { useEffect, useState } from "react"
import { getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, ColumnDef, PaginationState, SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { TableComponent } from "./TableComponent"
import PaginationComponent from "./PaginationComponent"
import { TableFilters } from "./TableFilters"
import { Employee } from "@prisma/client"

export default function HomeTable() {
    const [empleados, setEmpleados] = useState<Employee[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10
    })
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const columns: ColumnDef[] = [
        { header: "Nro Legajo", accessorKey: "legajo", },
        { header: "Correo", accessorKey: "email" },
        { header: "Nombre", accessorKey: "nombre" },
        { header: "Apellido", accessorKey: "apellido" },
        { header: "Gerencia", accessorKey: "gerencia" },
        { header: "Puesto", accessorKey: "puesto" },
        { header: "seniority", accessorKey: "seniority" },
        { header: "Estado", accessorFn: (row) => row.CompletedForm[0]?.status || "No asignado", },
        {
            header: "Fecha Limite", accessorFn: (row) => {
                const endDate = row.CompletedForm[0]?.endDate;
                return endDate ? new Date(endDate).toLocaleDateString("es-ES") : "No asignado";
            },
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
    const headers = table.getHeaderGroups().flatMap((headerGroup) => headerGroup.headers);

    const getEmployees = async () => {
        const response = await fetch('/api/employees')

        if (!response.ok) {
            throw new Error("Error al traer los empleados")
        }

        const data = await response.json();
        setEmpleados(data)
    }

    useEffect(() => { getEmployees() }, [])

    return (
        <section className={styles.tableSection}>
            <TableComponent tableData={table} styles={styles} />
            <TableFilters headers={headers} styles={styles} />
            <PaginationComponent tableData={table} styles={styles} />
        </section>
    )
}


