// import { useState } from "react";


// const Stainless = ({ value, handleChange }) => {
//     const [focusedField, setFocusedField] = useState(null);

//     const fe = (100 - value?.stainless?.ni - value?.stainless?.cr - value?.stainless?.mo).toFixed(2);
//     const solidsPrice = value?.stainless?.ni * value?.general?.nilme * value?.stainless?.formulaNiCost / 10000 +
//         value?.stainless?.cr * value?.stainless?.crPrice / 100 +
//         value?.stainless?.mo * value?.stainless?.moPrice / 100 +
//         value?.stainless?.fe * value?.stainless?.fePrice / 100


//     const solidsPrice1 = value?.stainless?.ni * value?.general?.nilme / 100 * value?.stainless?.formulaNiPrice / 100 +
//         value?.stainless?.cr / 100 * value.general?.chargeCrLb * value.general?.mt * value?.stainless?.crPriceArgus / 100 +
//         value?.stainless?.mo / 100 * (value.general?.MoOxideLb * value?.stainless?.moPriceArgus * value.general?.mt / 100) +
//         value?.stainless?.fe * value?.stainless?.fePrice1 / 100


//     const addComma = (nStr, z) => {
//         nStr += '';
//         var x = nStr.split('.');
//         var x1 = x[0];
//         var x2 = x.length > 1 ? '.' + x[1] : '';
//         var rgx = /(\d+)(\d{3})/;
//         while (rgx.test(x1)) {
//             x1 = x1.replace(rgx, '$1,$2');
//         }

//         const symbol = !z ? '$' : '€'
//         return (symbol + x1 + x2);
//     }

//     return (
//         <div className='border border-slate-300 p-3 rounded-lg flex flex-col md:flex-row w-full'>

//             <div className="grid grid-cols-2 w-[75rem]">
//                 <div className="col-span-2 md:col-span-1">
//                     <p className='text-center text-slate-600 text-lg font-semibold'>Cost</p>
//                     <div className='flex gap-6 pt-2'>
//                         <div>
//                             <div>
//                                 <p className='text-center text-slate-600 text-sm font-semibold'>Composition</p>
//                                 <div className='flex justify-center'>
//                                     <div className='border border-slate-500 w-24 flex flex-col justify-center'>
//                                         <span className='title_style'>Ni</span>
//                                         <input type='input' className='input_style text-red-700' value={value?.stainless?.ni + '%'}
//                                             name='ni' onChange={(e) => {
//                                                 handleChange({
//                                                     target: {
//                                                         name: e.target.name,
//                                                         value: e.target.value.replace('%', ''),
//                                                     },
//                                                 }, 'stainless');
//                                             }}
//                                             onBlur={(e) => {
//                                                 let num = parseFloat(e.target.value.replace("%", ""));
//                                                 if (isNaN(num)) num = 0; // default to 0
//                                                 handleChange(
//                                                     {
//                                                         target: {
//                                                             name: e.target.name,
//                                                             value: num.toFixed(2), // store with 2 decimals
//                                                         },
//                                                     },
//                                                     "stainless"
//                                                 );
//                                             }} />
//                                     </div>
//                                     <div className='border-y border-slate-500  border-r w-24 flex flex-col justify-center'>
//                                         <span className='title_style'>Cr</span>
//                                         <input type='input' className='input_style text-red-700' value={value?.stainless?.cr + '%'}
//                                             name='cr' onChange={(e) => {
//                                                 handleChange({
//                                                     target: {
//                                                         name: e.target.name,
//                                                         value: e.target.value.replace('%', ''),
//                                                     },
//                                                 }, 'stainless');
//                                             }}
//                                             onBlur={(e) => {
//                                                 let num = parseFloat(e.target.value.replace("%", ""));
//                                                 if (isNaN(num)) num = 0; // default to 0
//                                                 handleChange(
//                                                     {
//                                                         target: {
//                                                             name: e.target.name,
//                                                             value: num.toFixed(2), // store with 2 decimals
//                                                         },
//                                                     },
//                                                     "stainless"
//                                                 );
//                                             }} />
//                                     </div>
//                                     <div className='border-y border-slate-500  border-r w-24 flex flex-col justify-center'>
//                                         <span className='title_style'>Mo</span>
//                                         <input type='input' className='input_style text-red-700' value={value?.stainless?.mo + '%'}
//                                             name='mo' onChange={(e) => {
//                                                 handleChange({
//                                                     target: {
//                                                         name: e.target.name,
//                                                         value: e.target.value.replace('%', ''),
//                                                     },
//                                                 }, 'stainless');
//                                             }}
//                                             onBlur={(e) => {
//                                                 let num = parseFloat(e.target.value.replace("%", ""));
//                                                 if (isNaN(num)) num = 0; // default to 0
//                                                 handleChange(
//                                                     {
//                                                         target: {
//                                                             name: e.target.name,
//                                                             value: num.toFixed(2), // store with 2 decimals
//                                                         },
//                                                     },
//                                                     "stainless"
//                                                 );
//                                             }} />
//                                     </div>
//                                     <div className='border-y border-slate-500  border-r w-24 flex flex-col justify-center'>
//                                         <span className='title_style'>Fe</span>
//                                         <input type='input' className='input_style bg-slate-100' value={fe + '%'}
//                                             name='fe' onChange={(e) => { }} />
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className=''>
//                                 <p className='text-center text-slate-600 text-sm font-semibold'>Price</p>
//                                 <div className='flex justify-center'>
//                                     <div className='border border-slate-500 w-24 flex flex-col justify-center'>
//                                         <span className='title_style bg-customLavender'>Ni</span>
//                                         <input type='input' className='input_style bg-slate-100 ' value={addComma(value.general?.nilme * value.stainless?.formulaNiCost / 100)}
//                                             onChange={(e) => { }} />
//                                     </div>
//                                     <div className='border-y border-slate-500  border-r w-24 flex flex-col justify-center'>
//                                         <span className='title_style bg-customLavender'>Cr</span>
//                                         <input
//                                             type="text"
//                                             className="input_style text-red-700"
//                                             name="crPrice"
//                                             value={
//                                                 focusedField === "crPrice"
//                                                     ? value.stainless?.crPrice ?? ""  // raw while editing
//                                                     : value.stainless?.crPrice !== undefined && value.stainless?.crPrice !== ""
//                                                         ? addComma(parseFloat(value.stainless.crPrice).toFixed(2)) // formatted with commas & 2 decimals
//                                                         : "0.00"
//                                             }
//                                             onChange={(e) => handleChange(e, "stainless")}
//                                             onFocus={() => setFocusedField("crPrice")}
//                                             onBlur={(e) => {
//                                                 setFocusedField(null);
//                                                 let num = parseFloat(e.target.value);
//                                                 if (isNaN(num)) num = 0;
//                                                 handleChange(
//                                                     {
//                                                         target: {
//                                                             name: e.target.name,
//                                                             value: num.toFixed(2), // store as 2 decimals
//                                                         },
//                                                     },
//                                                     "stainless"
//                                                 );
//                                             }}
//                                         />


