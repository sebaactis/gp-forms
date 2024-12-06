"use client"

import { EmployeeWithRelations } from "@/types";
import { getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, ColumnDef, PaginationState, SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { useEffect, useState } from "react";
import EmployeesTable from "./EmployeesTable";
import styles from "./employees.module.css"
import { TableFilters } from "../Table/TableFilters";
import PaginationComponent from "../Table/PaginationComponent";
import Link from "next/link";
import { UserPlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmployeesMain = () => {

    const [empleados, setEmpleados] = useState<EmployeeWithRelations[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10
    })
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const columns: ColumnDef<EmployeeWithRelations>[] = [
        { header: "ID", accessorKey: "id" },
        { header: "Nro Legajo", accessorKey: "legajo", },
        { header: "Correo", accessorKey: "email" },
        { header: "Nombre", accessorKey: "nombre" },
        { header: "Apellido", accessorKey: "apellido" },
        { header: "Gerencia", accessorKey: "gerencia" },
        { header: "Puesto", accessorKey: "puesto" },
        { header: "Seniority", accessorKey: "seniority" }
    ]

    const table = useReactTable<EmployeeWithRelations>({
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
        <div className={styles.container}>
            <Button className={styles.addIcon}>
                <Link className={styles.linkIcon} href="/employees/create">
                <UserPlus2 color="white"size={20}/> Agregar GPeer 
                </Link>
            </Button>

            <TableFilters headers={headers} styles={styles} />
            <EmployeesTable tableData={table} styles={styles} />
            <PaginationComponent tableData={table} styles={styles} />
        </div>
    )
}

export default EmployeesMain