import DotMatrixLoader from '@/components/DotMatrixLoader'

export default function Loading() {
  return (
    <main className="loading-screen" aria-busy="true">
      <DotMatrixLoader label="Loading page" />
    </main>
  )
}