//                                     </div>
//                                     <div className='border-y border-slate-500  border-r w-24 flex flex-col justify-center'>
//                                         <span className='title_style bg-customLavender'>Mo</span>
//                                         <input
//                                             type="text"
//                                             className="input_style text-red-700"
//                                             name="moPrice"
//                                             value={
//                                                 focusedField === "moPrice"
//                                                     ? value.stainless?.moPrice ?? "" // raw input while editing
//                                                     : value.stainless?.moPrice !== undefined && value.stainless?.moPrice !== ""
//                                                         ? addComma(parseFloat(value.stainless.moPrice).toFixed(2)) // formatted with commas and 2 decimals
//                                                         : "0.00"
//                                             }
//                                             onChange={(e) => handleChange(e, "stainless")}
//                                             onFocus={() => setFocusedField("moPrice")}
//                                             onBlur={(e) => {
//                                                 setFocusedField(null);
//                                                 let num = parseFloat(e.target.value.replace(/,/g, "")); // remove commas before parsing
//                                                 if (isNaN(num)) num = 0;
//                                                 handleChange(
//                                                     {
//                                                         target: {
//                                                             name: e.target.name,
//                                                             value: num.toFixed(2), // store with 2 decimals
//                                                         },
//                                                     },
//                                                     "stainless"
//                                                 );
//                                             }}
//                                         />

//                                     </div>
//                                     <div className='border-y border-slate-500  border-r w-24 flex flex-col justify-center'>
//                                         <span className='title_style bg-customLavender'>Fe</span>
//                                         <input
//                                             type="text"
//                                             className="input_style text-red-700"
//                                             name="fePrice"
//                                             value={
//                                                 focusedField === "fePrice"
//                                                     ? value.stainless?.fePrice ?? "" // raw while typing
//                                                     : value.stainless?.fePrice !== undefined && value.stainless?.fePrice !== ""
//                                                         ? addComma(parseFloat(value.stainless.fePrice).toFixed(2)) // formatted with commas and 2 decimals
//                                                         : "0.00"
//                                             }
//                                             onChange={(e) => handleChange(e, "stainless")}
//                                             onFocus={() => setFocusedField("fePrice")}
//                                             onBlur={(e) => {
//                                                 setFocusedField(null);
//                                                 let num = parseFloat(e.target.value.replace(/,/g, "")); // remove commas before parsing
//                                                 if (isNaN(num)) num = 0;
//                                                 handleChange(
//                                                     {
//                                                         target: {
//                                                             name: e.target.name,
//                                                             value: num.toFixed(2), // store with 2 decimals
//                                                         },
//                                                     },
//                                                     "stainless"
//                                                 );
//                                             }}
//                                         />

//                                     </div>
//                                 </div>

//                             </div>
//                         </div>
//                         <div className='items-end flex'>
//                             <div className='border border-slate-500 w-24 flex flex-col'>
//                                 <span className='title_style bg-blue-300'>Ni LME</span>
//                                 <input type='text' className='input_style bg-slate-100' value={addComma(value?.general?.nilme)}
//                                     name='nilme' onChange={(e) => { }} />
//                             </div>
//                         </div>
//                     </div>


