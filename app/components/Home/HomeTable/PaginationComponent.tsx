import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select"
import { ArrowBigRight, ArrowBigLeft } from "lucide-react"

export const PaginationComponent = ({ tableData, styles }) => {
    return (
        <div className={styles.pagination}>

            <Button className={styles.paginationBtn} onClick={() => tableData.setPageIndex(0)}>Primer Pagina</Button>
            <Button className={styles.paginationBtn} onClick={() => tableData.previousPage()} disabled={!tableData.getCanPreviousPage()}>
                <ArrowBigLeft />
            </Button>
            <Select
                value={String(tableData.getState().pagination.pageIndex)}
                onValueChange={(value) => tableData.setPageIndex(Number(value))}

            >
                <SelectTrigger className={styles.pageSelect}>
                    <SelectValue placeholder={`Página ${tableData.getState().pagination.pageIndex + 1}`} />
                </SelectTrigger>

                <SelectContent>
                    {Array.from({ length: tableData.getPageCount() }).map((_, index) => (
                        <SelectItem key={index} value={String(index)}>
                            {index + 1}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button className={styles.paginationBtn} onClick={() => tableData.nextPage()} disabled={!tableData.getCanNextPage()}><ArrowBigRight />
            </Button>
            <Button className={styles.paginationBtn} onClick={() => tableData.setPageIndex(tableData.getPageCount() - 1)}>Ultima Pagina</Button>



        </div>
    )
}

export default PaginationComponent