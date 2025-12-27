'use client';
import { useContext, useEffect, useState, useCallback } from 'react';
import Customtable from '../contracts/newTable';
import MyDetailsModal from './modals/dataModal.js'
import { SettingsContext } from "../../../contexts/useSettingsContext";
import MonthSelect from '../../../components/monthSelect';
import Toast from '../../../components/toast.js'
import { InvoiceContext } from "../../../contexts/useInvoiceContext";
import { ContractsContext } from "../../../contexts/useContractsContext";
import { ExpensesContext } from "../../../contexts/useExpensesContext";
import Spinner from '../../../components/spinner';
import { UserAuth } from "../../../contexts/useAuthContext"
import { loadData, loadInvoice, loadStockDataPerDescription, filteredArray, sortArr, getD } from '../../../utils/utils'
import Spin from '../../../components/spinTable';
import { EXD } from './excel'
import dateFormat from "dateformat";
import { getTtl } from '../../../utils/languages';
import DateRangePicker from '../../../components/dateRangePicker';
import Modal from '../../../components/modal';
import DlayedResponse from './modals/delayedResponse';
import Image from 'next/image';
import Tooltip from '../../../components/tooltip';
// import EditableCell from '../../../components/table/EditableCell';
import useInlineEdit from '../../../hooks/useInlineEdit';
import { useRouter, useSearchParams } from 'next/navigation';
import EditableCell from '../../../components/table/inlineEditing/EditableCell';
import EditableSelectCell from '../../../components/table/inlineEditing/EditableSelectCell';
import { updateInvoiceField } from '../../../utils/utils';
import { useGlobalSearch } from '../../../contexts/useGlobalSearchContext';