//                     <div className='items-end flex pt-[44px]'>
//                         <div className='border border-slate-500 w-24 flex flex-col'>
//                             <span className='title_style bg-customOrange'> Formula x Ni</span>
//                             <input
//                                 type="text"
//                                 className="input_style bg-orange-200 text-red-600"
//                                 name="formulaNiCost"
//                                 value={
//                                     value?.stainless?.formulaNiCost !== undefined && value.stainless.formulaNiCost !== ""
//                                         ? value.stainless.formulaNiCost + "%" // raw while typing
//                                         : "0.00%" // default if empty
//                                 }
//                                 onChange={(e) =>
//                                     handleChange(
//                                         {
//                                             target: {
//                                                 name: e.target.name,
//                                                 value: e.target.value.replace("%", ""), // remove % while typing
//                                             },
//                                         },
//                                         "stainless"
//                                     )
//                                 }
//                                 onBlur={(e) => {
//                                     let num = parseFloat(e.target.value.replace("%", ""));
//                                     if (isNaN(num)) num = 0; // default to 0
//                                     handleChange(
//                                         {
//                                             target: {
//                                                 name: e.target.name,
//                                                 value: num.toFixed(2), // store with 2 decimals
//                                             },
//                                         },
//                                         "stainless"
//                                     );
//                                 }}
//                             />

//                         </div>
//                     </div>
//                     <div className=''>
//                         <div className='items-end flex pt-6 gap-6'>
//                             <div className='border border-slate-500 w-24 flex flex-col'>
//                                 <span className='title_style bg-customLavender'>Cost</span>
//                                 <span className='title_style'>Solids Price:</span>
//                                 <input type='text' className='input_style bg-orange-200 '
//                                     value={addComma(solidsPrice.toFixed(2))}
//                                     name='formulaNi' onChange={(e) => { }} />
//                             </div>
//                             <div className='border border-slate-500 w-24 flex flex-col'>
//                                 <span className='title_style'>Turnings Price:</span>
//                                 <input type='text' className='input_style bg-orange-200 '
//                                     value={addComma((solidsPrice * 0.9).toFixed(2))}
//                                     name='formulaNi' onChange={(e) => { }} />
//                             </div>
//                             <div className='border border-slate-500 w-24 flex flex-col'>
//                                 <span className='title_style'>Price/Euro:</span>
//                                 <input type='text' className='input_style bg-customLime'
//                                     value={addComma((solidsPrice / value.general?.euroRate).toFixed(2), 'a')}
//                                     name='formulaNi' onChange={(e) => { }} />
//                             </div>
//                         </div>
//                     </div>

//                     <div className='pt-4 text-red-600'>
//                         <p className="text-xs">* Fill in the red and + Formula x Ni</p>
//                         <p className="text-xs">* Fe is calculated automatically</p>
//                     </div>

//                 </div>



//                 <div className="col-span-2 md:col-span-1">
//                     <p className='text-center text-slate-600 text-lg font-semibold'>Sales</p>
//                     <div className='flex gap-6 pt-2'>
//                         <div>
//                             <div>
//                                 <p className='text-center text-slate-600 text-sm font-semibold'>Composition</p>
//                                 <div className='flex justify-center'>
//                                     <div className='border border-slate-500 w-24 flex flex-col justify-center'>
//                                         <span className='title_style'>Ni</span>
//                                         <input type='input' className='input_style bg-slate-100'
//                                             value={value?.stainless?.ni + '%'} onChange={(e) => { }} />
//                                     </div>
//                                     <div className='border-y border-slate-500  border-r w-24 flex flex-col justify-center'>
//                                         <span className='title_style'>Cr</span>
//                                         <input type='input' className='input_style bg-slate-100'
//                                             value={value?.stainless?.cr + '%'} onChange={(e) => { }} />
//                                     </div>
//                                     <div className='border-y border-slate-500  border-r w-24 flex flex-col justify-center'>
//                                         <span className='title_style'>Mo</span>
//                                         <input type='input' className='input_style bg-slate-100'
//                                             value={value?.stainless?.mo + '%'} onChange={(e) => { }} />
//                                     </div>
//                                     <div className='border-y border-slate-500  border-r w-24 flex flex-col justify-center'>
//                                         <span className='title_style'>Fe</span>
//                                         <input type='input' className='input_style bg-slate-100'
//                                             value={value?.stainless?.fe + '%'} onChange={(e) => { }} />
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className=''>
//                                 <p className='text-center text-slate-600 text-sm font-semibold'>Price</p>
//                                 <div className='flex justify-center'>
//                                     <div className='border border-slate-500 w-24 flex flex-col justify-center'>
//                                         <span className='title_style bg-customLavender'>Ni</span>
//                                         <input type='input' className='input_style  bg-slate-100 ' value={addComma(value?.general?.nilme * value?.stainless?.formulaNiPrice / 100)}
//                                             onChange={(e) => { }} />
//                                     </div>
//                                     <div className='border-y border-slate-500  border-r w-24 flex flex-col justify-center'>
//                                         <span className='title_style bg-customLavender'>Cr</span>
//                                         <input type='input' className='input_style bg-slate-100 '
//                                             value={addComma((value.general?.chargeCrLb * value.general?.mt * value?.stainless?.crPriceArgus / 100).toFixed(2))} onChange={(e) => { }} />
//                                     </div>
//                                     <div className='border-y border-slate-500  border-r w-24 flex flex-col justify-center'>
//                                         <span className='title_style bg-customLavender'>Mo</span>
//                                         <input type='input' className='input_style bg-slate-100 '
//                                             value={addComma((value.general?.MoOxideLb * value?.stainless?.moPriceArgus * value.general?.mt / 100).toFixed(2))} onChange={(e) => { }} />
//                                     </div>
//                                     <div className='border-y border-slate-500  border-r bg-slate-100 w-24 flex flex-col justify-center'>
//                                         <span className='title_style bg-customLavender'>Fe</span>
//                                         <input
//                                             type="text"
//                                             className="input_style text-red-600"
//                                             name="fePrice1"
//                                             value={
//                                                 focusedField === "fePrice1"
//                                                     ? value.stainless?.fePrice1 ?? "" // raw while typing
//                                                     : value.stainless?.fePrice1 !== undefined && value.stainless?.fePrice1 !== ""
//                                                         ? addComma(parseFloat(value.stainless.fePrice1).toFixed(2)) // formatted with commas & 2 decimals
//                                                         : "0.00"
//                                             }
//                                             onChange={(e) => handleChange(e, "stainless")}
//                                             onFocus={() => setFocusedField("fePrice1")}
//                                             onBlur={(e) => {
//                                                 setFocusedField(null);
//                                                 let num = parseFloat(e.target.value.replace(/,/g, "")); // remove commas before parsing
//                                                 if (isNaN(num)) num = 0; // default to 0
//                                                 handleChange(
//                                                     {
//                                                         target: {
//                                                             name: e.target.name,
//                                                             value: num.toFixed(2), // store with 2 decimals
//                                                         },
//                                                     },
//                                                     "stainless"
//                                                 );
//                                             }}
//                                         />


