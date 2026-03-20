export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full items-center justify-center bg-surface-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img
            src="/CognaiteIcon.svg"
            alt="Cognaite"
            width={40}
            height={40}
            className="mx-auto mb-3"
          />
          <h1 className="text-xl font-semibold text-surface-950">CognaiteHub</h1>
        </div>
        <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
