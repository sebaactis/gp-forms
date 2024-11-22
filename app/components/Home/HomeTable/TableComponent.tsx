import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export const TableComponent = ({ tableData, styles }) => {

    return (
        <Table className={styles.table}>
            <TableHeader className={styles.tableHeader}>

                {tableData.getHeaderGroups().map(headerGroup => (
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
                                            value={(tableData.getState().columnFilters.find(filter => filter.id === header.id)?.value) ?? ""}
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
