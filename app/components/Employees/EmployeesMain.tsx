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
import SyncLoader from "react-spinners/SyncLoader";
import { useToast } from "@/hooks/use-toast";

const EmployeesMain = () => {

    const { toast } = useToast();
    const [empleados, setEmpleados] = useState<EmployeeWithRelations[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10
    })
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [loading, setLoading] = useState(false);

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
                setLoading(false);
            }

        }
        getEmployees()
    }, [toast])

    return (
        <div className={styles.container}>
            <Button className={styles.addIcon}>
                <Link className={styles.linkIcon} href="/employees/create">
                    <UserPlus2 color="white" size={20} /> Agregar GPeer
                </Link>
            </Button>
            {loading &&
                <div className="justify-self-center mb-10">
                    <SyncLoader size={15} margin={4} color="white" />
                </div>}
            <TableFilters headers={headers} styles={styles} />
            <EmployeesTable tableData={table} styles={styles} setEmpleados={setEmpleados} />
            <PaginationComponent tableData={table} styles={styles} />
        </div>
    )
}

export default EmployeesMain