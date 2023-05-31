import './App.css'
import tableData from './data/response_Mock.json'
import * as React from 'react'
import { useTable } from 'react-table'

const App = () => {
  const data = React.useMemo(() => tableData, [])
  const columns = React.useMemo(
    () => [
      {
        Header: 'Account',
        accessor: 'account'
      },
      {
        Header: 'Security',
        accessor: 'security'
      },
      {
        Header: 'Loan',
        accessor: 'loan'
      },
      {
        Header: 'Pool Number',
        accessor: 'pool_number'
      },
      {
        Header: 'State Code',
        accessor: 'state_code'
      },
      {
        Header: 'FFIEC County Name',
        accessor: 'ffiec_county_name'
      },
      {
        Header: 'Census Tract',
        accessor: 'census_tract'
      },
      {
        Header: 'Loan Amount',
        accessor: 'loan_amount'
      },
      {
        Header: 'Difficult Development Area',
        accessor: 'difficult_development_area'
      },
      {
        Header: 'Rural Census Tract and MSA',
        accessor: 'rural_census_tract_and_msa'
      }
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data })

  return (
    <div className="App">
      <div className="table-container">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
