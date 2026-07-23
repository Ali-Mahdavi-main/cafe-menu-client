import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-400">۴۰۴</h1>
      <p className="text-gray-500 mt-2">صفحه‌ای که دنبالش بودید پیدا نشد.</p>
      <Link to="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
        بازگشت به داشبورد
      </Link>
    </div>
  );
}