import { supabase } from "../supabase";

export interface Product {
  id?: string;
  name: string;
  farm: string;
  price: string;
  available: string;
  image: string;
  tag?: string;
  tagColor?: string;
}

export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("mushroom_products")
      .select("*");
    
    if (!error && data) {
      callback(data as Product[]);
    }
  };

  fetchProducts();

  const channel = supabase
    .channel("products_channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "mushroom_products" },
      () => {
        fetchProducts();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
