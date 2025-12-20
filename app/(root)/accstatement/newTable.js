'use client'

import Header from "../../../components/table/header";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { Fragment, useEffect, useMemo, useState } from "react"
import { TbSortDescending } from "react-icons/tb";
import { TbSortAscending } from "react-icons/tb";

import { Paginator } from "../../../components/table/Paginator";
import RowsIndicator from "../../../components/table/RowsIndicator";
import { usePathname } from "next/navigation";
import '../contracts/style.css';
import { getTtl } from "../../../utils/languages";
import { Filter } from '../../../components/table/filters/filterFunc'
import FiltersIcon from '../../../components/table/filters/filters';
import ResetFilterTableIcon from '../../../components/table/filters/resetTabe';
import dateBetweenFilterFn from '../../../components/table/filters/date-between-filter';


const Customtable = ({ data, columns, invisible, SelectRow, excellReport, cb, setFilteredData, ln }) => {

    const [globalFilter, setGlobalFilter] = useState('')
    const [columnVisibility, setColumnVisibility] = useState(invisible)
    const [filterOn, setFilterOn] = useState(false)
    const [columnFilters, setColumnFilters] = useState([]) //Column filter

    const [{ pageIndex, pageSize }, setPagination] = useState({ pageIndex: 0, pageSize: 500 })
    const pagination = useMemo(() => ({ pageIndex, pageSize, }), [pageIndex, pageSize])
    const pathName = usePathname()

    // Quick Sum state
    const [quickSumEnabled, setQuickSumEnabled] = useState(false);
    const [quickSumColumns, setQuickSumColumns] = useState([]);
    const [rowSelection, setRowSelection] = useState({});

    const columnsWithSelection = useMemo(() => {
        if (!quickSumEnabled) return columns;
        const selectCol = {
            id: "select",
            header: ({ table }) => (
                <input type="checkbox" checked={table.getIsAllPageRowsSelected()}
                    ref={(el) => { if (el) el.indeterminate = table.getIsSomePageRowsSelected(); }}
                    onChange={table.getToggleAllPageRowsSelectedHandler()} />
            ),
            cell: ({ row }) => (
                <input type="checkbox" checked={row.getIsSelected()} disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()} />
            ),
            enableSorting: false, enableColumnFilter: false, size: 40,
        };
        return [selectCol, ...(columns || [])];
    }, [columns, quickSumEnabled]);

    const table = useReactTable({
        columns: columnsWithSelection, data,
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
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
    })

    useEffect(() => {
        setFilteredData(table.getFilteredRowModel().rows.map(x => x.original))
    }, [globalFilter, columnFilters])


    const resetTable = () => {
        table.resetColumnFilters()
    }

    return (
        <div className="flex flex-col relative ">
            <div>
                <Header globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}
                    table={table} excellReport={excellReport} cb={cb} type='accstatement'
                    filterIcon={FiltersIcon(ln, filterOn, setFilterOn)}
                    resetFilterTable={ResetFilterTableIcon(ln, resetTable, filterOn)}
                    quickSumEnabled={quickSumEnabled}
                    setQuickSumEnabled={setQuickSumEnabled}
                    quickSumColumns={quickSumColumns}
                    setQuickSumColumns={setQuickSumColumns}
                />

                <div className=" overflow-x-auto border-x border-[var(--selago)]">
                    <table className="w-full">
                        <thead className="divide-y divide-[var(--selago)]">
                            {table.getHeaderGroups().map((hdGroup, i) =>
                                <Fragment key={hdGroup.id}>
                                    <tr className="cursor-pointer bg-[var(--rock-blue)]/50">
                                        {hdGroup.headers.map(
                                            header =>
                                                <th key={header.id} className="text-[var(--port-gore)] font-medium table_cell text-xs py-1.5 text-left">
                                                    {header.column.columnDef.ttlUS}
                                                </th>
                                        )}
                                    </tr>
                                    <tr className="cursor-pointer bg-[var(--rock-blue)]/50">
                                        {hdGroup.headers.map(
                                            header =>
                                                <th key={header.id} className="text-[var(--port-gore)] font-medium table_cell text-xs py-1.5 text-left">
                                                    {header.column.columnDef.ttlEU}
                                                </th>
                                        )}
                                    </tr>
                                    <tr key={hdGroup.id + '-row'} className='border-b border-[var(--selago)] bg-gradient-to-r from-[var(--endeavour)] via-[var(--chathams-blue)] to-[var(--endeavour)]'>
                                        {hdGroup.headers.map(
                                            header =>
                                                <th key={header.id + '-header'} className={`relative px-6 py-2 text-left text-sm font-medium uppercase
                                     border-b border-[var(--selago)]`}>
                                                    {header.column.getCanSort() ?

                                                        <div onClick={header.column.getToggleSortingHandler()}
                                                            className='table-caption cursor-pointer items-center gap-1 text-white text-xs'>
                                                            {header.column.columnDef.header}
                                                            {
                                                                {
                                                                    asc: <TbSortAscending className="text-white scale-125" />,
                                                                    desc: <TbSortDescending className="text-white scale-125" />
                                                                }[header.column.getIsSorted()]
                                                            }
                                                        </div>
                                                        :
                                                        <span className="text-white table-caption">{header.column.columnDef.header}</span>
                                                    }
                                                    {header.column.getCanFilter() ? (
                                                        <div>
                                                            <Filter column={header.column} table={table} filterOn={filterOn} />
                                                        </div>
                                                    ) : null}
                                                </th>
                                        )}
                                    </tr>
                                </Fragment>
                            )}
                        </thead>
                        <tbody className="divide-y divide-[var(--selago)]">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className='cursor-pointer hover:bg-[var(--selago)]/30'>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} data-label={cell.column.columnDef.header} className={`table_cell text-xs md:py-3 
                                            ${(cell.getValue() > 5 && cell.column.columnDef.accessorKey === 'notPaid') ? 'text-red-700 font-semibold' : ''}`}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex p-2 border-t flex-wrap bg-[var(--selago)]/50 border border-[var(--selago)] rounded-b-xl">
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
