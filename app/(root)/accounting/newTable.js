'use client'

import Header from "../../../components/table/header";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { useMemo, useState } from "react"

import { Paginator } from "../../../components/table/Paginator";
import RowsIndicator from "../../../components/table/RowsIndicator";
import '../contracts/style.css';
import { useContext } from 'react';
import { SettingsContext } from "../../../contexts/useSettingsContext";
import { getTtl } from "../../../utils/languages";
import { Filter } from '../../../components/table/filters/filterFunc'
import FiltersIcon from '../../../components/table/filters/filters';
import ResetFilterTableIcon from '../../../components/table/filters/resetTabe';
import dateBetweenFilterFn from '../../../components/table/filters/date-between-filter';

const Customtable = ({ data, columns, invisible, excellReport }) => {



    const [globalFilter, setGlobalFilter] = useState('')
    const [columnVisibility, setColumnVisibility] = useState(invisible)
    const [filterOn, setFilterOn] = useState(false)

    const [{ pageIndex, pageSize }, setPagination] = useState({ pageIndex: 0, pageSize: 500 })
    const pagination = useMemo(() => ({ pageIndex, pageSize, }), [pageIndex, pageSize])
    const [columnFilters, setColumnFilters] = useState([]) //Column filter

    const [quickSumEnabled, setQuickSumEnabled] = useState(false);
    const [quickSumColumns, setQuickSumColumns] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

    const { ln } = useContext(SettingsContext);

  const columnsWithSelection = useMemo(() => {
    if (!quickSumEnabled) return columns;

    const selectCol = {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          ref={(el) => {
            if (!el) return;
            el.indeterminate = table.getIsSomePageRowsSelected();
          }}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 40,
    };

    return [selectCol, ...(columns || [])];
  }, [columns, quickSumEnabled]);

    const table = useReactTable({
        columns:columnsWithSelection, data,
        enableRowSelection: quickSumEnabled,
        getCoreRowModel: getCoreRowModel(),
        filterFns: {
            dateBetweenFilterFn,
        },
        state: {
            globalFilter,
            columnVisibility,
            pagination,
            columnFilters,
            rowSelection,
        },
        onRowSelectionChange: setRowSelection,
        onColumnFiltersChange: setColumnFilters, ////Column filter
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
    })

    const resetTable = () => {
        table.resetColumnFilters()
    }


    return (
        <div className="flex flex-col relative ">
            <div >
                <Header globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}
                    table={table} excellReport={excellReport}
                    filterIcon={FiltersIcon(ln, filterOn, setFilterOn)}
                    resetFilterTable={ResetFilterTableIcon(ln, resetTable, filterOn)}
                    quickSumEnabled={quickSumEnabled}
                    setQuickSumEnabled={setQuickSumEnabled}
                    quickSumColumns={quickSumColumns}
                    setQuickSumColumns={setQuickSumColumns}
                />

                <div className="overflow-x-auto border-x border-[var(--selago)] md:max-h-[400px] 2xl:max-h-[550px]">
                    <table className="w-full">
                        <thead className="md:sticky md:top-0 md:z-10">
                            {table.getHeaderGroups().map(hdGroup =>
                                <tr key={hdGroup.id} className='bg-gradient-to-r from-[var(--endeavour)] via-[var(--chathams-blue)] to-[var(--endeavour)]'>
                                    {hdGroup.headers.map(
                                        header =>
                                            <th key={header.id} className={`relative px-6 py-3 text-left text-xs font-semibold text-white uppercase`}>
                                                <span className="table-caption">{header.column.columnDef.header}</span>
                                                {header.column.getCanFilter() ? (
                                                    <div>
                                                        <Filter column={header.column} table={table} filterOn={filterOn} />
                                                    </div>
                                                ) : null}
                                            </th>
                                    )}
                                </tr>)}
                        </thead>
                        <tbody className="border-r border-[var(--selago)] bg-white">
                            {table.getRowModel().rows.map((row, rowIndex) => {
                                let bottomRow = table.getRowModel().rows[rowIndex]?.original.invoice * 1 !== table.getRowModel().rows[rowIndex + 1]?.original.invoice * 1

                                return (
                                    <tr key={row.id} className={`
                                    ${bottomRow ? 'border-b border-[var(--rock-blue)]' : 'border-b border-[var(--selago)]'}
                                    hover:bg-[var(--selago)]/50 transition-colors
                                    `}>
                                        {row.getVisibleCells().map(cell => {
                                            let hideTD = !row.original.span && cell.column?.id === 'num';
                                            let brdr = cell.column?.id === 'num' && row.original?.span;

                                            return (

                                                !hideTD &&
                                                <td rowSpan={cell.column?.id === 'num' && row.original?.span ? row.original.span : null}
                                                    key={cell.id} data-label={cell.column.columnDef.header}
                                                    className={`table_cell text-xs md:py-2 text-[var(--port-gore)] ${brdr ? 'border border-[var(--rock-blue)] bg-[var(--selago)]/30' : ''}`}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>

                                            )


                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="flex p-2 border-t border-[var(--selago)] flex-wrap bg-[var(--selago)]/50 rounded-b-xl">
                    <div className="hidden lg:flex text-[var(--port-gore)] text-sm w-48 xl:w-96 p-2 items-center">
                        {`${getTtl('Showing', ln)} ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                            (table.getFilteredRowModel().rows.length ? 1 : 0)}-${table.getRowModel().rows.length + table.getState().pagination.pageIndex * table.getState().pagination.pageSize}
                            ${getTtl('of', ln)} ${table.getFilteredRowModel().rows.length}`}
                    </div>
                    <Paginator table={table} />
                    <RowsIndicator table={table} />
                </div>
            </div>
        </div>
    )
}


export default Customtable;
