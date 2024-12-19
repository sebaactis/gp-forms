import { useState } from "react"
import { Search } from "lucide-react"

export const TableFilters = ({ headers, styles }) => {

    const [selectedHeader, setSelectedHeader] = useState<string | null>(null)
    const [filterValue, setFilterValue] = useState<string>("")

    const handleFilterChange = (headerId: string | null, value: string) => {
        const header = headers.find(header => header.id === headerId)
        
        if (header) {
            header.column.setFilterValue(value)
            setFilterValue(value);
        }
    }

    return (
        <div className={styles.filterContainer}>
            <select
                value={selectedHeader ?? ""}
                onChange={(e) => {
                    setSelectedHeader(e.target.value);
                    setFilterValue("")
                }}
                className={styles.filterSelect}
            >
                <option value="" disabled> Seleccion una columna</option>
                {headers.map(header => (
                    <option key={header.id} value={header.id}>
                        {header.column.columnDef.header}
                    </option>
                ))}
            </select>

            {selectedHeader !== "" && (
                <div className={styles.inputWrapper}>
                <input
                    type="text"
                    value={filterValue}
                    onChange={(e) => handleFilterChange(selectedHeader, e.target.value)}
                    placeholder="Buscar..."
                    className={styles.filterInput}
                />
                <Search className={styles.searchIcon} />
            </div>
            )}
        </div>
    )
}