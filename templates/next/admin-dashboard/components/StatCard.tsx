interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
}

export function StatCard({ title, value, change, positive }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`flex items-center space-x-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {positive ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          )}
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center">
          <div className={`w-full bg-gray-200 rounded-full h-2 ${positive ? 'bg-green-200' : 'bg-red-200'}`}>
            <div
              className={`h-2 rounded-full ${positive ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: positive ? '70%' : '30%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
