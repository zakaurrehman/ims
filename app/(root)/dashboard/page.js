'use client';
import { useContext, useEffect, useState } from 'react';
import Spinner from '@components/spinner';
import { UserAuth } from "@contexts/useAuthContext"
import { SettingsContext } from "@contexts/useSettingsContext";
import Toast from '@components/toast.js'
import Spin from '@components/spinTable';
import { BarChart, BarChartContracts, PieChart, HorizontalBar, LineChartSmall } from './charts';
//import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { loadData, groupedArrayInvoice, getInvoices } from '@utils/utils'
import { setMonthsInvoices, calContracts, frmNum } from './funcs'
import { getTtl } from '@utils/languages';
import DateRangePicker from '@components/dateRangePicker';
import CurrencyWidget from '@components/Dashboard/CurrencyWidget';
import MetalPricesWidget from '@components/Dashboard/MetalPricesWidget';


ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  // ChartDataLabels
);

const loadInvoices = async (uidCollection, con) => {

  let yrs = [...new Set(con.invoices.map(x => x.date.substring(0, 4)))]
  let arrTmp = [];
  for (let i = 0; i < yrs.length; i++) {
    let yr = yrs[i]
    let tmpDt = [...new Set(con.invoices.filter(x => x.date.substring(0, 4) === yr).map(y => y.invoice))]
    let obj = { yr: yr, arrInv: tmpDt }
    arrTmp.push(obj)
  }

  let tmpInv = await getInvoices(uidCollection, 'invoices', arrTmp)
  return groupedArrayInvoice(tmpInv)

}

