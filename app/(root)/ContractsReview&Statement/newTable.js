// 'use client'

// import Header from "../../../components/table/header";
// import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
// import { Fragment, useEffect, useMemo, useState } from "react"
// import { TbSortDescending } from "react-icons/tb";
// import { TbSortAscending } from "react-icons/tb";

// import { Paginator } from "../../../components/table/Paginator";
// import RowsIndicator from "../../../components/table/RowsIndicator";
// import { usePathname } from "next/navigation";
// import '../contracts/style.css';
// import { getTtl } from "../../../utils/languages";
// import { Filter } from '../../../components/table/filters/filterFunc'
// import FiltersIcon from '../../../components/table/filters/filters';
// import ResetFilterTableIcon from '../../../components/table/filters/resetTabe';
// import dateBetweenFilterFn from '../../../components/table/filters/date-between-filter';


// const Customtable = ({ data, columns, invisible, SelectRow, excellReport, cb, setFilteredData, ln }) => {

//     const [globalFilter, setGlobalFilter] = useState('')
//     const [columnVisibility, setColumnVisibility] = useState(invisible)
//     const [filterOn, setFilterOn] = useState(false)


//     const [{ pageIndex, pageSize }, setPagination] = useState({ pageIndex: 0, pageSize: 500 })
//     const pagination = useMemo(() => ({ pageIndex, pageSize, }), [pageIndex, pageSize])
//     const pathName = usePathname()

//     const [columnFilters, setColumnFilters] = useState([]) //Column filter

//     // Quick Sum state
//     const [quickSumEnabled, setQuickSumEnabled] = useState(false);
//     const [quickSumColumns, setQuickSumColumns] = useState([]);
//     const [rowSelection, setRowSelection] = useState({});

//     const columnsWithSelection = useMemo(() => {
//         if (!quickSumEnabled) return columns;
//         const selectCol = {
//             id: "select",
//             header: ({ table }) => (
//                 <input type="checkbox" checked={table.getIsAllPageRowsSelected()}
//                     ref={(el) => { if (el) el.indeterminate = table.getIsSomePageRowsSelected(); }}
//                     onChange={table.getToggleAllPageRowsSelectedHandler()} />
//             ),
//             cell: ({ row }) => (
//                 <input type="checkbox" checked={row.getIsSelected()} disabled={!row.getCanSelect()}
//                     onChange={row.getToggleSelectedHandler()} />
//             ),
//             enableSorting: false, enableColumnFilter: false, size: 40,
//         };
//         return [selectCol, ...(columns || [])];
//     }, [columns, quickSumEnabled]);

//     const table = useReactTable({
//         columns: columnsWithSelection, data,
//         enableRowSelection: quickSumEnabled,
//         getCoreRowModel: getCoreRowModel(),
//         filterFns: {
//             dateBetweenFilterFn,
//         },
//         state: {
//             globalFilter,
//             columnVisibility,
//             pagination,
//             columnFilters,
//             rowSelection,
//         },
//         onRowSelectionChange: setRowSelection,
//         onColumnFiltersChange: setColumnFilters, ////Column filter
//         getFilteredRowModel: getFilteredRowModel(),
//         onGlobalFilterChange: setGlobalFilter,
//         onColumnVisibilityChange: setColumnVisibility,
//         getSortedRowModel: getSortedRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         onPaginationChange: setPagination,
//     })

//     useEffect(() => {
//         setFilteredData(table.getFilteredRowModel().rows.map(x => x.original))
//     }, [globalFilter])

//     useEffect(() => {
//         setFilteredData(table.getFilteredRowModel().rows.map(x => x.original))
//     }, [columnFilters])


//     const resetTable = () => {
//         table.resetColumnFilters()
//     }


//     return (
//         <div className="flex flex-col relative ">
//             <div>
//                 <Header globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}
//                     table={table} excellReport={excellReport} cb={cb}
//                     filterIcon={FiltersIcon(ln, filterOn, setFilterOn)}
//                     resetFilterTable={ResetFilterTableIcon(ln, resetTable, filterOn)}
//                     quickSumEnabled={quickSumEnabled}
//                     setQuickSumEnabled={setQuickSumEnabled}
//                     quickSumColumns={quickSumColumns}
//                     setQuickSumColumns={setQuickSumColumns}
//                 />

