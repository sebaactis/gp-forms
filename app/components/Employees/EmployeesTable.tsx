import { Button } from '@/components/ui/button'
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { EmployeeWithRelations } from '@/types'
import React from 'react'
import { PencilIcon, Trash2 } from "lucide-react"
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import DialogWrapper from '../Globals/Modal/DialogWrapper'

interface Props {
    tableData: EmployeeWithRelations[]
    styles: Record<string, string>
    setEmpleados: React.Dispatch<React.SetStateAction<EmployeeWithRelations[]>>
}
const EmployeesTable = ({ tableData, styles, setEmpleados }: Props) => {

    const { toast } = useToast();

    const handleDelete = async (id) => {

        try {
            const response = await fetch(`/api/employees/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el empleado");
            }

            setEmpleados(prevState => prevState.filter(e => e.id !== id))

            toast({
                title: 'Empleado eliminado correctamente!',
                className: 'bg-green-800',
                duration: 3000
            })

        } catch {
            toast({
                title: 'Error al intentar eliminar empleado!',
                className: 'bg-red-800',
                duration: 3000
            })
        }


    }

    return (
        <Table>
            <TableHeader>
                {tableData.getHeaderGroups()
                    .map((headerGroup) => {
                        return (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={styles.tableHeaderItem}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {header.column.columnDef.header}
                                        {header.column.getIsSorted() === "asc" ? " 🔼" : header.column.getIsSorted() === "desc" ? " 🔽" : ""}
                                    </TableHead>
                                ))}
                                <TableHead
                                    key="actions"
                                    className={styles.tableHeaderItem}
                                >
                                    Acciones
                                </TableHead>
                            </TableRow>
                        );
                    })}
            </TableHeader>
            
            <TableBody className={styles.tableBody}>
                {tableData.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <TableCell key={cell.id} className={styles.tableBodyItem}>{cell.renderValue()}</TableCell>
                        ))}
                        <TableCell>
                            <div className={styles.btnContainer}>
                                <Button className={styles.editBtn}>
                                    <Link href={`/employees/${row.original.id}`}>
                                        <PencilIcon color='white' />
                                    </Link>
                                </Button>

                                <DialogWrapper
                                    triggerButton={<Button className={styles.deleteBtn}>
                                        <Trash2 color='white' />
                                    </Button>}
                                    title="Eliminar GPeer"
                                    description="Estás seguro de eliminar este empleado?"
                                    onConfirm={() => handleDelete(row.original.id)}
                                >

                                </DialogWrapper>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}

            </TableBody>
        </Table >
    )
}

export default EmployeesTable