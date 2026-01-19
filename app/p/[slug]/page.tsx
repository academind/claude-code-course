type Params = Promise<{ slug: string }>;

export default async function PublicNote({ params }: { params: Params }) {
  const { slug } = await params;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Public Note</h1>
      <p className="text-gray-600">Viewing: {slug}</p>
    </div>
  );
}
