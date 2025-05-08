import React, { useState, useEffect } from 'react';
import { collection, query, where, getCountFromServer, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        todayBookings: 0,
        thisMonthBookings: 0,
        tourStats: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Total bookings
                const totalQuery = query(collection(db, 'bookings'));
                const totalSnapshot = await getCountFromServer(totalQuery);

                // Today's bookings
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayQuery = query(
                    collection(db, 'bookings'),
                    where('createdAt', '>=', today)
                );
                const todaySnapshot = await getCountFromServer(todayQuery);

                // This month's bookings
                const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const monthQuery = query(
                    collection(db, 'bookings'),
                    where('createdAt', '>=', firstDayOfMonth)
                );
                const monthSnapshot = await getCountFromServer(monthQuery);

                // Get all bookings to calculate tour statistics
                const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
                const bookingsData = bookingsSnapshot.docs.map(doc => doc.data());

                // Calculate tour statistics
                const tourCounts = {};
                bookingsData.forEach(booking => {
                    const tourTitle = booking.tourTitle || 'Unknown Tour';
                    tourCounts[tourTitle] = (tourCounts[tourTitle] || 0) + 1;
                });

                // Convert to array format for the chart
                const tourStats = Object.keys(tourCounts).map(tour => ({
                    tour,
                    count: tourCounts[tour]
                }));

                // Sort by count (descending)
                tourStats.sort((a, b) => b.count - a.count);

                setStats({
                    totalBookings: totalSnapshot.data().count,
                    todayBookings: todaySnapshot.data().count,
                    thisMonthBookings: monthSnapshot.data().count,
                    tourStats
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-6">Loading dashboard...</div>;
    }

    // Generate dynamic colors for the chart based on number of tours
    const generateChartColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = (i * (360 / count)) % 360;
            colors.push(`hsla(${hue}, 70%, 50%, 0.7)`);
            colors.push(`hsla(${hue}, 70%, 50%, 1)`);
        }
        return colors;
    };

    const chartColors = generateChartColors(stats.tourStats.length);

    const chartData = {
        labels: stats.tourStats.map(tour => tour.tour),
        datasets: [
            {
                label: 'Bookings by Tour',
                data: stats.tourStats.map(tour => tour.count),
                backgroundColor: chartColors.filter((_, i) => i % 2 === 0), // Even indices for background
                borderColor: chartColors.filter((_, i) => i % 2 !== 0),    // Odd indices for border
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <h3 className="text-base sm:text-lg font-medium text-gray-500">Total Bookings</h3>
                    <p className="text-2xl sm:text-3xl font-bold mt-2">{stats.totalBookings}</p>
                </div>
                <div className="bg-white p-6 sm:p-6 rounded-lg shadow">
                    <h3 className="text-base sm:text-lg font-medium text-gray-500">Today's Bookings</h3>
                    <p className="text-2xl sm:text-3xl font-bold mt-2">{stats.todayBookings}</p>
                </div>
                <div className="bg-white p-6 sm:p-6 rounded-lg shadow">
                    <h3 className="text-base sm:text-lg font-medium text-gray-500">This Month</h3>
                    <p className="text-2xl sm:text-3xl font-bold mt-2">{stats.thisMonthBookings}</p>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Bookings by Tour</h2>
                <div className="h-64">
                    {stats.tourStats.length > 0 ? (
                        <Pie 
                            data={chartData} 
                            options={{ 
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'right',
                                    }
                                }
                            }} 
                        />
                    ) : (
                        <p className="text-gray-500 text-center py-8">No booking data available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;