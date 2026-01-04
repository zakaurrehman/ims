// 'use client'

// import Header from "../../../components/table/header";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable
// } from "@tanstack/react-table"

// import { useEffect, useMemo, useState, useContext } from "react"
// import { TbSortDescending, TbSortAscending } from "react-icons/tb";

// import { Paginator } from "../../../components/table/Paginator";
// import RowsIndicator from "../../../components/table/RowsIndicator";
// import './style.css';

// import { SettingsContext } from "../../../contexts/useSettingsContext";
// import { usePathname } from "next/navigation";
// import { getTtl } from "../../../utils/languages";

// import FiltersIcon from '../../../components/table/filters/filters';
// import ResetFilterTableIcon from '../../../components/table/filters/resetTabe';
// import dateBetweenFilterFn from '../../../components/table/filters/date-between-filter';
// import { Filter } from "../../../components/table/filters/filterFunc";

// const Customtable = ({
//   data,
//   columns,
//   invisible,
//   SelectRow,
//   excellReport,
//   setFilteredData,
//   highlightId,
//   onCellUpdate
// }) => {

//   const [globalFilter, setGlobalFilter] = useState('')
//   const [columnVisibility, setColumnVisibility] = useState(invisible)
//   const [filterOn, setFilterOn] = useState(false)

//   const [{ pageIndex, pageSize }, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 200
//   })

//   const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize])

//   const pathName = usePathname()
//   const { ln } = useContext(SettingsContext);

//   const [quickSumEnabled, setQuickSumEnabled] = useState(false);
//   const [quickSumColumns, setQuickSumColumns] = useState([]);

//   const [isEditMode, setIsEditMode] = useState(false)
//   const [rowSelection, setRowSelection] = useState({});

//   const [columnFilters, setColumnFilters] = useState([])

//   // ----- Responsive + Touch-Friendly Selection Column -----
//   const columnsWithSelection = useMemo(() => {
//     if (!quickSumEnabled) return columns;

//     const selectCol = {
//       id: "select",
//       header: ({ table }) => (
//         <input
//           type="checkbox"
//           checked={table.getIsAllPageRowsSelected()}
//           ref={el => {
//             if (!el) return;
//             el.indeterminate = table.getIsSomePageRowsSelected();
//           }}
//           onChange={table.getToggleAllPageRowsSelectedHandler()}
//           className="qs-checkbox"
//         />
//       ),
//       cell: ({ row }) => (
//         <input
//           type="checkbox"
//           checked={row.getIsSelected()}
//           disabled={!row.getCanSelect()}
//           onChange={row.getToggleSelectedHandler()}
//           className="qs-checkbox"
//         />
//       ),
//       enableSorting: false,
//       enableColumnFilter: false,
//       size: 48,
//     };

//     return [selectCol, ...(columns || [])];
//   }, [columns, quickSumEnabled]);

//   // ---------- TABLE CONFIG ----------
//   const table = useReactTable({
//     meta: {
//       isEditMode,
//       updateData: (rowIndex, columnId, value) => {
//         if (!isEditMode) return;
//         onCellUpdate?.({ rowIndex, columnId, value });
//       },
//     },
//     columns: columnsWithSelection,
//     data,
//     enableRowSelection: quickSumEnabled,
//     getCoreRowModel: getCoreRowModel(),
//     filterFns: { dateBetweenFilterFn },
//     state: {
//       globalFilter,
//       columnVisibility,
//       pagination,
//       columnFilters,
//       rowSelection,
//     },
//     onRowSelectionChange: setRowSelection,
//     onColumnFiltersChange: setColumnFilters,
//     getFilteredRowModel: getFilteredRowModel(),
//     onGlobalFilterChange: setGlobalFilter,
//     onColumnVisibilityChange: setColumnVisibility,
//     getSortedRowModel: getSortedRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onPaginationChange: setPagination,
//   })

//   const resetTable = () => table.resetColumnFilters()

//   useEffect(() => resetTable(), [])

//   useEffect(() => {
//     setFilteredData(
//       table.getFilteredRowModel().rows.map(x => x.original)
//     )
//   }, [columnFilters, globalFilter])

//   return (
//     <div className="flex flex-col relative">

//       <Header
//         globalFilter={globalFilter}
//         setGlobalFilter={setGlobalFilter}
//         table={table}
//         excellReport={excellReport}
//         filterIcon={FiltersIcon(ln, filterOn, setFilterOn)}

//         isEditMode={isEditMode}
//         setIsEditMode={setIsEditMode}

//         resetFilterTable={ResetFilterTableIcon(ln, resetTable, filterOn)}

//         quickSumEnabled={quickSumEnabled}
//         setQuickSumEnabled={setQuickSumEnabled}
//         quickSumColumns={quickSumColumns}
//         setQuickSumColumns={setQuickSumColumns}
//       />

