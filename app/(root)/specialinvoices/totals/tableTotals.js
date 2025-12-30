// 'use client'

// import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"

// import { TbSortDescending } from "react-icons/tb";
// import { TbSortAscending } from "react-icons/tb";
// import { usePathname } from 'next/navigation'
// import '../../contracts/style.css';
// import Tltip from "../../../../components/tlTip";
// import { expensesToolTip } from "./funcs";

// const Customtable = ({ data, columns, expensesData, settings, title, filt, heading }) => {


//     const table1 = useReactTable({
//         columns, data,
//         getCoreRowModel: getCoreRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         getSortedRowModel: getSortedRowModel(),

//     })

//     let showAmount = (x, y) => {
//         return new Intl.NumberFormat('en-US', {
//             style: 'currency',
//             currency: y,
//             minimumFractionDigits: 2
//         }).format(x)
//     }

//     return (
//         <div className="w-full max-w-full flex flex-col items-stretch">
//             {title && (
//                 <div className="text-2xl font-bold text-[#1a3353] mb-3 pl-1 pt-2">
//                     {title}
//                 </div>
//             )}
//             <div className="bg-white rounded-xl shadow-lg border border-[#e3eafc] p-4 mb-6 min-w-[320px] flex flex-col">
//                 {heading && (
//                     <div className="text-lg font-semibold text-[#1a3353] mb-4 pl-1 pt-1">
//                         {heading}
//                     </div>
//                 )}
//                 <div className="overflow-x-auto">
//                     <table className="w-full border-separate border-spacing-0">
//                     <thead>
//                         {table1.getHeaderGroups().map(hdGroup => (
//                             <tr key={hdGroup.id}>
//                                 {hdGroup.headers.map(header => (
//                                     <th key={header.id} className="relative px-4 py-3 text-left text-base font-bold text-white bg-[#0070b8] uppercase border-b border-[#005a99]">
//                                         {header.column.getCanSort() ? (
//                                             <div onClick={header.column.getToggleSortingHandler()} className="text-xs flex cursor-pointer items-center gap-1">
//                                                 {header.column.columnDef.header}
//                                                 {{
//                                                     asc: <TbSortAscending className="text-white scale-125" />, 
//                                                     desc: <TbSortDescending className="text-white scale-125" />
//                                                 }[header.column.getIsSorted()]}
//                                             </div>
//                                         ) : (
//                                             <span className="text-xs">{header.column.columnDef.header}</span>
//                                         )}
//                                     </th>
//                                 ))}
//                             </tr>
//                         ))}
//                     </thead>
//                     <tbody className="divide-y divide-[#e3eafc]">
//                         {table1.getRowModel().rows.map(row => (
//                             <tr key={row.id} className='cursor-pointer hover:bg-[#e3eafc]/60'>
//                                 {row.getVisibleCells().map(cell => (
//                                     <td key={cell.id} data-label={cell.column.columnDef.header} className={`table_cell text-base px-4 py-2`}>
//                                         <Tltip direction='right' tltpText={expensesToolTip(row, expensesData, settings, filt)}>
//                                             <span className="text-[0.8rem] items-center flex outline-none whitespace-normal break-words cursor-default">
//                                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                             </span>
//                                         </Tltip>
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                     <tfoot>
//                         <tr className="bg-gradient-to-r from-[#005a99] to-[#0070b8]">
//                             <th className="relative px-4 py-3 text-left text-base font-bold text-white uppercase border-t border-[#005a99]">
//                                 Total $
//                             </th>
//                             <th className="relative px-4 py-3 text-left text-base font-bold text-white uppercase border-t border-[#005a99]">
//                                 {showAmount(
//                                     data.filter(item => item.cur === "us").reduce((sum, item) => sum * 1 + item.total * 1, 0),
//                                     'usd'
//                                 )}
//                             </th>
//                         </tr>
//                         <tr className="bg-gradient-to-r from-[#005a99] to-[#0070b8]">
//                             <th className="relative px-4 py-3 text-left text-base font-bold text-white uppercase border-t border-[#005a99]">
//                                 Total €
//                             </th>
//                             <th className="relative px-4 py-3 text-left text-base font-bold text-white uppercase border-t border-[#005a99]">
//                                 {showAmount(
//                                     data.filter(item => item.cur === "eu").reduce((sum, item) => sum + item.total, 0),
//                                     'eur'
//                                 )}
//                             </th>
//                         </tr>
//                     </tfoot>
//                 </table>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Customtable;
'use client'

import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { TbSortDescending, TbSortAscending } from "react-icons/tb"
import { usePathname } from 'next/navigation'
import '../../contracts/style.css'
import Tltip from "../../../../components/tlTip"
import { expensesToolTip } from "./funcs"

