import './App.css'
import 'aos/dist/aos.css'
import Aos from 'aos'
import mockData from './data/response_Mock.json'
import React, { useEffect, useMemo, useState } from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import { renderValue } from './utilities/tableFunctions'
import {
  TiArrowSortedUp,
  TiArrowSortedDown,
  TiArrowUnsorted
} from 'react-icons/ti'

const App = () => {
  const [tableData, setTableData] = useState([])
  const [expandedRows, setExpandedRows] = useState([])
  const data = useMemo(() => tableData, [tableData])

  useEffect(() => {
    Aos.init({ duration: 1000 })
  }, [])

  useEffect(() => {
    const getAllTableData = () => {
      setTableData(mockData)
    }
    getAllTableData()
  }, [])

  const dataKeys = useMemo(() => Object.keys(data[0] || {}), [data])

  const mainColumns = useMemo(
    () => dataKeys.slice(0, 10).map((key) => ({ Header: key, accessor: key })),
    [dataKeys]
  )

  const expandedColumns = useMemo(
    () => dataKeys.slice(10).map((key) => ({ Header: key, accessor: key })),
    [dataKeys]
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

  const downloadCSV = () => {
    const csvData = [
      dataKeys,
      ...tableData.map((row) => dataKeys.map((key) => row[key]))
    ]

    const csvContent = `data:text/csv;charset=utf-8,${csvData
      .map((row) => row.join(','))
      .join('\n')}`

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'data.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
    <div data-aos="zoom-in" className="App">
      <h1>Community Capital Management</h1>
      <div className="search-container">
        <input
          type="text"
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="search"
        />
      </div>
      <div data-aos="zoom-in" className="table-container">
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
      <button onClick={downloadCSV}>Download CSV</button>
      <p>Applicant: Jason Martinez</p>
    </div>
  )
}

export default App
