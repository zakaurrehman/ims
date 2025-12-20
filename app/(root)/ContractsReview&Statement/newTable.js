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


    const [{ pageIndex, pageSize }, setPagination] = useState({ pageIndex: 0, pageSize: 500 })
    const pagination = useMemo(() => ({ pageIndex, pageSize, }), [pageIndex, pageSize])
    const pathName = usePathname()

    const [columnFilters, setColumnFilters] = useState([]) //Column filter

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
    }, [globalFilter])

    useEffect(() => {
        setFilteredData(table.getFilteredRowModel().rows.map(x => x.original))
    }, [columnFilters])


    const resetTable = () => {
        table.resetColumnFilters()
    }


    return (
        <div className="flex flex-col relative ">
            <div>
                <Header globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}
                    table={table} excellReport={excellReport} cb={cb}
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
                            {table.getHeaderGroups().map((hdGroup, i) =>
                                <Fragment key={hdGroup.id}>
                                    <tr className="cursor-pointer bg-[var(--rock-blue)]/50">
                                        {hdGroup.headers.map(
                                            header =>
                                                <th key={header.id} className="text-[var(--port-gore)] font-semibold table_cell py-2 text-xs text-left">
                                                    {header.column.columnDef.ttl}
                                                </th>
                                        )}
                                    </tr>
                                    <tr key={hdGroup.id + '-row'} className='bg-gradient-to-r from-[var(--endeavour)] via-[var(--chathams-blue)] to-[var(--endeavour)]'>
                                        {hdGroup.headers.map(
                                            header =>
                                                <th key={header.id + '-header'} className="relative px-6 py-3 text-left text-sm font-semibold text-white uppercase">
                                                    {header.column.getCanSort() ?

                                                        <div onClick={header.column.getToggleSortingHandler()} className="table-caption text-xs cursor-pointer items-center gap-1">
                                                            {header.column.columnDef.header}
                                                            {
                                                                {
                                                                    asc: <TbSortAscending className="text-white scale-125" />,
                                                                    desc: <TbSortDescending className="text-white scale-125" />
                                                                }[header.column.getIsSorted()]
                                                            }
                                                        </div>
                                                        :
                                                        <span className="text-xs table-caption">{header.column.columnDef.header}</span>
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
                        <tbody className="divide-y divide-[var(--selago)] bg-white">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className='cursor-pointer hover:bg-[var(--selago)]/50 transition-colors' onDoubleClick={() => SelectRow(row.original)}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} data-label={cell.column.columnDef.header} className={`table_cell text-xs text-[var(--port-gore)] ${pathName === '/invoices' ? 'md:py-1.5' : 'md:py-3'}`}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
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
