import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'bookings'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const bookingsData = [];
            querySnapshot.forEach((doc) => {
                bookingsData.push({ id: doc.id, ...doc.data() });
            });
            setBookings(bookingsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await deleteDoc(doc(db, 'bookings', id));
                toast.success('Booking deleted successfully');
            } catch {
                toast.error('Error deleting booking');
            }
        }
    };

    const filteredBookings = bookings.filter(booking =>
        booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.tourTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.whatsapp.includes(searchTerm)
    );

    if (loading) return <Loading />;

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold">Bookings Management</h1>
                <input
                    type="text"
                    placeholder="Search bookings..."
                    className="px-4 py-2 border rounded-lg w-full md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3  text-xs font-medium text-gray-500 uppercase textleft" >Name</th>
                                <th className="px-3 py-3 text-xs font-medium text-gray-500 uppercase textleft">Tour</th>
                                <th className="px-3 py-3 text-xs font-medium text-gray-500 uppercase textleft">Date</th>
                                <th className="px-3 py-3 text-xs font-medium text-gray-500 uppercase textleft">Persons</th>
                                <th className="px-3 py-3 text-xs font-medium text-gray-500 uppercase textleft">Contact</th>
                                <th className="px-3 py-3 text-xs font-medium text-gray-500 uppercase textleft">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="px-3 py-4 textleft whitespace-nowrap">{booking.fullName}</td>
                                    <td className="px-3 py-4 textleft whitespace-nowrap">{booking.tourTitle}</td>
                                    <td className="px-3 py-4 textleft whitespace-nowrap">
                                        {new Date(booking.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-3 py-4 textleft whitespace-nowrap">{booking.numberOfPersons}</td>
                                    <td className="px-3 py-4 textleft whitespace-nowrap">
                                        <div>📱 {booking.whatsapp}</div>
                                        <div>✉️ {booking.email}</div>
                                    </td>
                                    <td className="px-6 py-4 textleft whitespace-nowrap">
                                        <button
                                            onClick={() => handleDelete(booking.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Bookings;