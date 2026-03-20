export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full items-center justify-center bg-surface-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500">
            <span className="text-lg font-bold text-white">C</span>
          </div>
          <h1 className="text-xl font-semibold text-surface-950">CognaiteHub</h1>
        </div>
        <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
