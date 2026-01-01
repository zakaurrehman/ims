'use client';
import { useContext, useEffect, useState, useCallback } from 'react';
import Customtable from './newTable';
import { TbLayoutGridAdd } from 'react-icons/tb';
import { IoAnalyticsOutline } from "react-icons/io5";
import MyDetailsModal from './modals/dataModal.js'
import { SettingsContext } from "../../../contexts/useSettingsContext";
import { ContractsContext } from "../../../contexts/useContractsContext";
import { ExpensesContext } from "../../../contexts/useExpensesContext";
import { InvoiceContext } from "../../../contexts/useInvoiceContext";
import MonthSelect from '../../../components/monthSelect';
import Toast from '../../../components/toast.js'
import ModalCopyInvoice from '../../../components/modalCopyInvoice';
//import EditableCell from '../../../components/table/EditableCell';
import useInlineEdit from '../../../hooks/useInlineEdit';

import { loadData, sortArr, getD, saveDataSettings } from '../../../utils/utils'
import Spinner from '../../../components/spinner';
import { UserAuth } from "../../../contexts/useAuthContext"
import Spin from '../../../components/spinTable';
import { EXD } from './excel'
import dateFormat from "dateformat";
import { getTtl } from '../../../utils/languages';
import DateRangePicker from '../../../components/dateRangePicker';

import Tooltip from '../../../components/tooltip';
import { useRouter, useSearchParams } from 'next/navigation';
import Modal from '../../../components/modal';
import DlayedResponse from './modals/delayedResponse';
import Image from 'next/image';
import Tltip from '../../../components/tlTip';
import EditableCell from '../../../components/table/inlineEditing/EditableCell';
import EditableSelectCell from '../../../components/table/inlineEditing/EditableSelectCell';
import { updateContractField } from '../../../utils/utils';
import { useGlobalSearch } from '../../../contexts/useGlobalSearchContext';



