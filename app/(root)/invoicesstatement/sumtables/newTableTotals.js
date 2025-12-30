'use client'

import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { TbSortDescending, TbSortAscending } from "react-icons/tb"
import { usePathname } from 'next/navigation'
import '../../contracts/style.css'
import { getTtl } from "../../../../utils/languages"
import Tltip from "../../../../components/tlTip"
import { detailsToolTip } from "./sumTablesFuncs"

const Customtable = ({ data, columns, ln, ttl, settings, dataTable, rmrk }) => {

    const pathname = usePathname()

    const table1 = useReactTable({
        columns, data,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    let showAmount = (x, y) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: y,
            minimumFractionDigits: x === 0 ? 0 : 2
        }).format(x)
    }

    const calculateTotals = (currency) => {
        const filtered = data.filter(item => item.cur === currency)
        return {
            invoices: filtered.reduce((sum, item) => sum + (item.invAmount ?? 0) + (item.totalInvoices ?? 0), 0),
            payments: filtered.reduce((sum, item) => sum + (item.pmntAmount ?? 0) + (item.totalPmnts ?? 0), 0),
            balance: filtered.reduce((sum, item) => sum + (item.blnc ?? 0) + (item.inDebt ?? 0), 0)
        }
    }

    const usdTotals = calculateTotals("usd")
    const eurTotals = calculateTotals("eur")

    return (
        <div className={`flex flex-col relative w-full ${pathname === '/stocks' ? 'max-w-[700px]' : 'max-w-[520px]'}`}>
            <div className="border border-[var(--selago)] rounded-xl overflow-hidden">
                <div className="justify-between flex p-3 flex-wrap bg-gradient-to-r from-[var(--endeavour)] via-[var(--chathams-blue)] to-[var(--endeavour)] border-b border-[var(--selago)]">
                    <p className="text-white font-semibold">{getTtl(ttl, ln)}</p>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--rock-blue)]/50 divide-y divide-[var(--selago)]">
                            {table1.getHeaderGroups().map(hdGroup =>
                                <tr key={hdGroup.id} className='border-b border-[var(--selago)]'>
                                    {hdGroup.headers.map(header =>
                                        <th key={header.id} className="relative px-6 py-2 text-left text-sm font-medium text-[var(--port-gore)] uppercase">
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
                                <tr key={row.id} className='cursor-pointer hover:bg-[var(--selago)]/30'>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} data-label={cell.column.columnDef.header} className="table_cell text-xs md:py-3 items-center px-6">
                                            <Tltip direction='right' tltpText={detailsToolTip(row, data, settings, dataTable, rmrk)}>
                                                <span>
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
                                <th className="relative px-2 py-2 text-left text-[0.8rem] font-medium text-[var(--port-gore)] uppercase">
                                    Total $
                                </th>
                                <th className="relative px-2 py-2 text-left text-[0.8rem] font-medium text-[var(--port-gore)] uppercase">
                                    {showAmount(usdTotals.invoices, 'usd')}
                                </th>
                                <th className="relative px-2 py-2 text-left text-[0.8rem] font-medium text-[var(--port-gore)] uppercase">
                                    {showAmount(usdTotals.payments, 'usd')}
                                </th>
                                <th className="relative px-2 py-2 text-left text-[0.8rem] font-medium text-[var(--port-gore)] uppercase">
                                    {showAmount(usdTotals.balance, 'usd')}
                                </th>
                            </tr>
                            <tr className="border-t border-[var(--selago)] bg-[var(--rock-blue)]/50">
                                <th className="relative px-2 py-2 text-left text-[0.8rem] font-medium text-[var(--port-gore)] uppercase">
                                    Total €
                                </th>
                                <th className="relative px-2 py-2 text-left text-[0.8rem] font-medium text-[var(--port-gore)] uppercase">
                                    {showAmount(eurTotals.invoices, 'eur')}
                                </th>
                                <th className="relative px-2 py-2 text-left text-[0.8rem] font-medium text-[var(--port-gore)] uppercase">
                                    {showAmount(eurTotals.payments, 'eur')}
                                </th>
                                <th className="relative px-2 py-2 text-left text-[0.8rem] font-medium text-[var(--port-gore)] uppercase">
                                    {showAmount(eurTotals.balance, 'eur')}
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Mobile View - Card Layout */}
                <div className="md:hidden">
                    <div className="divide-y divide-[var(--selago)]">
                        {table1.getRowModel().rows.map(row => (
                            <div key={row.id} className="p-4 bg-white hover:bg-[var(--selago)]/30 transition-colors">
                                <Tltip direction='top' tltpText={detailsToolTip(row, data, settings, dataTable, rmrk)}>
                                    <div className="space-y-2.5">
                                        {row.getVisibleCells().map((cell) => (
                                            <div key={cell.id} className="flex justify-between items-start gap-4">
                                                <span className="text-[0.7rem] font-semibold text-[var(--port-gore)] uppercase tracking-wide flex-shrink-0 min-w-[100px]">
                                                    {cell.column.columnDef.header}
                                                </span>
                                                <span className="text-sm font-medium text-[var(--port-gore)] text-right break-words">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </Tltip>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Total Sections */}
                    <div className="bg-[var(--rock-blue)]/50 border-t-2 border-[var(--selago)]">
                        {/* USD Totals */}
                        <div className="p-4 border-b border-[var(--selago)]">
                            <div className="space-y-2.5">
                                <div className="pb-2 mb-2 border-b border-[var(--port-gore)]/20">
                                    <span className="text-sm font-bold text-[var(--port-gore)] uppercase tracking-wide">
                                        Total $ (USD)
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[0.7rem] font-semibold text-[var(--port-gore)] uppercase">
                                        {columns[1]?.header || 'Invoices'}
                                    </span>
                                    <span className="text-sm font-bold text-[var(--port-gore)]">
                                        {showAmount(usdTotals.invoices, 'usd')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[0.7rem] font-semibold text-[var(--port-gore)] uppercase">
                                        {columns[2]?.header || 'Payments'}
                                    </span>
                                    <span className="text-sm font-bold text-[var(--port-gore)]">
                                        {showAmount(usdTotals.payments, 'usd')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[0.7rem] font-semibold text-[var(--port-gore)] uppercase">
                                        {columns[3]?.header || 'Balance'}
                                    </span>
                                    <span className="text-sm font-bold text-[var(--port-gore)]">
                                        {showAmount(usdTotals.balance, 'usd')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* EUR Totals */}
                        <div className="p-4">
                            <div className="space-y-2.5">
                                <div className="pb-2 mb-2 border-b border-[var(--port-gore)]/20">
                                    <span className="text-sm font-bold text-[var(--port-gore)] uppercase tracking-wide">
                                        Total € (EUR)
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[0.7rem] font-semibold text-[var(--port-gore)] uppercase">
                                        {columns[1]?.header || 'Invoices'}
                                    </span>
                                    <span className="text-sm font-bold text-[var(--port-gore)]">
                                        {showAmount(eurTotals.invoices, 'eur')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[0.7rem] font-semibold text-[var(--port-gore)] uppercase">
                                        {columns[2]?.header || 'Payments'}
                                    </span>
                                    <span className="text-sm font-bold text-[var(--port-gore)]">
                                        {showAmount(eurTotals.payments, 'eur')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[0.7rem] font-semibold text-[var(--port-gore)] uppercase">
                                        {columns[3]?.header || 'Balance'}
                                    </span>
                                    <span className="text-sm font-bold text-[var(--port-gore)]">
                                        {showAmount(eurTotals.balance, 'eur')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Customtable;