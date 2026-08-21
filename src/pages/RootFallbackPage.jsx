export default function RootFallbackPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">منو پیدا نشد</h1>
        <p className="text-gray-500 mb-6">
          لینک منویی که وارد کردید معتبر نیست یا منقضی شده است.
        </p>
        <div className="border-t pt-5 text-sm text-gray-600">
          <p className="mb-1">برای پشتیبانی تماس بگیرید:</p>
          <p className="font-semibold text-gray-800">علی مهدوی</p>
          <p dir="ltr" className="font-semibold text-gray-800">09147578212</p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <a
          referrerPolicy="origin"
          target="_blank"
          href="https://trustseal.enamad.ir/?id=7409176&Code=IzQz3pFc84IStgN0GEPkppcNx8RhZYEb"
        >
          <img
            referrerPolicy="origin"
            src="https://trustseal.enamad.ir/logo.aspx?id=7409176&Code=IzQz3pFc84IStgN0GEPkppcNx8RhZYEb"
            alt="نماد اعتماد الکترونیکی"
            style={{ cursor: 'pointer' }}
          />
        </a>
      </div>
    </div>
  );
}