const Invoices = () => {

	const { invoicesData, setValueInv, valueInv, isOpen, setIsOpen, setInvoicesData } = useContext(InvoiceContext);
	const { settings, dateSelect, setDateYr, setLoading, loading, ln } = useContext(SettingsContext);
	const { blankExpense } = useContext(ExpensesContext);
	const { uidCollection } = UserAuth();
	const { setValueCon } = useContext(ContractsContext);
	const router = useRouter();
	const searchParams = useSearchParams();
	const [alertArr, setAlertArr] = useState([]);
	const [openAlert, setOpenAlert] = useState(true)
	const [filteredData, setFilteredData] = useState([])
	const [highlightId, setHighlightId] = useState(null)
		const { upsertSourceItems } = useGlobalSearch();
		const [isEditMode, setIsEditMode] = useState(false);

	const gQ = (z, y, x) => settings?.[y]?.[y]?.find(q => q.id === z)?.[x] || '';



	// Inline editing hook
	const { updateField } = useInlineEdit('invoices', setInvoicesData);

	// Handle inline cell save
	const handleCellSave = useCallback(async (rowData, field, value) => {
		const originalItem = invoicesData.find(i => i.id === rowData.id);
		if (originalItem) {
			await updateField(originalItem, field, value);
		}
	}, [invoicesData, updateField]);

	// Handle openId from URL (from global search) - highlight row only
	useEffect(() => {
		const openId = searchParams.get('openId');
		if (openId && invoicesData.length > 0) {
			const item = invoicesData.find(i => i.id === openId);
			if (item) {
				// Highlight the row
				setHighlightId(openId);
				setTimeout(() => setHighlightId(null), 3000);
				// Clear the URL parameter
				router.replace('/invoices', { scroll: false });
			}
		}
	}, [searchParams, invoicesData]);

	useEffect(() => {

		const Load = async () => {
			setLoading(true)
			let dt = await loadData(uidCollection, 'invoices', dateSelect);

			dt = dt.map(z => ({
				...z, container: z.productsDataInvoice.map(x => x.container).join(' '),
				totalPrepayment: parseFloat(z.totalPrepayment)
			}))

			setInvoicesData(dt)
			setFilteredData(dt)

			let invArr = []
			let tmpArr = dt.filter(z => z.invType === '1111' && !z.cnORfl)
			tmpArr.forEach(z => {

				let date1 = z.shipData?.eta?.endDate;
				if (!date1) return;

				const date = new Date(date1);

				date.setDate(date.getDate() + 14);
				const today = new Date();

				// Compare if the new date is greater than today
				if (date < today) {
					if (z.alert !== undefined && z.alert) {
						invArr.push(z);
					} else if (z.alert === undefined) {
						invArr.push({ ...z, alert: true });
					}
				}
			})
			setOpenAlert(true)
			setAlertArr(invArr)
			setLoading(false)
		}

		Load();
	}, [dateSelect])
useEffect(() => {
  if (!invoicesData || !invoicesData.length || Object.keys(settings).length === 0) {
    upsertSourceItems('invoices', []);
    return;
  }

  const items = invoicesData.map(inv => ({
    key: `invoice_${inv.id}`,
    route: '/invoices',
    rowId: inv.id,

    title: `Invoice • ${String(inv.invoice ?? '').padStart(4, '0')}`,
    subtitle: `${gQ(inv.client, 'Client', 'nname') || ''} • ${inv.container || ''} • ${inv.pol || ''}-${inv.pod || ''}`,

    searchText: [
      inv.invoice,
      gQ(inv.client, 'Client', 'nname'),
      inv.container,
      inv.pol,
      inv.pod,
      inv.packing,
      inv.order,
    ].filter(Boolean).join(' ')
  }));

  upsertSourceItems('invoices', items);
}, [invoicesData, settings]);




	const setInvStatus = (z) => {
		let q = z.row.original;

		return !q.final && !q.final ? 'Draft' :
			q.final && !q.canceled ? 'Final' :
				q.final && q.canceled ? 'Canceled' : ''
	}


	const getprefixInv = (x) => {
		let q = x.row.original;

		return (q.invType === '1111' || q.invType === 'Invoice') ? '' :
			(q.invType === '2222' || q.invType === 'Credit Note') ? 'CN' : 'FN'
	}

	const percent = (x) => {
		let q = x.row.original;
		return (q.invType !== '1111' && q.invType !== "Invoice") ? '-' : x.getValue() === '' ? '' : x.getValue() + '%'
	}

	let showAmount = (x) => {
  const isoCurrency =
    settings.Currency?.Currency?.find(c => c.id === x.row.original.cur)?.cur
    || 'USD'; // safe fallback

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: isoCurrency,
    minimumFractionDigits: 2
  }).format(x.getValue());
};
	const aaa = (x) => {
		console.log(x)
	}
	let propDefaults = Object.keys(settings).length === 0 ? [] : [
		{ accessorKey: 'opDate', header: getTtl('Operation Time', ln), cell: (props) => <p>{dateFormat(props.getValue(), 'dd-mmm-yy HH:MM')}</p> },
		{ accessorKey: 'lstSaved', header: getTtl('Last Saved', ln), cell: (props) => <p>{dateFormat(props.getValue(), 'dd-mmm-yy HH:MM')}</p> },
		{ accessorKey: 'order', header: getTtl('PO', ln) + '#', cell: (props) => <p>{props.row.original.poSupplier.order}</p> },
		{ accessorKey: 'invoice', header: getTtl('Invoice', ln), cell: (props) => <p>{(String(props.getValue()).toString()).padStart(4, "0") + getprefixInv(props)}</p> },
		{
			accessorKey: 'date', header: getTtl('Date', ln), cell: (props) => <p>{dateFormat(props.row.original.final ? props.getValue() : props.getValue(), 'dd-mmm-yy')}</p>,
			meta: {
				filterVariant: 'dates',
			},
			filterFn: 'dateBetweenFilterFn'
		},
		{
			accessorKey: 'invoiceStatus', header: getTtl('Status', ln), cell: (props) => <p
				className={`${setInvStatus(props) === 'Draft' ? 'text-[var(--endeavour)]' : setInvStatus(props) === 'Final' ? 'text-green-600' : 'text-red-600'} 
			p-1.5 rounded-xl bg-[var(--selago)] px-2 justify-center flex font-medium`}>{setInvStatus(props)}</p>
		},
	{
  accessorKey: 'client',
  header: getTtl('Consignee', ln),
  cell: EditableSelectCell,
  meta: {
    filterVariant: 'selectClient',
    options: settings.Client?.Client?.map(c => ({
      value: c.id,
      label: c.nname
    })) ?? []
  }
},

		{
  accessorKey: 'shpType',
  header: getTtl('Shipment', ln),
  cell: EditableSelectCell,
  meta: {
    options: settings.Shipment?.Shipment?.map(s => ({
      value: s.id,
      label: s.shpType
    })) ?? []
  }
},

		{ accessorKey: 'origin', header: getTtl('Origin', ln) },
		{
  accessorKey: 'delTerm',
  header: getTtl('Delivery Terms', ln),
  cell: EditableSelectCell,
  meta: {
    options: settings['Delivery Terms']?.['Delivery Terms']?.map(d => ({
      value: d.id,
      label: d.delTerm
    })) ?? []
  }
},

{ accessorKey: 'pol', header: getTtl('POL', ln), cell: EditableCell },
{ accessorKey: 'pod', header: getTtl('POD', ln), cell: EditableCell },
{ accessorKey: 'packing', header: getTtl('Packing', ln), cell: EditableCell },

		{ accessorKey: 'cur', header: getTtl('Currency', ln), },
		{ accessorKey: 'invType', header: getTtl('Invoice Type', ln), },
		{
			accessorKey: 'totalAmount', header: getTtl('Total Amount', ln), cell: (props) => <p>{showAmount(props)}</p>,
			meta: {
				filterVariant: 'range',
			},
		},
		{ accessorKey: 'percentage', header: getTtl('Prepayment', ln), cell: (props) => <p>{percent(props)}</p> },
		{
			accessorKey: 'totalPrepayment', header: getTtl('Prepaid Amount', ln), cell: (props) => <p>{showAmount(props)}</p>,
			meta: {
				filterVariant: 'range',
			},
		},
		{
			accessorKey: 'balanceDue', header: getTtl('Balance', ln), cell: (props) => <p>{showAmount(props)}</p>,
			meta: {
				filterVariant: 'range',
			},
		},
		{ accessorKey: 'container', header: getTtl('Container No', ln), cell: (props) => <span className='text-wrap w-40 md:w-64 flex'>{props.getValue()}</span> },
		{
			accessorKey: 'etd', header: 'ETD', cell: (props) => <span>{props.row.original.shipData?.etd?.startDate ?
				dateFormat(props.row.original.shipData?.etd?.startDate, 'dd-mmm-yy') : ''}</span>
		},
		{
			accessorKey: 'eta', header: 'ETA', cell: (props) => <span>{props.row.original.shipData?.eta?.startDate ?
				dateFormat(props.row.original.shipData?.eta?.startDate, 'dd-mmm-yy') : ''}</span>
		},
		{
			accessorKey: 'completed', header: 'Completed',
			cell: (props) => <span>{props.getValue() ? <Image
				src="/check.png"
				width={18}
				height={18}
				alt="True"
			/> : <Image
				src="/close.png"
				width={18}
				height={18}
				alt="False"
			/>}</span>, enableColumnFilter: false,
		},
	];

	let invisible = ['lstSaved', 'order', 'shpType', 'invType',
		'percentage', 'totalPrepayment', 'balanceDue', 'container'].reduce((acc, key) => {
			acc[key] = false;
			return acc;
		}, {});


	const getFormatted = (arr) => {  //convert id's to values

		let newArr = []
		const gQ = (z, y, x) => settings[y][y].find(q => q.id === z)?.[x] || ''

		arr.forEach(row => {

			let formattedRow = row.final ? {
				...row,
				client: row.client.nname,
				cur: row.cur.cur
			} :
				{
					...row,
					client: gQ(row.client, 'Client', 'nname'),
					shpType: gQ(row.shpType, 'Shipment', 'shpType'),
					origin: gQ(row.origin, 'Origin', 'origin'),
					delTerm: gQ(row.delTerm, 'Delivery Terms', 'delTerm'),
					pol: gQ(row.pol, 'POL', 'pol'),
					pod: gQ(row.pod, 'POD', 'pod'),
					packing: gQ(row.packing, 'Packing', 'packing'),
					cur: gQ(row.cur, 'Currency', 'cur'),
					invType: gQ(row.invType, 'InvTypes', 'invType'),
				}

			newArr.push(formattedRow)
		})

		return newArr;
	}

	const SelectRow = async (row) => {

		setLoading(true)
		let data = await loadInvoice(uidCollection, 'contracts', row.poSupplier)
		setValueCon(data)

		let dt = [...row.productsDataInvoice]
		dt = await Promise.all(
			dt.map(async (x) => {
				let stocks = await loadStockDataPerDescription(uidCollection, x.stock,
					x.description ? x.description : x.descriptionId)
				stocks = filteredArray(stocks)
				let total = 0;
				stocks.forEach(obj => {
					total += obj.type === 'in' ? parseFloat(obj.qnty) : parseFloat(obj.qnty) * -1
				})

				return {
					...x,
					stockValue: total,
				};
			})
		);

		let tmpRow = invoicesData.find(x => x.id === row.id)
		tmpRow = { ...tmpRow, productsData: data.productsData, productsDataInvoice: dt }

		setValueInv(tmpRow);
		!tmpRow.final && setDateYr(tmpRow.dateRange?.startDate?.substring(0, 4));
		blankExpense();
		setIsOpen(true);
		setLoading(false)
	};

  const onCellUpdate = async ({ rowIndex, columnId, value }) => {
  const row = invoicesData[rowIndex];
  if (!row?.id) return;

  // 🚫 Do not allow editing finalized invoices
  if (row.final) return;

  const prev = invoicesData;
  const next = prev.map((x, i) =>
    i === rowIndex ? { ...x, [columnId]: value } : x
  );
  setInvoicesData(next);

  try {
    await updateInvoiceField(
      uidCollection,
      row.id,
      row.dateRange?.startDate ?? row.date,
      { [columnId]: value }
    );
  } catch (e) {
    console.error(e);
    setInvoicesData(prev); // revert on error
  }
};
	return (
			<div className="container mx-auto px-0 pb-8 md:pb-0 mt-16 md:mt-0">
			{Object.keys(settings).length === 0 ? <Spinner /> :
				<>

					<Toast />
					{/*loading && <Spin />*/}
					<div className="border border-[var(--selago)] rounded-xl p-4 mt-8 shadow-md relative">
						<div className='flex items-center justify-between flex-wrap pb-2'>
							<div className="text-3xl p-1 pb-2 text-[var(--port-gore)] font-semibold">{getTtl('Invoices', ln)}</div>
							<div className='flex group'>
								<DateRangePicker />
								<Tooltip txt='Select Dates Range' />
							</div>

						</div>

						<Customtable data={sortArr(invoicesData, 'invoice')} columns={propDefaults} SelectRow={SelectRow}
							invisible={invisible}
							onCellUpdate={onCellUpdate}
							excellReport={EXD(invoicesData.filter(x => filteredData.map(z => z.id).includes(x.id)),
								settings, getTtl('Invoices', ln), ln)}
							setFilteredData={setFilteredData}
							highlightId={highlightId}
						/>

					</div>

					{alertArr.length ? <div className='mt-14'>
						<div className="text-lg font-medium leading-5 text-[var(--port-gore)] border-2
						 border-[var(--selago)] p-2 max-w-4xl mb-10 rounded-xl shadow-md"
						>
							<div className='text-[var(--port-gore)] '>
								<span className='p-2'>Notification for delayed response</span>
								<DlayedResponse alertArr={alertArr} setAlertArr={setAlertArr} />
							</div>

						</div >
					</div> : ''}

					{valueInv && <MyDetailsModal isOpen={isOpen} setIsOpen={setIsOpen}
						title={`${getTtl('Contract No', ln)}: ${valueInv.poSupplier.order}`} />}

					{alertArr.length ? <Modal isOpen={openAlert} setIsOpen={setOpenAlert} title='Notification for delayed response' w='max-w-4xl'>
						<DlayedResponse alertArr={alertArr} setAlertArr={setAlertArr} />
					</Modal> : null}
				</>}
		</div>
	);
};

export default Invoices;
