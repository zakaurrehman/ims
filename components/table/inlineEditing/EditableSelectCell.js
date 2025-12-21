// 'use client';
// import { useEffect, useState } from "react";

// export default function EditableSelectCell({ getValue, row, column, table }) {
//   const initialValue = getValue();
//   const [value, setValue] = useState(initialValue ?? "");
//   const options = column.columnDef?.meta?.options ?? [];

//   useEffect(() => setValue(initialValue ?? ""), [initialValue]);

//   const commit = (v) => {
//     table.options.meta?.updateData?.(row.index, column.id, v);
//   };

//   return (
//     <select
//       value={value}
//       onChange={(e) => {
//         const v = e.target.value;
//         setValue(v);
//         commit(v); // save immediately like Excel dropdown
//       }}
//       className="w-full bg-transparent px-1 py-0.5 border border-transparent rounded
//                  focus:bg-white focus:border-gray-400 outline-none"
//     >
//       {options.map((o) => (
//         <option key={o.value} value={o.value}>{o.label}</option>
//       ))}
//     </select>
//   );
// }
'use client';
import { useEffect, useMemo, useState } from "react";

export default function EditableSelectCell({ getValue, row, column, table }) {
  const isEditMode = !!table?.options?.meta?.isEditMode;

  const initialValue = getValue();
  const [value, setValue] = useState(initialValue ?? "");
  const options = column.columnDef?.meta?.options ?? [];

  useEffect(() => setValue(initialValue ?? ""), [initialValue]);

  const commit = (v) => {
    if (!isEditMode) return;
    table.options.meta?.updateData?.(row.index, column.id, v);
  };

  // ✅ NEW: when editing is OFF, show label text (not a select)
  if (!isEditMode) {
    const val = initialValue;

    const found = options.find(o => String(o.value) === String(val));
    const rawLabel = found?.label ?? val ?? "";

    const safeLabel =
      typeof rawLabel === "string" || typeof rawLabel === "number"
        ? rawLabel
        : // fallback for objects (e.g. { nname: "Gun" } or {} )
          (rawLabel?.nname ?? rawLabel?.name ?? JSON.stringify(rawLabel));

    return <span>{safeLabel}</span>;
  }


  return (
    <select
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        setValue(v);
        commit(v); // save immediately like Excel dropdown
      }}
      className="w-full bg-transparent px-1 py-0.5 border border-transparent rounded
                 focus:bg-white focus:border-gray-400 outline-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
