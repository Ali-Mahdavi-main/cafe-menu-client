import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

export default function AdminCafesListPage() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch('/admin/cafes')
      .then(setCafes)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) return <div className="p-8 text-center">در حال بارگذاری...</div>;
  if (error) return <div className="p-8 text-center text-red-600">خطا: {error.message}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">لیست کافه‌ها</h1>
        <div className="flex gap-3">
          <Link
            to="/admin/create-cafe"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            ساخت کافه جدید
          </Link>
          <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
            خروج
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="text-right px-4 py-3">نام کافه</th>
              <th className="text-right px-4 py-3">نام کاربری</th>
              <th className="text-right px-4 py-3">تلفن</th>
              <th className="text-right px-4 py-3">آدرس</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cafes.map((cafe) => (
              <tr key={cafe.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{cafe.name}</td>
                <td className="px-4 py-3">{cafe.userName}</td>
                <td className="px-4 py-3">{cafe.phone || '-'}</td>
                <td className="px-4 py-3 max-w-xs truncate">{cafe.address || '-'}</td>
                <td className="px-4 py-3 text-left">
                  <button
                    onClick={() => navigate(`/admin/cafes/${cafe.id}/edit`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    ویرایش
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}