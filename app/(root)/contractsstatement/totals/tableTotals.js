'use client'

import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"

import { TbSortDescending } from "react-icons/tb";
import { TbSortAscending } from "react-icons/tb";
import { usePathname } from 'next/navigation'
import '../../contracts/style.css';
import { getTtl } from "../../../../utils/languages";
import Tltip from "../../../../components/tlTip";
import { expensesToolTip } from "./funcs";

const Customtable = ({ data, columns, expensesData, settings }) => {

    const pathname = usePathname()

    const table1 = useReactTable({
        columns, data,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),

    })

    let showAmount = (x) => {

        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 3
        }).format(x)
    }

    return (
        <div className={`flex flex-col relative max-w-[540px]`}>
            <div className="border border-[var(--selago)] rounded-xl">
                <div className="justify-between flex p-2 flex-wrap bg-gradient-to-r from-[var(--endeavour)] via-[var(--chathams-blue)] to-[var(--endeavour)] rounded-t-xl border-b border-[var(--selago)]">
                    <p className="text-white font-semibold">Summary</p>
                </div>
                {/* Desktop Table */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="w-full">
                        <thead className="bg-[var(--rock-blue)]/50 divide-y divide-[var(--selago)]">
                            {table1.getHeaderGroups().map(hdGroup =>
                                <tr key={hdGroup.id} className='border-b border-[var(--selago)]'>
                                    {hdGroup.headers.map(
                                        header =>
                                            <th key={header.id} className="relative px-6 py-2 text-left text-sm font-medium text-[var(--port-gore)] uppercase w-10">
                                                {header.column.getCanSort() ?
                                                    <div onClick={header.column.getToggleSortingHandler()} className="text-xs flex cursor-pointer items-center gap-1">
                                                        {header.column.columnDef.header}
                                                        {
                                                            {
                                                                asc: <TbSortAscending className="text-[var(--endeavour)] scale-125" />,
                                                                desc: <TbSortDescending className="text-[var(--endeavour)] scale-125" />
                                                            }[header.column.getIsSorted()]
                                                        }
                                                    </div>
                                                    :
                                                    <span className="text-xs">{header.column.columnDef.header}</span>
                                                }
                                            </th>
                                    )}
                                </tr>)}
                        </thead>
                        <tbody className="divide-y divide-[var(--selago)]">
                            {table1.getRowModel().rows.map(row => (
                                <tr key={row.id} className='cursor-pointer'>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} data-label={cell.column.columnDef.header} className={`table_cell text-xs md:py-3 items-center `}>
                                            <Tltip direction='right' tltpText={expensesToolTip(row, expensesData, settings)}>
                                                <span className="text-[0.8rem] items-center flex w-20 outline-none truncate cursor-default">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </span>
                                            </Tltip>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t border-[var(--selago)] bg-[var(--rock-blue)]/50">
                                <th className="relative px-2 py-2 text-left text-[0.8rem] font-medium text-[var(--port-gore)] uppercase">Total</th>
                                <th className="relative px-2 py-2 text-left text-[0.8rem] font-medium text-[var(--port-gore)] uppercase">{showAmount(data.reduce((sum, item) => sum + item.poWeight * 1, 0))}</th>
                                <th className="relative px-2 py-2 text-left text-[0.8rem] font-medium text-[var(--port-gore)] uppercase">{showAmount(data.reduce((sum, item) => sum + item.shiipedWeight * 1, 0))}</th>
                                <th className="relative px-2 py-2 text-left text-[0.8rem] font-medium text-[var(--port-gore)] uppercase">{showAmount(data.reduce((sum, item) => sum + item.remaining * 1, 0))}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                {/* Mobile Card View */}
                <div className="block md:hidden p-2">
                    {table1.getRowModel().rows.map(row => (
                        <div key={row.id} className="mb-3 rounded-lg border border-[var(--selago)] bg-white shadow-sm p-3">
                            {row.getVisibleCells().map(cell => (
                                <div key={cell.id} className="flex justify-between items-center py-1">
                                    <span className="font-semibold text-[var(--port-gore)] text-xs uppercase pr-2">
                                        {cell.column.columnDef.header}
                                    </span>
                                    <Tltip direction='right' tltpText={expensesToolTip(row, expensesData, settings)}>
                                        <span className="text-[0.9rem] text-right min-w-[80px]">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </span>
                                    </Tltip>
                                </div>
                            ))}
                        </div>
                    ))}
                    {/* Mobile Total Row */}
                    <div className="rounded-lg border-t border-[var(--selago)] bg-[var(--rock-blue)]/30 px-3 py-2 flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-[var(--port-gore)] text-xs uppercase">Total Quantity</span>
                            <span className="font-semibold text-[var(--port-gore)] text-xs">{showAmount(data.reduce((sum, item) => sum + item.poWeight * 1, 0))}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-[var(--port-gore)] text-xs uppercase">Total Shipped</span>
                            <span className="font-semibold text-[var(--port-gore)] text-xs">{showAmount(data.reduce((sum, item) => sum + item.shiipedWeight * 1, 0))}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-[var(--port-gore)] text-xs uppercase">Total Remaining</span>
                            <span className="font-semibold text-[var(--port-gore)] text-xs">{showAmount(data.reduce((sum, item) => sum + item.remaining * 1, 0))}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Customtable;
