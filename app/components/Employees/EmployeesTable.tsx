import { Button } from '@/components/ui/button'
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { EmployeeWithRelations } from '@/types'
import React from 'react'
import { PencilIcon, Trash2 } from "lucide-react"

interface Props {
    tableData: EmployeeWithRelations[]
    styles: Record<string, string>
}
const EmployeesTable = ({ tableData, styles }: Props) => {
    return (
        <Table>
            <TableHeader>
                {tableData.getHeaderGroups().map((headerGroup) => {
                    return (
                        <React.Fragment key={headerGroup.id}>
                            <TableRow>
                                {headerGroup.headers.map((header) => (
                                    <>
                                        <TableHead
                                            key={header.id}
                                            className={styles.tableHeaderItem}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {header.column.columnDef.header}
                                            {header.column.getIsSorted() === "asc" ? " 🔼" : header.column.getIsSorted() === "desc" ? " 🔽" : ""}
                                        </TableHead>
                                    </>
                                ))}
                                <TableHead
                                    className={styles.tableHeaderItem}
                                >
                                    Acciones
                                </TableHead>
                            </TableRow>

                        </React.Fragment>
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
                            <div>
                                <Button>
                                    <PencilIcon />
                                </Button>
                                <Button>
                                    <Trash2 />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}

            </TableBody>
        </Table>
    )
}

export default EmployeesTable