//       {/* ---------- SCROLL CONTAINER WITH MOBILE HEIGHT ---------- */}
//       <div className="overflow-x-auto border-x border-[var(--selago)] 
//         max-h-[720px] md:max-h-[700px] 2xl:max-h-[900px]">

//         <table className="w-full">

//           <thead className="md:sticky md:top-0 md:z-10">

//             {table.getHeaderGroups().map(hdGroup =>
//               <tr key={hdGroup.id}
//                 className="bg-gradient-to-r from-[var(--endeavour)] via-[var(--chathams-blue)] to-[var(--endeavour)]">

//                 {hdGroup.headers.map(header =>
//                   <th
//                     key={header.id}
//                     className="relative px-3 py-2 text-left text-xs text-white uppercase 
//                     font-semibold hover:bg-[var(--rock-blue)]">

//                     {/* SORTABLE HEADERS */}
//                     {header.column.getCanSort() ? (
//                       <div
//                         onClick={header.column.getToggleSortingHandler()}
//                         className="flex items-center gap-1 whitespace-nowrap cursor-pointer"
//                       >
//                         {header.column.columnDef.header}
//                         {{
//                           asc: <TbSortAscending className="scale-125" />,
//                           desc: <TbSortDescending className="scale-125" />
//                         }[header.column.getIsSorted()]}
//                       </div>
//                     ) : (
//                       <span className="text-xs font-medium">
//                         {header.column.columnDef.header}
//                       </span>
//                     )}

//                     {/* COLUMN FILTER */}
//                     {header.column.getCanFilter() && filterOn && (
//                       <div className="mt-1 sm:mt-0 dropdown-left-space">
//                         <Filter column={header.column} table={table} filterOn={filterOn} />
//                       </div>
//                     )}

//                   </th>
//                 )}

//               </tr>
//             )}

//           </thead>

//           <tbody className="divide-y divide-[var(--selago)]">

//             {table.getRowModel().rows.map(row => (
//               <tr
//                 key={row.id}
//                 className={`cursor-pointer
//                   ${row.getIsSelected() ? 'bg-blue-100' : ''}
//                   hover:bg-[var(--rock-blue)]`}
//                 onDoubleClick={() => SelectRow(row.original)}
//               >

//                 {row.getVisibleCells().map(cell => (
//                   <td
//                     key={cell.id}
//                     data-label={cell.column.columnDef.header}
//                     className={`
//                       table_cell 
//                       text-xs
//                       break-words whitespace-normal
//                       max-w-full sm:max-w-none
//                       hover:bg-[var(--rock-blue)] hover:text-[var(--bunting)]
//                       ${pathName === '/invoices' ? 'md:py-1' : 'md:py-1'}
//                     `}
//                   >
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </tr>
//             ))}

//           </tbody>

//         </table>

//       </div>

//       {/* ---------- FOOTER ---------- */}
//       <div className="table-toolbar flex p-2 border-t border-[var(--selago)] flex-wrap 
//         bg-white rounded-b-2xl">

//         <div className="hidden lg:flex text-[var(--regent-gray)] text-sm w-40 xl:w-72 p-1">
//           {`${getTtl('Showing', ln)} ${
//             table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
//             (table.getFilteredRowModel().rows.length ? 1 : 0)
//           }-${table.getRowModel().rows.length + table.getState().pagination.pageIndex * table.getState().pagination.pageSize}
//           ${getTtl('of', ln)} ${table.getFilteredRowModel().rows.length}`}
//         </div>

//         <Paginator table={table} />
//         <RowsIndicator table={table} />
//       </div>

//     </div>
//   )
// }

// export default Customtable
'use client'

import Header from "../../../components/table/header";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"

import { useEffect, useMemo, useState, useContext } from "react"
import { TbSortDescending, TbSortAscending } from "react-icons/tb";

import { Paginator } from "../../../components/table/Paginator";
import RowsIndicator from "../../../components/table/RowsIndicator";
import './style.css';

import { SettingsContext } from "../../../contexts/useSettingsContext";
import { usePathname } from "next/navigation";
import { getTtl } from "../../../utils/languages";

import FiltersIcon from '../../../components/table/filters/filters';
import ResetFilterTableIcon from '../../../components/table/filters/resetTabe';
import dateBetweenFilterFn from '../../../components/table/filters/date-between-filter';
import { Filter } from "../../../components/table/filters/filterFunc";

