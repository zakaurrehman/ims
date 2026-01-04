'use client'

import Header from "../../../components/table/header";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { useMemo, useState } from "react"
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
//import FiltersIcon from '../../../components/table/filters/filters';
//import ResetFilterTableIcon from '../../../components/table/filters/resetTabe';
//import dateBetweenFilterFn from '../../../components/table/filters/date-between-filter';
import { Filter } from "../../../components/table/filters/filterFunc";
import { MdDeleteOutline } from "react-icons/md";

const Customtable = ({ data, columns }) => {



    const [globalFilter, setGlobalFilter] = useState('')
    const [filterOn, setFilterOn] = useState(false)


    const [{ pageIndex, pageSize }, setPagination] = useState({ pageIndex: 0, pageSize: 500, })
    const pagination = useMemo(() => ({ pageIndex, pageSize, }), [pageIndex, pageSize])
    const pathName = usePathname()
    const { ln } = useContext(SettingsContext);

    const [columnFilters, setColumnFilters] = useState([]) //Column filter

    const table = useReactTable({
        columns, data,
        getCoreRowModel: getCoreRowModel(),
        filterFns: {
            //   dateBetweenFilterFn,
        },
        state: {
            globalFilter,
            pagination,
            columnFilters
        },
        onColumnFiltersChange: setColumnFilters, ////Column filter
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
    })

    return (
        <div className="flex flex-col relative pt-7">
            <div>
                <div className="overflow-x-auto border-x border-[var(--selago)] md:max-h-[310px] 2xl:max-h-[550px]">
                    <table className="table-cell-uniform w-full min-w-[600px] sm:table hidden">
                        <thead className="divide-y divide-[var(--selago)] md:sticky md:top-0 md:z-10 ">
                            {table.getHeaderGroups().map(hdGroup => (
                                <tr key={hdGroup.id} className="bg-gradient-to-r from-[var(--endeavour)] via-[var(--chathams-blue)] to-[var(--endeavour)]">
                                    {hdGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className={`relative px-2 py-2 text-white text-xs font-bold text-center whitespace-nowrap ${header.id === 'material' ? 'min-w-[120px] max-w-[200px]' : 'min-w-[60px] max-w-[90px]'}`}
                                            scope="col"
                                        >
                                            {header.column.columnDef.header}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-[var(--selago)] ">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="cursor-pointer hover:bg-[var(--selago)]/30">
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            data-label={cell.column.columnDef.header}
                                            className={`table_cell text-sm text-center p-1 min-w-[60px] max-w-[90px] ${cell.column.id === 'material' ? 'min-w-[120px] max-w-[200px] bg-[#FFFFFF]' : 'bg-[var(--rock-blue)]/50'} font-bold`}
                                        >
                                            {cell.column.id !== 'del' ? (
                                                <div
                                                    className={`indent-0 input h-8 border-none text-[var(--port-gore)] font-bold items-center text-sm flex justify-center w-full min-w-0 ${cell.column.id === 'material' ? 'bg-[#FFFFFF]' : ''}`}
                                                >
                                                    {cell.column.id !== 'material'
                                                        ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(cell.getContext().getValue())
                                                        : ''}
                                                </div>
                                            ) : ''}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Mobile stacked table */}
                    <div className="sm:hidden flex flex-col gap-4">
                        {table.getRowModel().rows.map(row => (
                            <div key={row.id} className="rounded-lg border border-[var(--selago)] bg-white p-2 flex flex-col shadow-sm">
                                {row.getVisibleCells().map(cell => (
                                    <div key={cell.id} className="flex justify-between items-center py-1 border-b last:border-b-0">
                                        <span className="font-semibold text-xs text-[var(--port-gore)]">{cell.column.columnDef.header}</span>
                                        <span className="text-sm font-bold text-right break-all">
                                            {cell.column.id !== 'del'
                                                ? (cell.column.id !== 'material'
                                                    ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(cell.getContext().getValue())
                                                    : cell.getContext().getValue())
                                                : ''}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Customtable;
