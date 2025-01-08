export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 space-y-4">
      <h1 className="text-4xl font-bold">Coding Showcase Platform</h1>
      <div className="flex space-x-4">
        <a href="/creator" className="bg-blue-500 text-white px-6 py-2 rounded">Creator</a>
        <a href="/viewer" className="bg-green-500 text-white px-6 py-2 rounded">Viewer</a>
      </div>
    </main>
  );
}
