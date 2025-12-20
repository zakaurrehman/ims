'use client';

import { useState, useEffect, useCallback } from 'react';

// Metal prices configuration
// Note: For live LME data, you'll need an API key from metals-api.com or metalpriceapi.com
// Current implementation uses indicative market prices

const METALS = {
    nickel: { name: 'Nickel', symbol: 'Ni', unit: 'USD/MT' },
    copper: { name: 'Copper', symbol: 'Cu', unit: 'USD/MT' }
};

// Approximate current market prices (updated periodically)
// These are indicative prices - for live data, integrate with metals-api.com
const getIndicativePrices = () => {
    // Add small random variation to simulate market movement
    const variation = () => (Math.random() - 0.5) * 0.02; // ±1% variation

    return {
        nickel: {
            ...METALS.nickel,
            price: 15800 * (1 + variation()), // ~$15,800/MT
            change: (Math.random() - 0.5) * 200,
            changePercent: (Math.random() - 0.5) * 1.5
        },
        copper: {
            ...METALS.copper,
            price: 9100 * (1 + variation()), // ~$9,100/MT
            change: (Math.random() - 0.5) * 100,
            changePercent: (Math.random() - 0.5) * 1.2
        }
    };
};

export default function useMetalPrices(refreshInterval = 30 * 60 * 1000) {
    const [prices, setPrices] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchPrices = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const metalPrices = getIndicativePrices();

            setPrices(metalPrices);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err.message);
            console.error('Metal prices fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch and interval refresh
    useEffect(() => {
        fetchPrices();

        const interval = setInterval(fetchPrices, refreshInterval);
        return () => clearInterval(interval);
    }, [fetchPrices, refreshInterval]);

    // Format price for display
    const formatPrice = useCallback((price, decimals = 2) => {
        if (price === null || price === undefined) return '—';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(price);
    }, []);

    return {
        prices,
        loading,
        error,
        lastUpdated,
        refresh: fetchPrices,
        formatPrice,
        metals: METALS
    };
}
