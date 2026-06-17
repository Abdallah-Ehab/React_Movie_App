import Navbar from '@/components/layout/Navbar'

export default function Account() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="px-8 py-10 max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-semibold">Account</h1>
      </main>
    </div>
  )
}
