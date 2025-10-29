import { getProducts } from '@/lib/data';
import { Product } from '@/types/product';
import HomeClient from './components/HomeClient';

// This function runs at build time - SSG
export default async function Home() {
  // Fetch products at build time
  const products = await getProducts();
  
  return <HomeClient initialProducts={products} />;
}

// Ensure this page is statically generated
export const dynamic = 'force-static';