import Link from 'next/link';
interface Product {
  id: string;
  title: string;
}

export default function ProductsPage() {
  const products: Product[] = [
    {
      id: '12321312312',
      title: 'Table',
    },
    {
      id: '222222222',
      title: 'Chair',
    },
  ];
  return (
    <div className='flex flex-col items-center gap-6 text-center sm:items-start sm:text-left'>
      <h1 className='max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50'>
        This is a products page
      </h1>
      <ul>
        {products.map((product) => {
          return (
            <li key={product.id}>
              <Link href={`/products/${product.id}/edit/`}>
                This is product with id {product.id}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
