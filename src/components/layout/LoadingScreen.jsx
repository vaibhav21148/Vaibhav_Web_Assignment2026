export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="size-10 border-4 border-[#2463eb] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading ResolvIT…</p>
      </div>
    </div>
  )
}
