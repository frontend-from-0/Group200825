export  default async function ProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  return (
    <div className='flex flex-col items-center gap-6 text-center sm:items-start sm:text-left'>
      <h1 className='max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50'>
        This is an edit product page for product {slug}
      </h1>
    </div>
  );
}