//                                     </div>
//                                 </div>
//                             </div>
//                             <div className='justify-start flex'>
//                                 <div className='flex justify-center'>
//                                     <div className='w-24 flex flex-col justify-center'>
//                                         <span className='justify-center text-xs text-slate-500 items-center flex'>{'Lb ' + addComma(((value?.general?.nilme * value?.stainless?.formulaNiPrice / 100) / (value.general?.mt)).toFixed(2))}</span>
//                                     </div>
//                                     <div className='w-24 flex flex-col justify-center'>
//                                         <input type='input' className='input w-full h-7 text-center border-none  cursor-default rounded-none text-red-700 text-xs'
//                                             name='crPriceArgus' value={'Argus ' + value?.stainless?.crPriceArgus + '%'} onChange={(e) => handleChange(e, 'stainless')} />
//                                     </div>
//                                     <div className=' w-24 flex flex-col justify-center'>
//                                         <input type='input' className='input w-full h-7 text-center border-none cursor-default rounded-none text-red-700 text-xs'
//                                             name='moPriceArgus' value={'Argus ' + value?.stainless?.moPriceArgus + '%'} onChange={(e) => handleChange(e, 'stainless')} />
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>
//                         <div className='items-end flex'>
//                             <div className='border border-slate-500 w-24 flex flex-col mb-7'>
//                                 <span className='title_style bg-blue-300'>Ni LME</span>
//                                 <input type='input' className='input_style bg-slate-100 ' value={addComma(value?.general?.nilme)}
//                                     onChange={(e) => { }} />
//                             </div>
//                         </div>
//                     </div>

//                     <div className='items-end flex pt-4'>
//                         <div className='border border-slate-500 w-24 flex flex-col'>
//                             <span className='title_style bg-customOrange'> Formula x Ni</span>
//                             <input
//                                 type="text"
//                                 className="input_style bg-orange-200 text-red-600"
//                                 name="formulaNiPrice"
//                                 value={
//                                     value?.stainless?.formulaNiPrice !== undefined && value.stainless.formulaNiPrice !== ""
//                                         ? value.stainless.formulaNiPrice + "%" // raw while typing
//                                         : "0.00%" // default if empty
//                                 }
//                                 onChange={(e) =>
//                                     handleChange(
//                                         {
//                                             target: {
//                                                 name: e.target.name,
//                                                 value: e.target.value.replace("%", ""), // strip % while typing
//                                             },
//                                         },
//                                         "stainless"
//                                     )
//                                 }
//                                 onBlur={(e) => {
//                                     let num = parseFloat(e.target.value.replace("%", ""));
//                                     if (isNaN(num)) num = 0; // default to 0
//                                     handleChange(
//                                         {
//                                             target: {
//                                                 name: e.target.name,
//                                                 value: num.toFixed(2), // store with 2 decimals
//                                             },
//                                         },
//                                         "stainless"
//                                     );
//                                 }}
//                             />
//                         </div>
//                     </div>
//                     <div className=''>
//                         <div className='items-end flex pt-6 gap-6'>
//                             <div className='border border-slate-500 w-24 flex flex-col'>
//                                 <span className='title_style bg-customLavender'>Sales</span>
//                                 <span className='title_style'>Solids Price:</span>
//                                 <input type='text' className='input_style bg-orange-200 '
//                                     value={addComma((solidsPrice1).toFixed(2))}
//                                     name='formulaNi' onChange={(e) => { }} />
//                             </div>
//                             <div className='border border-slate-500 w-24 flex flex-col'>
//                                 <span className='title_style'>Turnings Price:</span>
//                                 <input type='text' className='input_style bg-orange-200 rounded-none '
//                                     value={addComma((solidsPrice1 * 0.9).toFixed(2))}
//                                     name='formulaNi' onChange={(e) => { }} />
//                             </div>
//                             <div className='border border-slate-500 w-24 flex flex-col'>
//                                 <span className='title_style'>Price/Euro:</span>
//                                 <input type='text' className='input_style bg-customLime'
//                                     value={addComma((solidsPrice1 / value.general?.euroRate).toFixed(2), 'a')}
//                                     name='formulaNi' onChange={(e) => { }} />
//                             </div>
//                         </div>
//                     </div>

