import './App.css'
import tableData from './data/response_Mock.json'
import * as React from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import {
  TiArrowSortedUp,
  TiArrowSortedDown,
  TiArrowUnsorted
} from 'react-icons/ti'

const renderValue = (value) => {
  if (value === null || value === '') {
    return 'N/A'
  } else if (typeof value === 'boolean') {
    return (
      <input
        type="checkbox"
        checked={value}
        readOnly
        className="custom-checkbox"
      />
    )
  } else {
    return value
  }
}

const App = () => {
  const [expandedRows, setExpandedRows] = React.useState([])
  const data = React.useMemo(() => tableData, [])

  const dataKeys = Object.keys(data[0])

  const mainColumns = React.useMemo(
    () => dataKeys.slice(0, 10).map((key) => ({ Header: key, accessor: key })),
    []
  )

  const expandedColumns = React.useMemo(
    () => dataKeys.slice(10).map((key) => ({ Header: key, accessor: key })),
    []
  )

  const toggleRowExpansion = (rowIndex) => {
    setExpandedRows((prevExpandedRows) => {
      if (prevExpandedRows.includes(rowIndex)) {
        return prevExpandedRows.filter((row) => row !== rowIndex)
      } else {
        return [...prevExpandedRows, rowIndex]
      }
    })
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter
  } = useTable({ columns: mainColumns, data }, useGlobalFilter, useSortBy)

  const { globalFilter } = state

  return (
    <div className="App">
      <div>
        <input
          type="text"
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="search"
        />
      </div>
      <div className="table-container">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <div className="header-content">
                      <span>{column.render('Header')}</span>
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <TiArrowSortedDown size={20} />
                          ) : (
                            <TiArrowSortedUp size={20} />
                          )
                        ) : (
                          <TiArrowUnsorted size={20} />
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              const isRowExpanded = expandedRows.includes(row.index)

              return (
                <>
                  <tr
                    {...row.getRowProps()}
                    onClick={() => toggleRowExpansion(row.index)}
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>
                        {renderValue(cell.value)}
                      </td>
                    ))}
                  </tr>
                  {isRowExpanded && (
                    <tr className="expanded-row">
                      <td colSpan={expandedColumns.length + 1}>
                        <div className="expanded-container">
                          <table>
                            <tbody>
                              <tr>
                                {expandedColumns.map((column, columnIndex) => (
                                  <th key={columnIndex}>{column.Header}</th>
                                ))}
                              </tr>
                              <tr>
                                {expandedColumns.map((column, columnIndex) => (
                                  <td key={columnIndex}>
                                    {renderValue(row.original[column.accessor])}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
