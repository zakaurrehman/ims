'use client'

import Header from "../../../components/table/header";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { Fragment, useEffect, useMemo, useState } from "react"
import { TbSortDescending } from "react-icons/tb";
import { TbSortAscending } from "react-icons/tb";

import { Paginator } from "../../../components/table/Paginator";
import RowsIndicator from "../../../components/table/RowsIndicator";
import '../contracts/style.css';
import { useContext } from 'react';
import { SettingsContext } from "../../../contexts/useSettingsContext";
import { usePathname } from "next/navigation";
import { getTtl } from "../../../utils/languages";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../..//components/ui/tooltip"
import Tltip from "../../../components/tlTip";
import FiltersIcon from '../../../components/table/filters/filters';
import ResetFilterTableIcon from '../../../components/table/filters/resetTabe';
import dateBetweenFilterFn from '../../../components/table/filters/date-between-filter';
import { Filter } from "../../../components/table/filters/filterFunc";


const Customtable = ({ data, columns, invisible, SelectRow, excellReport, setFilteredData }) => {



    const [globalFilter, setGlobalFilter] = useState('')
    const [columnVisibility, setColumnVisibility] = useState(invisible)
    const [filterOn, setFilterOn] = useState(false)


    const [{ pageIndex, pageSize }, setPagination] = useState({ pageIndex: 0, pageSize: 500, })
    const pagination = useMemo(() => ({ pageIndex, pageSize, }), [pageIndex, pageSize])
    const pathName = usePathname()
    const { ln } = useContext(SettingsContext);

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

    const resetTable = () => {
        table.resetColumnFilters()
    }

    useEffect(() => {
        resetTable()
    }, [])


    useEffect(() => {
        setFilteredData(table.getFilteredRowModel().rows.map(x => x.original))
    }, [columnFilters, globalFilter])


    let showAmount = (val, cur) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: cur,
            minimumFractionDigits: 2
        }).format(val)
    }

    let showAmount1 = (val) => {
        return new Intl.NumberFormat('en-US', {
            //    style: 'currency',
            //    currency: cur,
            minimumFractionDigits: 2
        }).format(val)
    }

    let totalUSD = showAmount(table.getFilteredRowModel().rows.map(x => x.original).reduce((sum, row) => {
        const value = row.cur === 'us' ? row.total : 0
        return sum + (value * 1 || 0)
    }, 0), 'usd')

    let totalEUR = showAmount(table.getFilteredRowModel().rows.map(x => x.original).reduce((sum, row) => {
        const value = row.cur === 'eu' ? row.total : 0
        return sum + (value * 1 || 0)
    }, 0), 'eur')

    let qntyUSD = showAmount1(table.getFilteredRowModel().rows.map(x => x.original).reduce((sum, row) => {
        const value = row.cur === 'us' ? row.qnty : 0
        return sum + (value * 1 || 0)
    }, 0).toFixed(2))

    let qntyEur = showAmount1(table.getFilteredRowModel().rows.map(x => x.original).reduce((sum, row) => {
        const value = row.cur === 'eu' ? row.qnty : 0
        return sum + (value * 1 || 0)
    }, 0).toFixed(2))

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

                <div className=" overflow-x-auto border-x border-[var(--selago)] md:max-h-[310px] 2xl:max-h-[550px]">
                    <table className="w-full">
                        <thead className="md:sticky md:top-0 md:z-10">
                            {table.getHeaderGroups().map(hdGroup =>
                                <Fragment key={hdGroup.id}>
                                    <tr className="cursor-pointer bg-[var(--rock-blue)]/50">
                                        {hdGroup.headers.map(
                                            header => {
                                                return (
                                                    <th key={header.id} className="text-[var(--port-gore)] font-medium table_cell text-xs py-1.5 text-left">
                                                        {header.id === 'compName' ? 'Total $:' :
                                                            header.id === 'total' ? totalUSD :
                                                                header.id === 'qnty' ? qntyUSD * 1 === 0 ? '0' : qntyUSD : ''}
                                                    </th>
                                                )
                                            }

                                        )}
                                    </tr>
                                    <tr className="cursor-pointer bg-[var(--rock-blue)]/50">
                                        {hdGroup.headers.map(
                                            header =>
                                                <th key={header.id} className="text-[var(--port-gore)] font-medium table_cell text-xs py-1.5 text-left">
                                                    {header.id === 'compName' ? 'Total €:' :
                                                        header.id === 'total' ? totalEUR :
                                                            header.id === 'qnty' ? qntyEur * 1 === 0 ? '0' : qntyEur : ''}
                                                </th>
                                        )}
                                    </tr>
                                    <tr key={hdGroup.id} className='bg-gradient-to-r from-[var(--endeavour)] via-[var(--chathams-blue)] to-[var(--endeavour)]'>
                                        {hdGroup.headers.map(
                                            header =>
                                                <th key={header.id} className="relative px-6 py-3 text-left text-sm font-semibold text-white uppercase">
                                                    {header.column.getCanSort() ?
                                                        <div onClick={header.column.getToggleSortingHandler()} className="table-caption cursor-pointer items-center gap-1 text-xs
                                                    font-semibold">
                                                            {/* <Tltip direction='top' tltpText='sdsd ffgf'> */}
                                                            {header.column.columnDef.header}
                                                            {/* </Tltip> */}

                                                            {
                                                                {
                                                                    asc: <TbSortAscending className="text-white scale-125" />,
                                                                    desc: <TbSortDescending className="text-white scale-125" />
                                                                }[header.column.getIsSorted()]
                                                            }
                                                        </div>
                                                        :
                                                        <span className="text-xs py-1 font-medium text-white">{header.column.columnDef.header}</span>
                                                    }
                                                    {header.column.getCanFilter() ? (
                                                        <div>
                                                            <Filter column={header.column} table={table} filterOn={filterOn} />
                                                        </div>
                                                    ) : null}
                                                </th>
                                        )}
                                    </tr>
                                </Fragment>)}
                        </thead>
                        <tbody className="divide-y divide-[var(--selago)]">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className='cursor-pointer hover:bg-[var(--selago)]/50 transition-colors' onDoubleClick={() => SelectRow(row.original)}>

                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} data-label={cell.column.columnDef.header} className={`table_cell text-xs ${pathName === '/invoices' ? 'md:py-1.5' : 'md:py-3'}`}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex p-2.5 border-t border-[var(--selago)] flex-wrap bg-white rounded-b-2xl">
                    <div className="hidden lg:flex text-gray-600 text-sm w-48 xl:w-96 p-2 items-center">
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
