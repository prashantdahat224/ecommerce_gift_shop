// WishlistPage.jsx 
export default function WishListPage() { 
   
 
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {wishlist.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