//                     <div className='pt-4 text-red-600'>
//                         <p className="text-xs">* Fill in the red and + Formula x Ni</p>
//                         <p className="text-xs">* Fe is calculated automatically</p>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     )
// };

// export default Stainless;
import { useState } from "react";

const Stainless = ({ value, handleChange }) => {
    const [focusedField, setFocusedField] = useState(null);

    const fe = (100 - value?.stainless?.ni - value?.stainless?.cr - value?.stainless?.mo).toFixed(2);
    
    const solidsPrice = value?.stainless?.ni * value?.general?.nilme * value?.stainless?.formulaNiCost / 10000 +
        value?.stainless?.cr * value?.stainless?.crPrice / 100 +
        value?.stainless?.mo * value?.stainless?.moPrice / 100 +
        value?.stainless?.fe * value?.stainless?.fePrice / 100

    const solidsPrice1 = value?.stainless?.ni * value?.general?.nilme / 100 * value?.stainless?.formulaNiPrice / 100 +
        value?.stainless?.cr / 100 * value.general?.chargeCrLb * value.general?.mt * value?.stainless?.crPriceArgus / 100 +
        value?.stainless?.mo / 100 * (value.general?.MoOxideLb * value?.stainless?.moPriceArgus * value.general?.mt / 100) +
        value?.stainless?.fe * value?.stainless?.fePrice1 / 100

    const addComma = (nStr, z) => {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1,$2');
        }
        const symbol = !z ? '$' : '€'
        return (symbol + x1 + x2);
    }

    return (
        <div className='border border-slate-300 p-2 sm:p-3 rounded-lg w-full overflow-x-auto'>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* COST SECTION */}
                <div className="w-full">
                    <p className='text-center text-slate-600 text-base sm:text-lg font-semibold mb-3'>Cost</p>
                    
                    {/* Composition */}
                    <p className='text-center text-slate-600 text-sm font-semibold mb-2'>Composition</p>
                    <div className='overflow-x-auto mb-4'>
                        <div className='flex justify-center min-w-[400px]'>
                            <div className='border border-slate-500 w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style text-xs sm:text-sm'>Ni</span>
                                <input 
                                    type='text' 
                                    className='input_style text-red-700 text-xs sm:text-sm' 
                                    value={value?.stainless?.ni + '%'}
                                    name='ni' 
                                    onChange={(e) => {
                                        handleChange({
                                            target: {
                                                name: e.target.name,
                                                value: e.target.value.replace('%', ''),
                                            },
                                        }, 'stainless');
                                    }}
                                    onBlur={(e) => {
                                        let num = parseFloat(e.target.value.replace("%", ""));
                                        if (isNaN(num)) num = 0;
                                        handleChange(
                                            {
                                                target: {
                                                    name: e.target.name,
                                                    value: num.toFixed(2),
                                                },
                                            },
                                            "stainless"
                                        );
                                    }} 
                                />
                            </div>
                            <div className='border-y border-slate-500 border-r w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style text-xs sm:text-sm'>Cr</span>
                                <input 
                                    type='text' 
                                    className='input_style text-red-700 text-xs sm:text-sm' 
                                    value={value?.stainless?.cr + '%'}
                                    name='cr' 
                                    onChange={(e) => {
                                        handleChange({
                                            target: {
                                                name: e.target.name,
                                                value: e.target.value.replace('%', ''),
                                            },
                                        }, 'stainless');
                                    }}
                                    onBlur={(e) => {
                                        let num = parseFloat(e.target.value.replace("%", ""));
                                        if (isNaN(num)) num = 0;
                                        handleChange(
                                            {
                                                target: {
                                                    name: e.target.name,
                                                    value: num.toFixed(2),
                                                },
                                            },
                                            "stainless"
                                        );
                                    }} 
                                />
                            </div>
                            <div className='border-y border-slate-500 border-r w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style text-xs sm:text-sm'>Mo</span>
                                <input 
                                    type='text' 
                                    className='input_style text-red-700 text-xs sm:text-sm' 
                                    value={value?.stainless?.mo + '%'}
                                    name='mo' 
                                    onChange={(e) => {
                                        handleChange({
                                            target: {
                                                name: e.target.name,
                                                value: e.target.value.replace('%', ''),
                                            },
                                        }, 'stainless');
                                    }}
                                    onBlur={(e) => {
                                        let num = parseFloat(e.target.value.replace("%", ""));
                                        if (isNaN(num)) num = 0;
                                        handleChange(
                                            {
                                                target: {
                                                    name: e.target.name,
                                                    value: num.toFixed(2),
                                                },
                                            },
                                            "stainless"
                                        );
                                    }} 
                                />
                            </div>
                            <div className='border-y border-slate-500 border-r w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style text-xs sm:text-sm'>Fe</span>
                                <input 
                                    type='text' 
                                    className='input_style bg-slate-100 text-xs sm:text-sm' 
                                    value={fe + '%'}
                                    readOnly 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Price */}
                    <p className='text-center text-slate-600 text-sm font-semibold mb-2'>Price</p>
                    <div className='overflow-x-auto mb-4'>
                        <div className='flex justify-center min-w-[400px]'>
                            <div className='border border-slate-500 w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style bg-customLavender text-xs sm:text-sm'>Ni</span>
                                <input 
                                    type='text' 
                                    className='input_style bg-slate-100 text-xs sm:text-sm' 
                                    value={addComma(value.general?.nilme * value.stainless?.formulaNiCost / 100)}
                                    readOnly 
                                />
                            </div>
                            <div className='border-y border-slate-500 border-r w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style bg-customLavender text-xs sm:text-sm'>Cr</span>
                                <input
                                    type="text"
                                    className="input_style text-red-700 text-xs sm:text-sm"
                                    name="crPrice"
                                    value={
                                        focusedField === "crPrice"
                                            ? value.stainless?.crPrice ?? ""
                                            : value.stainless?.crPrice !== undefined && value.stainless?.crPrice !== ""
                                                ? addComma(parseFloat(value.stainless.crPrice).toFixed(2))
                                                : "0.00"
                                    }
                                    onChange={(e) => handleChange(e, "stainless")}
                                    onFocus={() => setFocusedField("crPrice")}
                                    onBlur={(e) => {
                                        setFocusedField(null);
                                        let num = parseFloat(e.target.value);
                                        if (isNaN(num)) num = 0;
                                        handleChange(
                                            {
                                                target: {
                                                    name: e.target.name,
                                                    value: num.toFixed(2),
                                                },
                                            },
                                            "stainless"
                                        );
                                    }}
                                />
                            </div>
                            <div className='border-y border-slate-500 border-r w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style bg-customLavender text-xs sm:text-sm'>Mo</span>
                                <input
                                    type="text"
                                    className="input_style text-red-700 text-xs sm:text-sm"
                                    name="moPrice"
                                    value={
                                        focusedField === "moPrice"
                                            ? value.stainless?.moPrice ?? ""
                                            : value.stainless?.moPrice !== undefined && value.stainless?.moPrice !== ""
                                                ? addComma(parseFloat(value.stainless.moPrice).toFixed(2))
                                                : "0.00"
                                    }
                                    onChange={(e) => handleChange(e, "stainless")}
                                    onFocus={() => setFocusedField("moPrice")}
                                    onBlur={(e) => {
                                        setFocusedField(null);
                                        let num = parseFloat(e.target.value.replace(/,/g, ""));
                                        if (isNaN(num)) num = 0;
                                        handleChange(
                                            {
                                                target: {
                                                    name: e.target.name,
                                                    value: num.toFixed(2),
                                                },
                                            },
                                            "stainless"
                                        );
                                    }}
                                />
                            </div>
                            <div className='border-y border-slate-500 border-r w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style bg-customLavender text-xs sm:text-sm'>Fe</span>
                                <input
                                    type="text"
                                    className="input_style text-red-700 text-xs sm:text-sm"
                                    name="fePrice"
                                    value={
                                        focusedField === "fePrice"
                                            ? value.stainless?.fePrice ?? ""
                                            : value.stainless?.fePrice !== undefined && value.stainless?.fePrice !== ""
                                                ? addComma(parseFloat(value.stainless.fePrice).toFixed(2))
                                                : "0.00"
                                    }
                                    onChange={(e) => handleChange(e, "stainless")}
                                    onFocus={() => setFocusedField("fePrice")}
                                    onBlur={(e) => {
                                        setFocusedField(null);
                                        let num = parseFloat(e.target.value.replace(/,/g, ""));
                                        if (isNaN(num)) num = 0;
                                        handleChange(
                                            {
                                                target: {
                                                    name: e.target.name,
                                                    value: num.toFixed(2),
                                                },
                                            },
                                            "stainless"
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ni LME Display */}
                    <div className='flex justify-center mb-4'>
                        <div className='border border-slate-500 w-24 sm:w-28 flex flex-col'>
                            <span className='title_style bg-blue-300 text-xs sm:text-sm'>Ni LME</span>
                            <input 
                                type='text' 
                                className='input_style bg-slate-100 text-xs sm:text-sm' 
                                value={addComma(value?.general?.nilme)}
                                readOnly 
                            />
                        </div>
                    </div>

                    {/* Formula x Ni */}
                    <div className='flex justify-center mb-4'>
                        <div className='border border-slate-500 w-24 sm:w-28 flex flex-col'>
                            <span className='title_style bg-customOrange text-xs sm:text-sm'>Formula x Ni</span>
                            <input
                                type="text"
                                className="input_style bg-orange-200 text-red-600 text-xs sm:text-sm"
                                name="formulaNiCost"
                                value={
                                    value?.stainless?.formulaNiCost !== undefined && value.stainless.formulaNiCost !== ""
                                        ? value.stainless.formulaNiCost + "%"
                                        : "0.00%"
                                }
                                onChange={(e) =>
                                    handleChange(
                                        {
                                            target: {
                                                name: e.target.name,
                                                value: e.target.value.replace("%", ""),
                                            },
                                        },
                                        "stainless"
                                    )
                                }
                                onBlur={(e) => {
                                    let num = parseFloat(e.target.value.replace("%", ""));
                                    if (isNaN(num)) num = 0;
                                    handleChange(
                                        {
                                            target: {
                                                name: e.target.name,
                                                value: num.toFixed(2),
                                            },
                                        },
                                        "stainless"
                                    );
                                }}
                            />
                        </div>
                    </div>

                    {/* Results */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-4'>
                        <div className='border border-slate-500 flex flex-col'>
                            <span className='title_style bg-customLavender text-xs sm:text-sm'>Cost</span>
                            <span className='title_style text-xs sm:text-sm'>Solids Price:</span>
                            <input 
                                type='text' 
                                className='input_style bg-orange-200 text-xs sm:text-sm'
                                value={addComma(solidsPrice.toFixed(2))}
                                readOnly 
                            />
                        </div>
                        <div className='border border-slate-500 flex flex-col'>
                            <span className='title_style text-xs sm:text-sm'>Turnings Price:</span>
                            <input 
                                type='text' 
                                className='input_style bg-orange-200 text-xs sm:text-sm'
                                value={addComma((solidsPrice * 0.9).toFixed(2))}
                                readOnly 
                            />
                        </div>
                        <div className='border border-slate-500 flex flex-col'>
                            <span className='title_style text-xs sm:text-sm'>Price/Euro:</span>
                            <input 
                                type='text' 
                                className='input_style bg-customLime text-xs sm:text-sm'
                                value={addComma((solidsPrice / value.general?.euroRate).toFixed(2), 'a')}
                                readOnly 
                            />
                        </div>
                    </div>

                    <div className='text-red-600 text-xs'>
                        <p>* Fill in the red and + Formula x Ni</p>
                        <p>* Fe is calculated automatically</p>
                    </div>
                </div>

                {/* SALES SECTION */}
                <div className="w-full">
                    <p className='text-center text-slate-600 text-base sm:text-lg font-semibold mb-3'>Sales</p>
                    
                    {/* Composition (Read-only) */}
                    <p className='text-center text-slate-600 text-sm font-semibold mb-2'>Composition</p>
                    <div className='overflow-x-auto mb-4'>
                        <div className='flex justify-center min-w-[400px]'>
                            <div className='border border-slate-500 w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style text-xs sm:text-sm'>Ni</span>
                                <input 
                                    type='text' 
                                    className='input_style bg-slate-100 text-xs sm:text-sm'
                                    value={value?.stainless?.ni + '%'} 
                                    readOnly 
                                />
                            </div>
                            <div className='border-y border-slate-500 border-r w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style text-xs sm:text-sm'>Cr</span>
                                <input 
                                    type='text' 
                                    className='input_style bg-slate-100 text-xs sm:text-sm'
                                    value={value?.stainless?.cr + '%'} 
                                    readOnly 
                                />
                            </div>
                            <div className='border-y border-slate-500 border-r w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style text-xs sm:text-sm'>Mo</span>
                                <input 
                                    type='text' 
                                    className='input_style bg-slate-100 text-xs sm:text-sm'
                                    value={value?.stainless?.mo + '%'} 
                                    readOnly 
                                />
                            </div>
                            <div className='border-y border-slate-500 border-r w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style text-xs sm:text-sm'>Fe</span>
                                <input 
                                    type='text' 
                                    className='input_style bg-slate-100 text-xs sm:text-sm'
                                    value={value?.stainless?.fe + '%'} 
                                    readOnly 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Price */}
                    <p className='text-center text-slate-600 text-sm font-semibold mb-2'>Price</p>
                    <div className='overflow-x-auto mb-2'>
                        <div className='flex justify-center min-w-[400px]'>
                            <div className='border border-slate-500 w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style bg-customLavender text-xs sm:text-sm'>Ni</span>
                                <input 
                                    type='text' 
                                    className='input_style bg-slate-100 text-xs sm:text-sm' 
                                    value={addComma(value?.general?.nilme * value?.stainless?.formulaNiPrice / 100)}
                                    readOnly 
                                />
                            </div>
                            <div className='border-y border-slate-500 border-r w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style bg-customLavender text-xs sm:text-sm'>Cr</span>
                                <input 
                                    type='text' 
                                    className='input_style bg-slate-100 text-xs sm:text-sm'
                                    value={addComma((value.general?.chargeCrLb * value.general?.mt * value?.stainless?.crPriceArgus / 100).toFixed(2))} 
                                    readOnly 
                                />
                            </div>
                            <div className='border-y border-slate-500 border-r w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style bg-customLavender text-xs sm:text-sm'>Mo</span>
                                <input 
                                    type='text' 
                                    className='input_style bg-slate-100 text-xs sm:text-sm'
                                    value={addComma((value.general?.MoOxideLb * value?.stainless?.moPriceArgus * value.general?.mt / 100).toFixed(2))} 
                                    readOnly 
                                />
                            </div>
                            <div className='border-y border-slate-500 border-r bg-slate-100 w-20 sm:w-24 flex flex-col justify-center'>
                                <span className='title_style bg-customLavender text-xs sm:text-sm'>Fe</span>
                                <input
                                    type="text"
                                    className="input_style text-red-600 text-xs sm:text-sm"
                                    name="fePrice1"
                                    value={
                                        focusedField === "fePrice1"
                                            ? value.stainless?.fePrice1 ?? ""
                                            : value.stainless?.fePrice1 !== undefined && value.stainless?.fePrice1 !== ""
                                                ? addComma(parseFloat(value.stainless.fePrice1).toFixed(2))
                                                : "0.00"
                                    }
                                    onChange={(e) => handleChange(e, "stainless")}
                                    onFocus={() => setFocusedField("fePrice1")}
                                    onBlur={(e) => {
                                        setFocusedField(null);
                                        let num = parseFloat(e.target.value.replace(/,/g, ""));
                                        if (isNaN(num)) num = 0;
                                        handleChange(
                                            {
                                                target: {
                                                    name: e.target.name,
                                                    value: num.toFixed(2),
                                                },
                                            },
                                            "stainless"
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Argus percentages */}
                    <div className='overflow-x-auto mb-4'>
                        <div className='flex justify-center min-w-[400px]'>
                            <div className='w-20 sm:w-24 flex justify-center items-center'>
                                <span className='text-xs text-slate-500'>{'Lb ' + addComma(((value?.general?.nilme * value?.stainless?.formulaNiPrice / 100) / (value.general?.mt)).toFixed(2))}</span>
                            </div>
                            <div className='w-20 sm:w-24 flex justify-center items-center'>
                                <input 
                                    type='text' 
                                    className='input w-full h-7 text-center border-none cursor-default rounded-none text-red-700 text-xs'
                                    name='crPriceArgus' 
                                    value={'Argus ' + value?.stainless?.crPriceArgus + '%'} 
                                    onChange={(e) => handleChange(e, 'stainless')} 
                                />
                            </div>
                            <div className='w-20 sm:w-24 flex justify-center items-center'>
                                <input 
                                    type='text' 
                                    className='input w-full h-7 text-center border-none cursor-default rounded-none text-red-700 text-xs'
                                    name='moPriceArgus' 
                                    value={'Argus ' + value?.stainless?.moPriceArgus + '%'} 
                                    onChange={(e) => handleChange(e, 'stainless')} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ni LME Display */}
                    <div className='flex justify-center mb-4'>
                        <div className='border border-slate-500 w-24 sm:w-28 flex flex-col'>
                            <span className='title_style bg-blue-300 text-xs sm:text-sm'>Ni LME</span>
                            <input 
                                type='text' 
                                className='input_style bg-slate-100 text-xs sm:text-sm'
                                value={addComma(value?.general?.nilme)}
                                readOnly 
                            />
                        </div>
                    </div>

                    {/* Formula x Ni */}
                    <div className='flex justify-center mb-4'>
                        <div className='border border-slate-500 w-24 sm:w-28 flex flex-col'>
                            <span className='title_style bg-customOrange text-xs sm:text-sm'>Formula x Ni</span>
                            <input
                                type="text"
                                className="input_style bg-orange-200 text-red-600 text-xs sm:text-sm"
                                name="formulaNiPrice"
                                value={
                                    value?.stainless?.formulaNiPrice !== undefined && value.stainless.formulaNiPrice !== ""
                                        ? value.stainless.formulaNiPrice + "%"
                                        : "0.00%"
                                }
                                onChange={(e) =>
                                    handleChange(
                                        {
                                            target: {
                                                name: e.target.name,
                                                value: e.target.value.replace("%", ""),
                                            },
                                        },
                                        "stainless"
                                    )
                                }
                                onBlur={(e) => {
                                    let num = parseFloat(e.target.value.replace("%", ""));
                                    if (isNaN(num)) num = 0;
                                    handleChange(
                                        {
                                            target: {
                                                name: e.target.name,
                                                value: num.toFixed(2),
                                            },
                                        },
                                        "stainless"
                                    );
                                }}
                            />
                        </div>
                    </div>

                    {/* Results */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-4'>
                        <div className='border border-slate-500 flex flex-col'>
                            <span className='title_style bg-customLavender text-xs sm:text-sm'>Sales</span>
                            <span className='title_style text-xs sm:text-sm'>Solids Price:</span>
                            <input 
                                type='text' 
                                className='input_style bg-orange-200 text-xs sm:text-sm'
                                value={addComma((solidsPrice1).toFixed(2))}
                                readOnly 
                            />
                        </div>
                        <div className='border border-slate-500 flex flex-col'>
                            <span className='title_style text-xs sm:text-sm'>Turnings Price:</span>
                            <input 
                                type='text' 
                                className='input_style bg-orange-200 rounded-none text-xs sm:text-sm'
                                value={addComma((solidsPrice1 * 0.9).toFixed(2))}
                                readOnly 
                            />
                        </div>
                        <div className='border border-slate-500 flex flex-col'>
                            <span className='title_style text-xs sm:text-sm'>Price/Euro:</span>
                            <input 
                                type='text' 
                                className='input_style bg-customLime text-xs sm:text-sm'
                                value={addComma((solidsPrice1 / value.general?.euroRate).toFixed(2), 'a')}
                                readOnly 
                            />
                        </div>
                    </div>

                    <div className='text-red-600 text-xs'>
                        <p>* Fill in the red and + Formula x Ni</p>
                        <p>* Fe is calculated automatically</p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Stainless;