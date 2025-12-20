'use client';

import useMetalPrices from '../../hooks/useMetalPrices';
import { HiRefresh, HiCube, HiCubeTransparent } from 'react-icons/hi';
import { TbArrowUpRight, TbArrowDownRight } from 'react-icons/tb';

const metalIcons = {
    nickel: HiCube,
    copper: HiCubeTransparent,
};

const metalColors = {
    nickel: 'from-slate-400 to-slate-600',
    copper: 'from-orange-400 to-orange-600',
};

export default function MetalPricesWidget() {
    const { prices, loading, error, lastUpdated, refresh, formatPrice } = useMetalPrices();

    const formatTime = (date) => {
        if (!date) return '';
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatChange = (change, percent) => {
        if (change === undefined || change === null) return null;
        const isPositive = change >= 0;
        return {
            value: `${isPositive ? '+' : ''}${change.toFixed(2)}`,
            percent: `${isPositive ? '+' : ''}${percent?.toFixed(2) || '0.00'}%`,
            isPositive
        };
    };

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-xl border border-[var(--selago)] p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[var(--port-gore)] font-bold text-lg">Metal Prices (LME)</h3>
                    <button onClick={refresh} className="p-2 hover:bg-[var(--selago)] rounded-lg transition-colors">
                        <HiRefresh className="w-5 h-5 text-[var(--regent-gray)]" />
                    </button>
                </div>
                <div className="text-red-500 text-sm">Failed to load prices. Click refresh to try again.</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-[var(--selago)] overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
                            <HiCube className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-[var(--port-gore)] font-bold text-lg">Metal Prices</h3>
                            <p className="text-xs text-[var(--regent-gray)]">
                                LME Spot Prices (USD/MT)
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {lastUpdated && (
                            <span className="text-xs text-[var(--regent-gray)]">
                                {formatTime(lastUpdated)}
                            </span>
                        )}
                        <button
                            onClick={refresh}
                            disabled={loading}
                            className={`p-2 hover:bg-[var(--selago)] rounded-lg transition-colors ${loading ? 'animate-spin' : ''}`}
                        >
                            <HiRefresh className="w-5 h-5 text-[var(--regent-gray)]" />
                        </button>
                    </div>
                </div>

                {/* Metal Price Cards */}
                <div className="space-y-4">
                    {['nickel', 'copper'].map((metalKey) => {
                        const Icon = metalIcons[metalKey];
                        const metal = prices?.[metalKey];
                        const change = metal ? formatChange(metal.change, metal.changePercent) : null;

                        return (
                            <div
                                key={metalKey}
                                className="p-4 bg-gradient-to-r from-[var(--selago)]/50 to-transparent rounded-xl hover:from-[var(--selago)] transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${metalColors[metalKey]} rounded-xl flex items-center justify-center shadow-lg`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-[var(--port-gore)]">
                                                {metal?.name || metalKey.charAt(0).toUpperCase() + metalKey.slice(1)}
                                            </p>
                                            <p className="text-xs text-[var(--regent-gray)]">
                                                {metal?.symbol || ''} - {metal?.unit || 'USD/MT'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {loading ? (
                                            <div className="space-y-2">
                                                <div className="w-24 h-6 bg-[var(--selago)] animate-pulse rounded"></div>
                                                <div className="w-16 h-4 bg-[var(--selago)] animate-pulse rounded ml-auto"></div>
                                            </div>
                                        ) : metal ? (
                                            <>
                                                <p className="text-xl font-bold text-[var(--port-gore)]">
                                                    {formatPrice(metal.price)}
                                                </p>
                                                {change && (
                                                    <div className={`flex items-center justify-end gap-1 text-sm ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                        {change.isPositive ? (
                                                            <TbArrowUpRight className="w-4 h-4" />
                                                        ) : (
                                                            <TbArrowDownRight className="w-4 h-4" />
                                                        )}
                                                        <span className="font-medium">{change.value}</span>
                                                        <span className="text-xs">({change.percent})</span>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-lg text-[var(--regent-gray)]">—</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Note */}
                <div className="mt-4 pt-4 border-t border-[var(--selago)]">
                    <p className="text-xs text-[var(--regent-gray)] text-center">
                        Prices from London Metal Exchange
                    </p>
                </div>
            </div>
        </div>
    );
}