const Dash = () => {

  const { settings, dateSelect, setLoading, loading, ln, setToast } = useContext(SettingsContext);
  const [dataInvoices, setDataInvoices] = useState([])
  const [dataContracts, setDataContracts] = useState([])
  const [dataExpenses, setDataExpenses] = useState([])
  const [dataPL, setDataPL] = useState([])
  const [dataPieSupps, setDataPieSupps] = useState([])
  const [dataPieClnts, setDataPieClnts] = useState([])
  const [dataDebt, setDataDebt] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { uidCollection } = UserAuth();

  useEffect(() => {

    const Load = async () => {
      setLoading(true)

      let dtContracts = await loadData(uidCollection, 'contracts', {
        start: `${selectedYear}-01-01`,
        end: `${selectedYear}-12-31`,
      });
      let dtConTmp = [...dtContracts]
      dtConTmp = await Promise.all(
        dtConTmp.map(async (x) => {
          const Invoices = await loadInvoices(uidCollection, x)
          return {
            ...x,
            invoicesData: Invoices,
          };
        })
      );

      let tmpData = calContracts(dtConTmp, settings)
      setDataContracts(tmpData.accumulatedPmnt)
      setDataExpenses(tmpData.accumulatedExp)
      setDataPieSupps(tmpData.pieArrSupps)


      //sum together the contract + expenses 
      const summedArr = Object.keys(tmpData.accumulatedPmnt).reduce((acc, key) => {
        acc[key] = tmpData.accumulatedPmnt[key] + tmpData.accumulatedExp[key];
        return acc;
      }, {});

      let arrInvoices = setMonthsInvoices(dtConTmp, settings)
   
      setDataInvoices(arrInvoices.accumulatedPmnt)
      setDataPieClnts(arrInvoices.pieArrClnts)
      //  setDataDebt(arrInvoices.accumulatedActualPmnt)
      
      //calculate P&L
      const tmpPL = Object.keys(arrInvoices.accumulatedPmnt).reduce((acc, key) => {
        acc[key] = arrInvoices.accumulatedPmnt[key] - summedArr[key];
        return acc;
      }, {});


      // Separate expenses and rename contracts to purchases
      setDataExpenses(tmpData.accumulatedExp);
      setDataContracts(tmpData.accumulatedPmnt); // Rename to purchases

      // Add sections for Sales Contracts, Expenses, and Purchase Contracts
      const salesContracts = tmpData.salesContracts || [];
      const expenses = tmpData.accumulatedExp || [];
      const purchaseContracts = tmpData.accumulatedPmnt || [];

      setDataPL(Object.values(tmpPL));
      setLoading(false)
    }

    Object.keys(settings).length !== 0 && Load();


  }, [selectedYear, settings])

  let cons = Object.keys(dataPieSupps).length
  const currentYear = dateSelect?.start?.substring(0, 4) || new Date().getFullYear();
  
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="xl:container mx-auto px-2 md:px-6 xl:px-8 pb-6 md:pb-0 min-h-screen md:pl-[260px] bg-gradient-to-br from-[var(--selago)]/20 via-[var(--white)] to-[var(--rock-blue)]/5">
      {Object.keys(settings).length === 0 ? <Spinner /> :
        <>
          <Toast />
          {loading && <Spin />}
          
          {/* Header Section */}
          <div className="pt-10 pb-3">
            <div className='flex items-center justify-between flex-wrap gap-4'>
                <div className="flex items-center gap-3">
                <div className="w-1.5 h-10 bg-gradient-to-b from-[var(--endeavour)] to-[var(--chathams-blue)] rounded-full"></div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--port-gore)] tracking-tight">{getTtl('Dashboard', ln)}</h1>
                  <p className="text-sm text-[var(--regent-gray)] mt-1">Financial overview and analytics</p>
                </div>
              </div>
              <div className='flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-2xl shadow-lg border border-[var(--selago)]'>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 rounded-xl text-sm text-[var(--port-gore)] font-semibold cursor-pointer hover:bg-[var(--rock-blue)]/30 transition-colors"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Main Chart - Total Revenue */}
          <div className='mb-4'>
            <div className='bg-white rounded-2xl shadow-xl border border-[var(--selago)] overflow-hidden hover:shadow-2xl transition-all duration-300'>
              <div className='p-4 min-w-[260px] min-h-[160px]'>
                <div className='flex items-center justify-between mb-4'>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--endeavour)] to-[var(--chathams-blue)] rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className='text-[var(--port-gore)] font-bold text-lg'>Total Revenue</h3>
                  </div>
                  <div className='flex items-center gap-2 px-4 py-2 bg-[var(--selago)] rounded-xl text-sm text-[var(--port-gore)] font-semibold cursor-pointer hover:bg-[var(--rock-blue)]/30 transition-colors'>
                    {selectedYear}
                  </div>
                </div>
                <div className='h-[220px] min-w-[240px] min-h-[140px]'>
                  <Bar data={BarChartContracts(dataContracts, dataInvoices, '#103a7a', '#9fb8d4').obj} options={BarChartContracts().options} />
                </div>
                {/* Legend */}
                <div className='flex items-center justify-center gap-6 mt-4 pt-3 border-t border-[var(--selago)]'>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-[#103a7a]'></div>
                    <span className='text-sm text-[var(--regent-gray)] font-medium'>Total Income</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-[#9fb8d4]'></div>
                    <span className='text-sm text-[var(--regent-gray)] font-medium'>Total Outcome</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards Row */}
          {/* Horizontal Layout for Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            {/* P&L Card */}
            <div className='bg-gradient-to-br from-[var(--port-gore)] to-[var(--bunting)] rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300'>
              <div className='p-4 relative min-w-[260px] min-h-[160px]'>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className='relative z-10'>
                  <div className='flex items-center justify-between mb-4'>
                    <span className='text-white/80 text-sm font-medium'>{getTtl('P&L', ln)} - $M</span>
                    <div className={`px-3 py-1 rounded-lg text-xs font-bold ${Object.values(dataPL).reduce((acc, currentValue) => acc + currentValue, 0) > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {getTtl('Profit', ln)}
                    </div>
                  </div>
                  <div className='text-2xl font-bold text-white mb-3'>
                    {frmNum(Object.values(dataPL).reduce((acc, currentValue) => acc + currentValue, 0) / 1000000)}M
                  </div>
                  <div className='h-[60px] min-w-[220px] min-h-[60px]'>
                    <Line data={LineChartSmall(dataPL, 'rgba(159, 184, 212, 1)').obj} options={LineChartSmall().options} />
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Card */}
            <div className='bg-gradient-to-br from-[var(--endeavour)] to-[var(--chathams-blue)] rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300'>
              <div className='p-4 relative min-w-[260px] min-h-[160px]'>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className='relative z-10'>
                  <div className='flex items-center justify-between mb-4'>
                    <span className='text-white/80 text-sm font-medium'>{getTtl('Invoices', ln)} - $M</span>
                    <div className='px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400'>
                      {getTtl('Sales', ln)}
                    </div>
                  </div>
                  <div className='text-2xl font-bold text-white mb-3'>
                    {frmNum(Object.values(dataInvoices).reduce((acc, currentValue) => acc + currentValue, 0) / 1000000)}M
                  </div>
                  <div className='h-[60px] min-w-[220px] min-h-[60px]'>
                    <Line data={LineChartSmall(dataInvoices, 'rgba(255, 255, 255, 0.9)').obj} options={LineChartSmall().options} />
                  </div>
                </div>
              </div>
            </div>

            {/* Costs Card */}
            <div className='bg-gradient-to-br from-[var(--chathams-blue)] to-[var(--port-gore)] rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300'>
              <div className='p-4 relative min-w-[260px] min-h-[160px]'>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className='relative z-10'>
                  <div className='flex items-center justify-between mb-4'>
                    <span className='text-white/80 text-sm font-medium'>{getTtl('Contracts & Expenses', ln)} - $M</span>
                    <div className='px-3 py-1 rounded-lg text-xs font-bold bg-red-500/20 text-red-400'>
                      {getTtl('Costs', ln)}
                    </div>
                  </div>
                  <div className='text-2xl font-bold text-white mb-3'>
                    {frmNum((Object.values(dataInvoices).reduce((acc, currentValue) => acc + currentValue, 0) -
                      Object.values(dataPL).reduce((acc, currentValue) => acc + currentValue, 0)) / 1000000)}M
                  </div>
                  <div className='h-[60px] min-w-[220px] min-h-[60px]'>
                    <Line data={LineChartSmall(dataContracts, 'rgba(159, 184, 212, 0.9)').obj} options={LineChartSmall().options} />
                  </div>
                </div>
              </div>
            </div>
                 <div className='bg-gradient-to-br from-[var(--endeavour)] to-[var(--chathams-blue)] rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300'>
                 <div className='p-4 relative min-w-[260px] min-h-[160px]'>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className='relative z-10'>
                <div className='flex items-center justify-between mb-4'>
                  <span className='text-white/80 text-sm font-medium'>Sales Contracts - $M</span>
                  <div className='px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400'>
                    Sales
                  </div>
                </div>
                <div className='text-2xl font-bold text-white mb-3'>
                  ${Object.values(dataContracts).reduce((acc, val) => acc + val, 0).toFixed(2)}M
                </div>
                <div className='h-[60px] min-w-[220px] min-h-[60px]'>
                  <Line data={LineChartSmall(dataContracts, 'rgba(255, 255, 255, 0.9)').obj} options={LineChartSmall().options} />
                </div>
              </div>
            </div>
          </div>

          {/* Expenses Section */}
          <div className='bg-gradient-to-br from-[var(--port-gore)] to-[var(--bunting)] rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300'>
            <div className='p-4 relative min-w-[260px] min-h-[160px]'>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className='relative z-10'>
                <div className='flex items-center justify-between mb-4'>
                  <span className='text-white/80 text-sm font-medium'>Expenses - $M</span>
                  <div className='px-3 py-1 rounded-lg text-xs font-bold bg-red-500/20 text-red-400'>
                    Costs
                  </div>
                </div>
                <div className='text-2xl font-bold text-white mb-3'>
                  ${Object.values(dataExpenses).reduce((acc, val) => acc + val, 0).toFixed(2)}M
                </div>
                <div className='h-[60px] min-w-[220px] min-h-[60px]'>
                  <Line data={LineChartSmall(dataExpenses, 'rgba(159, 184, 212, 1)').obj} options={LineChartSmall().options} />
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Contracts Section */}
          <div className='bg-gradient-to-br from-[var(--chathams-blue)] to-[var(--port-gore)] rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300'>
            <div className='p-4 relative min-w-[260px] min-h-[160px]'>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className='relative z-10'>
                <div className='flex items-center justify-between mb-4'>
                  <span className='text-white/80 text-sm font-medium'>Purchase Contracts - $M</span>
                  <div className='px-3 py-1 rounded-lg text-xs font-bold bg-green-500/20 text-green-400'>
                    Purchases
                  </div>
                </div>
                <div className='text-2xl font-bold text-white mb-3'>
                  ${Object.values(dataInvoices).reduce((acc, val) => acc + val, 0).toFixed(2)}M
                </div>
                <div className='h-[60px] min-w-[220px] min-h-[60px]'>
                  <Line data={LineChartSmall(dataInvoices, 'rgba(159, 184, 212, 0.9)').obj} options={LineChartSmall().options} />
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Currency Widget + Metal Prices + Horizontal Bar Charts Row */}
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 mb-6'>
            {/* Currency Exchange Widget */}
            <CurrencyWidget />

            {/* Metal Prices Widget */}
            <MetalPricesWidget />

            {/* Consignees Chart */}
            <div className='bg-white rounded-2xl shadow-xl border border-[var(--selago)] overflow-hidden hover:shadow-2xl transition-all duration-300'>
              <div className='p-3 min-w-[240px] min-h-[140px]'>
                <div className='flex items-center gap-2 mb-3'>
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--endeavour)] to-[var(--rock-blue)] rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className='text-[var(--port-gore)] font-bold text-base'>Consignees - $</h3>
                </div>
                <div className={cons < 10 ? 'h-[180px] min-w-[240px] min-h-[140px]' : cons > 10 && cons < 15 ? 'h-[260px] min-w-[240px] min-h-[140px]' : 'h-[320px] min-w-[240px] min-h-[140px]'}>
                  <Bar data={HorizontalBar(dataPieClnts, '#0366ae').obj} options={HorizontalBar().options} />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl shadow-xl border border-[var(--selago)] overflow-hidden hover:shadow-2xl transition-all duration-300'>
              <div className='p-3 min-w-[240px] min-h-[140px]'>
                <div className='flex items-center gap-2 mb-3'>
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--chathams-blue)] to-[var(--port-gore)] rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className='text-[var(--port-gore)] font-bold text-base'>Contracts - $</h3>
                </div>
                <div className={cons < 10 ? 'h-[180px] min-w-[240px] min-h-[140px]' : cons > 10 && cons < 15 ? 'h-[260px] min-w-[240px] min-h-[140px]' : 'h-[320px] min-w-[240px] min-h-[140px]'}>
                  <Bar data={HorizontalBar(dataPieSupps, '#103a7a').obj} options={HorizontalBar().options} />
                </div>
              </div>
            </div>
          </div>
 
          {/* Sales Contracts Section */}
     

        </>}
    </div>
  )
}

export default Dash

/*

 <p className='text-slate-600 text-[0.6rem] font-medium'>Debt Balance:</p>
                    <p className={`text-[0.6rem]
                    ${Object.values(dataInvoices).reduce((acc, currentValue) => acc + currentValue, 0) -
                        Object.values(dataDebt).reduce((acc, currentValue) => acc + currentValue, 0) > 0 ?
                        'text-red-600' : 'text-emerald-600'} font-medium
                    `}> {frmNum(Object.values(dataInvoices).reduce((acc, currentValue) => acc + currentValue, 0) -
                          Object.values(dataDebt).reduce((acc, currentValue) => acc + currentValue, 0)
                        )}</p>

                        */