//                 <div className="overflow-x-auto border-x border-[var(--selago)] max-h-[360px] md:max-h-[310px] 2xl:max-h-[550px]">
//                     <table className="w-full">
//                         <thead className="md:sticky md:top-0 md:z-10">
//                             {table.getHeaderGroups().map((hdGroup, i) =>
//                                 <Fragment key={hdGroup.id}>
//                                     <tr key={hdGroup.id} className="bg-gradient-to-r from-[var(--endeavour)] via-[var(--chathams-blue)] to-[var(--endeavour)]">
//                                         {hdGroup.headers.map(header =>
//                                             <th
//                                                 key={header.id}
//                                                 className="relative px-6 py-3 text-left text-sm text-white uppercase font-semibold hover:bg-[var(--rock-blue)]"
//                                             >
//                                                 {header.column.getCanSort() ? (
//                                                     <div
//                                                         onClick={header.column.getToggleSortingHandler()}
//                                                         className="flex items-center gap-1 whitespace-nowrap cursor-pointer"
//                                                     >
//                                                         {header.column.columnDef.header}
//                                                         {{
//                                                             asc: <TbSortAscending className="scale-125" />,
//                                                             desc: <TbSortDescending className="scale-125" />
//                                                         }[header.column.getIsSorted()]}
//                                                     </div>
//                                                 ) : (
//                                                     <span className="text-xs font-medium">
//                                                         {header.column.columnDef.header}
//                                                     </span>
//                                                 )}
//                                                 {header.column.getCanFilter() && filterOn && (
//                                                     <div className="mt-1 sm:mt-0 dropdown-left-space">
//                                                         <Filter column={header.column} table={table} filterOn={filterOn} />
//                                                     </div>
//                                                 )}
//                                             </th>
//                                         )}
//                                     </tr>
//                                 </Fragment>
//                             )}
//                         </thead>
//                         <tbody className="divide-y divide-[var(--selago)]">
//                             {table.getRowModel().rows.map(row => (
//                                 <tr
//                                     key={row.id}
//                                     className={`cursor-pointer ${row.getIsSelected() ? 'bg-blue-100' : ''} hover:bg-[var(--rock-blue)]`}
//                                     onDoubleClick={() => SelectRow(row.original)}
//                                 >
//                                     {row.getVisibleCells().map(cell => (
//                                         <td
//                                             key={cell.id}
//                                             data-label={cell.column.columnDef.header}
//                                             className={`
//                                                 table_cell
//                                                 text-xs sm:text-sm
//                                                 break-words whitespace-normal
//                                                 max-w-full sm:max-w-none
//                                                 hover:bg-[var(--rock-blue)] hover:text-[var(--bunting)]
//                                             `}
//                                         >
//                                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                         </td>
//                                     ))}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//                 <div className="table-toolbar flex p-2.5 border-t border-[var(--selago)] flex-wrap bg-white rounded-b-2xl">
//                     <div className="hidden lg:flex text-[var(--regent-gray)] text-sm w-48 xl:w-96 p-2">
//                         {`${getTtl('Showing', ln)} ${
//                             table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
//                             (table.getFilteredRowModel().rows.length ? 1 : 0)
//                         }-${table.getRowModel().rows.length + table.getState().pagination.pageIndex * table.getState().pagination.pageSize}
//                         ${getTtl('of', ln)} ${table.getFilteredRowModel().rows.length}`}
//                     </div>
//                     <Paginator table={table} />
//                     <RowsIndicator table={table} />
//                 </div>
//             </div>
//         </div>
//     )
// }


// export default Customtable;
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
                {/* HEADER - Desktop: higher z-index + overflow visible, Mobile: normal */}
                <div className="relative md:z-30 md:overflow-visible">
                    <Header globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}
                        table={table} excellReport={excellReport} cb={cb}
                        filterIcon={FiltersIcon(ln, filterOn, setFilterOn)}
                        resetFilterTable={ResetFilterTableIcon(ln, resetTable, filterOn)}
                        quickSumEnabled={quickSumEnabled}
                        setQuickSumEnabled={setQuickSumEnabled}
                        quickSumColumns={quickSumColumns}
                        setQuickSumColumns={setQuickSumColumns}
                    />
                </div>

                {/* SCROLL CONTAINER - Desktop: lower z-index, Mobile: normal */}
                <div className="overflow-x-auto border-x border-[var(--selago)] max-h-[360px] md:max-h-[310px] 2xl:max-h-[550px] relative md:z-10">
                    <table className="w-full">
                        {/* THEAD - Desktop: lowest z-index, Mobile: normal */}
                        <thead className="md:sticky md:top-0 md:z-[5]">
                            {table.getHeaderGroups().map((hdGroup, i) =>
                                <Fragment key={hdGroup.id}>
                                    <tr key={hdGroup.id} className="bg-gradient-to-r from-[var(--endeavour)] via-[var(--chathams-blue)] to-[var(--endeavour)]">
                                        {hdGroup.headers.map(header =>
                                            <th
                                                key={header.id}
                                                className="relative px-6 py-3 text-left text-sm text-white uppercase font-semibold hover:bg-[var(--rock-blue)]"
                                            >
                                                {header.column.getCanSort() ? (
                                                    <div
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        className="flex items-center gap-1 whitespace-nowrap cursor-pointer"
                                                    >
                                                        {header.column.columnDef.header}
                                                        {{
                                                            asc: <TbSortAscending className="scale-125" />,
                                                            desc: <TbSortDescending className="scale-125" />
                                                        }[header.column.getIsSorted()]}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-medium">
                                                        {header.column.columnDef.header}
                                                    </span>
                                                )}
                                                {header.column.getCanFilter() && filterOn && (
                                                    <div className="mt-1 sm:mt-0 dropdown-left-space">
                                                        <Filter column={header.column} table={table} filterOn={filterOn} />
                                                    </div>
                                                )}
                                            </th>
                                        )}
                                    </tr>
                                </Fragment>
                            )}
                        </thead>
                        <tbody className="divide-y divide-[var(--selago)]">
                            {table.getRowModel().rows.map(row => (
                                <tr
                                    key={row.id}
                                    className={`cursor-pointer ${row.getIsSelected() ? 'bg-blue-100' : ''} hover:bg-[var(--rock-blue)]`}
                                    onDoubleClick={() => SelectRow(row.original)}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            data-label={cell.column.columnDef.header}
                                            className={`
                                                table_cell
                                                text-xs sm:text-sm
                                                break-words whitespace-normal
                                                max-w-full sm:max-w-none
                                                hover:bg-[var(--rock-blue)] hover:text-[var(--bunting)]
                                            `}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="table-toolbar flex p-2.5 border-t border-[var(--selago)] flex-wrap bg-white rounded-b-2xl">
                    <div className="hidden lg:flex text-[var(--regent-gray)] text-sm w-48 xl:w-96 p-2">
                        {`${getTtl('Showing', ln)} ${
                            table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                            (table.getFilteredRowModel().rows.length ? 1 : 0)
                        }-${table.getRowModel().rows.length + table.getState().pagination.pageIndex * table.getState().pagination.pageSize}
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