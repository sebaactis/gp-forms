"use client"

import styles from "./table.module.css"
import { useEffect, useState } from "react"
import { getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, ColumnDef, PaginationState, SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { TableComponent } from "./TableComponent"
import PaginationComponent from "../../Table/PaginationComponent"
import { TableFilters } from "../../Table/TableFilters"
import { EmployeeWithRelations } from "@/types"
import { useToast } from "@/hooks/use-toast"
import SyncLoader from "react-spinners/SyncLoader"

export default function HomeTable() {
    const { toast } = useToast();
    const [empleados, setEmpleados] = useState<EmployeeWithRelations[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10
    })
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [loading, setLoading] = useState<boolean>(false);

    const columns: ColumnDef<EmployeeWithRelations>[] = [
        { header: "Nro Legajo", accessorKey: "legajo", },
        { header: "Correo", accessorKey: "email" },
        { header: "Nombre", accessorKey: "nombre" },
        { header: "Apellido", accessorKey: "apellido" },
        { header: "Gerencia", accessorKey: "gerencia" },
        { header: "Puesto", accessorKey: "puesto" },
        { header: "Seniority", accessorKey: "seniority" },
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


    useEffect(() => {
        const getEmployees = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/employees')

                if (!response.ok) {
                    throw new Error("Error al traer los empleados")
                }

                const data = await response.json();
                setEmpleados(data)
            } catch {
                toast({
                    title: 'Error al traer los empleados',
                    className: 'bg-red-800',
                    duration: 3000
                })
            } finally {
                setLoading(false)
            }
        }
        getEmployees();
    }, [toast])

    return (
        <section className={styles.tableSection}>
            {loading &&
                <div className="justify-self-center mb-10">
                    <SyncLoader size={15} margin={4} color="white" />
                </div>}
            <TableComponent tableData={table} styles={styles} />
            <TableFilters headers={headers} styles={styles} />
            <PaginationComponent tableData={table} styles={styles} />
        </section>
    )
}