const Customtable = ({ data, columns, expensesData, settings, title, filt, heading }) => {
    const table1 = useReactTable({
        columns, 
        data,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    let showAmount = (x, y) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: y,
            minimumFractionDigits: 2
        }).format(x)
    }

    return (
        <div className="w-full max-w-full flex flex-col items-stretch px-2 sm:px-0">
            {title && (
                <div className="text-xl sm:text-2xl font-bold text-[#1a3353] mb-3 pl-1 pt-2">
                    {title}
                </div>
            )}
            <div className="bg-white rounded-xl shadow-lg border border-[#e3eafc] p-2 sm:p-4 mb-6 w-full flex flex-col">
                {heading && (
                    <div className="text-base sm:text-lg font-semibold text-[#1a3353] mb-3 sm:mb-4 pl-1 pt-1">
                        {heading}
                    </div>
                )}
                
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full border-separate border-spacing-0 min-w-[600px]">
                        <thead>
                            {table1.getHeaderGroups().map(hdGroup => (
                                <tr key={hdGroup.id}>
                                    {hdGroup.headers.map(header => (
                                        <th key={header.id} className="relative px-4 py-3 text-left text-base font-bold text-white bg-[#0070b8] uppercase border-b border-[#005a99] first:rounded-tl-lg last:rounded-tr-lg">
                                            {header.column.getCanSort() ? (
                                                <div onClick={header.column.getToggleSortingHandler()} className="text-xs flex cursor-pointer items-center gap-1">
                                                    {header.column.columnDef.header}
                                                    {{
                                                        asc: <TbSortAscending className="text-white scale-125" />, 
                                                        desc: <TbSortDescending className="text-white scale-125" />
                                                    }[header.column.getIsSorted()]}
                                                </div>
                                            ) : (
                                                <span className="text-xs">{header.column.columnDef.header}</span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-[#e3eafc]">
                            {table1.getRowModel().rows.map(row => (
                                <tr key={row.id} className='cursor-pointer hover:bg-[#e3eafc]/60 transition-colors'>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="text-sm px-4 py-3">
                                            <Tltip direction='right' tltpText={expensesToolTip(row, expensesData, settings, filt)}>
                                                <span className="text-[0.8rem] items-center flex outline-none whitespace-normal break-words cursor-default">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </span>
                                            </Tltip>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gradient-to-r from-[#005a99] to-[#0070b8]">
                                <th className="relative px-4 py-3 text-left text-sm font-bold text-white uppercase border-t border-[#005a99]">
                                    Total $
                                </th>
                                <th className="relative px-4 py-3 text-left text-sm font-bold text-white uppercase border-t border-[#005a99]">
                                    {showAmount(
                                        data.filter(item => item.cur === "us").reduce((sum, item) => sum * 1 + item.total * 1, 0),
                                        'usd'
                                    )}
                                </th>
                            </tr>
                            <tr className="bg-gradient-to-r from-[#005a99] to-[#0070b8]">
                                <th className="relative px-4 py-3 text-left text-sm font-bold text-white uppercase border-t border-[#005a99] rounded-bl-lg">
                                    Total €
                                </th>
                                <th className="relative px-4 py-3 text-left text-sm font-bold text-white uppercase border-t border-[#005a99] rounded-br-lg">
                                    {showAmount(
                                        data.filter(item => item.cur === "eu").reduce((sum, item) => sum + item.total, 0),
                                        'eur'
                                    )}
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="block sm:hidden space-y-3">
                    {table1.getRowModel().rows.map(row => (
                        <div key={row.id} className="bg-white border border-[#e3eafc] rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                            {row.getVisibleCells().map(cell => (
                                <div key={cell.id} className="flex justify-between items-start py-2 border-b border-[#e3eafc] last:border-b-0">
                                    <span className="text-xs font-semibold text-[#0070b8] uppercase w-2/5 flex-shrink-0">
                                        {cell.column.columnDef.header}
                                    </span>
                                    <Tltip direction='left' tltpText={expensesToolTip(row, expensesData, settings, filt)}>
                                        <span className="text-sm text-[#1a3353] text-right w-3/5 break-words">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </span>
                                    </Tltip>
                                </div>
                            ))}
                        </div>
                    ))}
                    
                    {/* Mobile Totals */}
                    <div className="bg-gradient-to-r from-[#005a99] to-[#0070b8] rounded-lg p-4 mt-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-white uppercase">Total $</span>
                            <span className="text-base font-bold text-white">
                                {showAmount(
                                    data.filter(item => item.cur === "us").reduce((sum, item) => sum * 1 + item.total * 1, 0),
                                    'usd'
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/20 pt-3">
                            <span className="text-sm font-bold text-white uppercase">Total €</span>
                            <span className="text-base font-bold text-white">
                                {showAmount(
                                    data.filter(item => item.cur === "eu").reduce((sum, item) => sum + item.total, 0),
                                    'eur'
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Customtable;