const Contracts = () => {

	const { settings, dateSelect, setDateYr, setLoading, loading, ln, compData, updateCompanyData } = useContext(SettingsContext);
	const { valueCon, setValueCon, contractsData, isOpenCon, setIsOpenCon,
		addContract, setContractsData } = useContext(ContractsContext);
	const { blankInvoice, setIsInvCreationCNFL } = useContext(InvoiceContext);
	const { blankExpense } = useContext(ExpensesContext);
	const { uidCollection } = UserAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [alertArr, setAlertArr] = useState([]);
	const [openAlert, setOpenAlert] = useState(true)
	const [filteredData, setFilteredData] = useState([])
	const [highlightId, setHighlightId] = useState(null)
	const { upsertSourceItems } = useGlobalSearch();


	// Inline editing hook
	const { updateField } = useInlineEdit('contracts', setContractsData);

	// Handle inline cell save
	const handleCellSave = useCallback(async (rowData, field, value) => {
		// Find original data (not formatted)
		const originalItem = contractsData.find(c => c.id === rowData.id);
		if (originalItem) {
			await updateField(originalItem, field, value);
		}
	}, [contractsData, updateField]);

	// Handle openId from URL (from global search) - highlight row only
	useEffect(() => {
		const openId = searchParams.get('openId');
		if (openId && contractsData.length > 0) {
			const item = contractsData.find(c => c.id === openId);
			if (item) {
				// Highlight the row
				setHighlightId(openId);
				setTimeout(() => setHighlightId(null), 3000);
				// Clear the URL parameter
				router.replace('/contracts', { scroll: false });
			}
		}
	}, [searchParams, contractsData]);

	useEffect(() => {

		const Load = async () => {
			setLoading(true)
			let dt = await loadData(uidCollection, 'contracts', dateSelect);
			setContractsData(dt)
			setFilteredData(dt)

			//Alert///
			let invArr = []
			let tmpArr = dt.filter(z => z.poInvoices.length === 0)
			tmpArr.forEach(z => {

				let date1 = z.dateRange?.endDate;
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
			//Alert///

			setLoading(false)
		}

		Load();
	}, [dateSelect])
useEffect(() => {
  if (!contractsData || !contractsData.length || Object.keys(settings).length === 0) {
    upsertSourceItems('contracts', []);
    return;
  }

  const items = contractsData.map(c => ({
    key: `contract_${c.id}`,
    route: '/contracts',
    rowId: c.id,

    title: `Contract • PO ${c.order || ''}`,
    subtitle: `${gQ(c.supplier, 'Supplier', 'nname') || ''} • ${c.pol || ''}-${c.pod || ''}`,

    searchText: [
      c.order,
      gQ(c.supplier, 'Supplier', 'nname'),
      c.pol,
      c.pod,
      c.packing,
      c.contType,
      c.size,
    ].filter(Boolean).join(' ')
  }));

  upsertSourceItems('contracts', items);
}, [contractsData, settings]);
	const gQ = (z, y, x) => settings[y][y].find(q => q.id === z)?.[x] || ''

	const showQTY = (x) => {

		return x.row.original.productsData.length !== 0 ? new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 1
		}).format(x.row.original.productsData.reduce((sum, item) => sum + parseInt(item.qnty, 10), 0)) +
			' ' + gQ(x.row.original.qTypeTable, 'Quantity', 'qTypeTable') : '-'

	}

	let propDefaults = Object.keys(settings).length === 0 ? [] : [
		{ accessorKey: 'opDate', header: getTtl('Operation Time', ln), cell: (props) => <p>{dateFormat(props.getValue(), 'dd-mmm-yy HH:MM')}</p> },
		{ accessorKey: 'lstSaved', header: getTtl('Last Saved', ln), cell: (props) => <p>{dateFormat(props.getValue(), 'dd-mmm-yy HH:MM')}</p> },
		{ accessorKey: 'order', header: getTtl('PO', ln) + '#' },
		{
			accessorKey: 'date', header: getTtl('Date', ln), cell: (props) => <p>{dateFormat(props.getValue(), 'dd-mmm-yy')}</p>,
			meta: {
				filterVariant: 'dates',
			}, filterFn: 'dateBetweenFilterFn'
		},
{
  accessorKey: 'supplier',
  header: getTtl('Supplier', ln),
  cell: EditableSelectCell,
  meta: {
    filterVariant: 'selectSupplier',
    options: settings.Supplier?.Supplier?.map(s => ({
      value: s.id,
      label: s.nname
    })) ?? []
  }
},

		{
			accessorKey: 'originSupplier', header: 'Original supplier',
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

		{
  accessorKey: 'origin',
  header: getTtl('Origin', ln),
  cell: EditableSelectCell,
  meta: {
    options: settings.Origin?.Origin?.map(o => ({
      value: o.id,
      label: o.origin
    })) ?? []
  }
},
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
{ accessorKey: 'contType', header: getTtl('Container Type', ln), cell: EditableCell },
{ accessorKey: 'size', header: getTtl('Size', ln), cell: EditableCell },

		{ accessorKey: 'deltime', header: getTtl('Delivery Time', ln), cell: EditableCell },

		{
  accessorKey: 'cur',
  header: getTtl('Currency', ln),
  cell: (props) => <span>{gQ(props.getValue(), 'Currency', 'cur')}</span>
},

		{ accessorKey: 'qTypeTable', header: getTtl('QTY', ln), cell: (props) => <span>{showQTY(props)}</span> },
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
			/>}</span>,
			enableColumnFilter: false
		},
	];

	let invisible = ['opDate', 'lstSaved', 'shpType', 'originSupplier',
		'size', 'qTypeTable', 'cur'].reduce((acc, key) => {
			acc[key] = false;
			return acc;
		}, {});


	const getFormatted = (arr) => {  //convert id's to values

		let newArr = []
		const gQ = (z, y, x) => settings[y][y].find(q => q.id === z)?.[x] || ''

		arr.forEach(row => {
			let formattedRow = {
				...row,
				supplier: gQ(row.supplier, 'Supplier', 'nname'),
				originSupplier: gQ(row.originSupplier, 'Supplier', 'nname'),
				shpType: gQ(row.shpType, 'Shipment', 'shpType'),
				origin: gQ(row.origin, 'Origin', 'origin'),
				delTerm: gQ(row.delTerm, 'Delivery Terms', 'delTerm'),
				pol: gQ(row.pol, 'POL', 'pol'),
				pod: gQ(row.pod, 'POD', 'pod'),
				packing: gQ(row.packing, 'Packing', 'packing'),
				contType: gQ(row.contType, 'Container Type', 'contType'),
				size: gQ(row.size, 'Size', 'size'),
				deltime: gQ(row.deltime, 'Delivery Time', 'deltime'),
				cur: gQ(row.cur, 'Currency', 'cur'),
				//		qTypeTable: gQ(row.qTypeTable, 'Quantity', 'qTypeTable'),

			}

			newArr.push(formattedRow)
		})

		return newArr
	}


	const SelectRow = (row) => {

		let itm = contractsData.find(x => x.id === row.id)
		itm = itm.finalSRemarks == null ? { ...itm, finalSRemarks: [] } : itm

		setValueCon(itm);
		blankInvoice();
		setDateYr(row.dateRange?.startDate?.substring(0, 4));
		blankExpense();
		setIsInvCreationCNFL(false);
		setIsOpenCon(true);
	};

	const addNewContract = () => {
		addContract()
		blankInvoice()
	}

	const onCellUpdate = async ({ rowIndex, columnId, value }) => {
  const row = contractsData[rowIndex];
  if (!row?.id) return;

  // 🚫 Do not allow editing completed contracts
  if (row.completed) return;

  const prev = contractsData;
  const next = prev.map((x, i) =>
    i === rowIndex ? { ...x, [columnId]: value } : x
  );
  setContractsData(next);

  try {
    await updateContractField(
      uidCollection,
      row.id,
      row.dateRange?.startDate ?? row.date,
      { [columnId]: value }
    );
  } catch (e) {
    console.error(e);
    setContractsData(prev); // revert on failure
  }
};
	return (
		<div className="container mx-auto px-0 pb-8 md:pb-0 mt-16 md:mt-0">
			{Object.keys(settings).length === 0 ? <Spinner /> :
				<>
					<Toast />
					<ModalCopyInvoice />
					{/* {loading && <Spin />} */}
					<div className="border border-[var(--selago)] rounded-2xl p-4 mt-8 shadow-lg bg-white relative">
						<div className='flex items-center justify-between flex-wrap pb-2'>
							<div className="text-2xl p-1 pb-2 font-semibold text-[var(--port-gore)]"> {getTtl('Contracts', ln)} </div>
							<div className='flex group'>
								<DateRangePicker />
								<Tooltip txt='Select Dates Range' />

								{/*<MonthSelect />*/}
							</div>

						</div>

<Customtable data={sortArr(contractsData, 'order')}
 columns={propDefaults} SelectRow={SelectRow}
 							invisible={invisible}
							excellReport={EXD(contractsData.filter(x => filteredData.map(z => z.id).includes(x.id)),
								settings, getTtl('Contracts', ln), ln)}
							setFilteredData={setFilteredData}
							highlightId={highlightId} onCellUpdate={onCellUpdate} />
					</div>
					<div className="text-left pt-6 flex gap-4 md:ml-72">
						<Tltip direction='bottom' tltpText='Create new Contract'>
							<button
								type="button"
								onClick={addNewContract}
								className="text-white bg-gradient-to-r from-[var(--endeavour)] to-[var(--chathams-blue)] hover:opacity-90 focus:outline-none font-medium rounded-xl 
															 text-sm px-4 py-2.5 text-center shadow-lg gap-1.5 items-center flex transition-all"
							>
								<TbLayoutGridAdd className="scale-110" />
								{getTtl('New Contract', ln)}
							</button>
						</Tltip>
						<Tltip direction='bottom' tltpText='Quantities analysis report'>
							<button
								type="button"
								onClick={() => router.push('/analysis')}
								className="text-white bg-gradient-to-r from-[var(--endeavour)] to-[var(--chathams-blue)] hover:opacity-90 focus:outline-none font-medium rounded-xl 
															 text-sm px-4 py-2.5 text-center shadow-lg gap-1.5 items-center flex transition-all"
							>
								<IoAnalyticsOutline className="scale-110" />
								{getTtl('Weight Analysis', ln)}
							</button>
						</Tltip>
					</div>


					{alertArr.length ? <div className='mt-8'>
						<div className="text-lg font-medium leading-5 text-[var(--port-gore)] border
						 border-[var(--selago)] p-3 max-w-2xl mb-10 rounded-2xl shadow-lg bg-white"
						>
							<div className='text-[var(--port-gore)]'>
								<span className='p-2'>Notification for delayed response</span>
								<DlayedResponse alertArr={alertArr} setAlertArr={setAlertArr} />
							</div>

						</div >
					</div>
						: ''}

					{valueCon && <MyDetailsModal isOpen={isOpenCon} setIsOpen={setIsOpenCon}
						title={!valueCon.id ? getTtl('New Contract', ln) : `${getTtl('Contract No', ln)}: ${valueCon.order}`} />}

					{alertArr.length ?
						<Modal isOpen={openAlert} setIsOpen={setOpenAlert} title='Notification for delayed response' w='max-w-2xl'>
							<DlayedResponse alertArr={alertArr} setAlertArr={setAlertArr} />
						</Modal>
						:
						null}

				</>}
		</div>
	);

};

export default Contracts;

