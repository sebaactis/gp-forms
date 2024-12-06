import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React from "react";

export const TableComponent = ({ tableData, styles }) => {

    return (
            <Table className={styles.table}>
                <TableHeader className={styles.tableHeader}>
                    {tableData.getHeaderGroups().map((headerGroup) => {
                        return (
                            <React.Fragment key={headerGroup.id}>

                                <TableRow>
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
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
    )
}
