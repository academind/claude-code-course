type Params = Promise<{ id: string }>;

export default async function NoteEditor({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Note Editor</h1>
      <p className="text-gray-600">Editing note: {id}</p>
    </div>
  );
}