const Customtable = ({
  data,
  columns,
  invisible,
  SelectRow,
  excellReport,
  setFilteredData,
  highlightId,
  onCellUpdate
}) => {

  const [globalFilter, setGlobalFilter] = useState('')
  const [columnVisibility, setColumnVisibility] = useState(invisible)
  const [filterOn, setFilterOn] = useState(false)

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 200
  })

  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize])

  const pathName = usePathname()
  const { ln } = useContext(SettingsContext);

  const [quickSumEnabled, setQuickSumEnabled] = useState(false);
  const [quickSumColumns, setQuickSumColumns] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false)
  const [rowSelection, setRowSelection] = useState({});

  const [columnFilters, setColumnFilters] = useState([])

  // ----- Responsive + Touch-Friendly Selection Column -----
  const columnsWithSelection = useMemo(() => {
    if (!quickSumEnabled) return columns;

    const selectCol = {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          ref={el => {
            if (!el) return;
            el.indeterminate = table.getIsSomePageRowsSelected();
          }}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="qs-checkbox"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
          className="qs-checkbox"
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 48,
    };

    return [selectCol, ...(columns || [])];
  }, [columns, quickSumEnabled]);

  // ---------- TABLE CONFIG ----------
  const table = useReactTable({
    meta: {
      isEditMode,
      updateData: (rowIndex, columnId, value) => {
        if (!isEditMode) return;
        onCellUpdate?.({ rowIndex, columnId, value });
      },
    },
    columns: columnsWithSelection,
    data,
    enableRowSelection: quickSumEnabled,
    getCoreRowModel: getCoreRowModel(),
    filterFns: { dateBetweenFilterFn },
    state: {
      globalFilter,
      columnVisibility,
      pagination,
      columnFilters,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  })

  const resetTable = () => table.resetColumnFilters()

  useEffect(() => resetTable(), [])

  useEffect(() => {
    setFilteredData(
      table.getFilteredRowModel().rows.map(x => x.original)
    )
  }, [columnFilters, globalFilter])

  return (
    <div className="flex flex-col relative">

      {/* HEADER - Desktop: higher z-index + overflow visible, Mobile: normal */}
      <div className="relative md:z-30 md:overflow-visible">
        <Header
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          table={table}
          excellReport={excellReport}
          filterIcon={FiltersIcon(ln, filterOn, setFilterOn)}

          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}

          resetFilterTable={ResetFilterTableIcon(ln, resetTable, filterOn)}

          quickSumEnabled={quickSumEnabled}
          setQuickSumEnabled={setQuickSumEnabled}
          quickSumColumns={quickSumColumns}
          setQuickSumColumns={setQuickSumColumns}
        />
      </div>

      {/* ---------- SCROLL CONTAINER WITH MOBILE HEIGHT ---------- */}
      <div className="overflow-x-auto border-x border-[var(--selago)] 
        max-h-[720px] md:max-h-[700px] 2xl:max-h-[900px] relative md:z-10">

        <table className="w-full">

          {/* THEAD - Desktop: lower z-index, Mobile: normal */}
          <thead className="md:sticky md:top-0 md:z-[5]">

            {table.getHeaderGroups().map(hdGroup =>
              <tr key={hdGroup.id}
                className="bg-gradient-to-r from-[var(--endeavour)] via-[var(--chathams-blue)] to-[var(--endeavour)]">

                {hdGroup.headers.map(header =>
                  <th
                    key={header.id}
                    className="relative px-3 py-2 text-left text-xs text-white uppercase 
                    font-semibold hover:bg-[var(--rock-blue)]">

                    {/* SORTABLE HEADERS */}
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

                    {/* COLUMN FILTER */}
                    {header.column.getCanFilter() && filterOn && (
                      <div className="mt-1 sm:mt-0 dropdown-left-space">
                        <Filter column={header.column} table={table} filterOn={filterOn} />
                      </div>
                    )}

                  </th>
                )}

              </tr>
            )}

          </thead>

          <tbody className="divide-y divide-[var(--selago)]">

            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={`cursor-pointer
                  ${row.getIsSelected() ? 'bg-blue-100' : ''}
                  hover:bg-[var(--rock-blue)]`}
                onDoubleClick={() => SelectRow(row.original)}
              >

                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    data-label={cell.column.columnDef.header}
                    className={`
                      table_cell 
                      text-xs
                      break-words whitespace-normal
                      max-w-full sm:max-w-none
                      hover:bg-[var(--rock-blue)] hover:text-[var(--bunting)]
                      ${pathName === '/invoices' ? 'md:py-1' : 'md:py-1'}
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

      {/* ---------- FOOTER ---------- */}
      <div className="table-toolbar flex p-2 border-t border-[var(--selago)] flex-wrap 
        bg-white rounded-b-2xl">

        <div className="hidden lg:flex text-[var(--regent-gray)] text-sm w-40 xl:w-72 p-1">
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
  )
}

export default Customtable