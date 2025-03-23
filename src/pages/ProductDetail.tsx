
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type Item = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
  created_at: string;
  updated_at: string;
};

// Mock data for products - in a real app, this would be fetched from an API
const mockItems = [
  {
    id: 1,
    name: "Premium Basmati Rice",
    description: "Long-grain premium basmati rice, perfect for biryanis and pulaos. Grown using traditional farming methods.",
    price: 120,
    category: "Rice",
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-4.0.3",
    created_at: "2023-01-15T10:30:00",
    updated_at: "2023-01-15T10:30:00"
  },
  {
    id: 2,
    name: "Organic Brown Rice",
    description: "Nutrient-rich brown rice with natural bran layer. High in fiber and essential nutrients.",
    price: 95,
    category: "Rice",
    stock: 45,
    image_url: "https://images.unsplash.com/photo-1551779074-a80da6208053?ixlib=rb-4.0.3",
    created_at: "2023-01-16T11:20:00",
    updated_at: "2023-01-16T11:20:00"
  },
  {
    id: 3,
    name: "Kashmir Red Chillies",
    description: "Authentic Kashmiri red chillies known for their vibrant color and mild heat. Perfect for curries and marinades.",
    price: 85,
    category: "Chillies",
    stock: 30,
    image_url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?ixlib=rb-4.0.3",
    created_at: "2023-01-18T09:15:00",
    updated_at: "2023-01-18T09:15:00"
  },
  {
    id: 4,
    name: "Green Chilli Powder",
    description: "Finely ground green chilli powder with intense flavor and heat. Use sparingly in dishes.",
    price: 75,
    category: "Chillies",
    stock: 35,
    image_url: "https://images.unsplash.com/photo-1638957773782-f9614ba79d81?ixlib=rb-4.0.3",
    created_at: "2023-01-20T14:45:00",
    updated_at: "2023-01-20T14:45:00"
  },
  {
    id: 5,
    name: "Premium Turmeric Powder",
    description: "High-curcumin turmeric powder, freshly ground from farm-grown turmeric. Vibrant color and rich aroma.",
    price: 110,
    category: "Turmeric",
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1615485291236-f80a2542fcd3?ixlib=rb-4.0.3",
    created_at: "2023-01-25T16:30:00",
    updated_at: "2023-01-25T16:30:00"
  },
  {
    id: 6,
    name: "Raw Turmeric Root",
    description: "Fresh turmeric roots with deep orange flesh. Can be used fresh or dried for various health benefits.",
    price: 90,
    category: "Turmeric",
    stock: 25,
    image_url: "https://images.unsplash.com/photo-1576092761339-fd2d6b077114?ixlib=rb-4.0.3",
    created_at: "2023-01-28T13:20:00",
    updated_at: "2023-01-28T13:20:00"
  },
  {
    id: 7,
    name: "Raw Groundnuts",
    description: "Unprocessed groundnuts with shells intact. Perfect for roasting or making homemade peanut butter.",
    price: 65,
    category: "Groundnut",
    stock: 60,
    image_url: "https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-4.0.3",
    created_at: "2023-02-01T10:15:00",
    updated_at: "2023-02-01T10:15:00"
  },
  {
    id: 8,
    name: "Groundnut Oil",
    description: "Cold-pressed groundnut oil with rich flavor and high smoke point. Ideal for cooking and deep-frying.",
    price: 220,
    category: "Groundnut",
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?ixlib=rb-4.0.3",
    created_at: "2023-02-05T11:45:00",
    updated_at: "2023-02-05T11:45:00"
  },
  {
    id: 9,
    name: "Toor Dal",
    description: "Split pigeon peas with high protein content. Essential ingredient in sambar and many Indian dishes.",
    price: 110,
    category: "Pulses",
    stock: 55,
    image_url: "https://images.unsplash.com/photo-1612257999756-9ce2cb138816?ixlib=rb-4.0.3",
    created_at: "2023-02-10T09:30:00",
    updated_at: "2023-02-10T09:30:00"
  },
  {
    id: 10,
    name: "Moong Dal",
    description: "Split green gram legumes that cook quickly. Light and easy to digest, perfect for soups and stews.",
    price: 95,
    category: "Pulses",
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1616684000067-36952fde56ec?ixlib=rb-4.0.3",
    created_at: "2023-02-15T14:20:00",
    updated_at: "2023-02-15T14:20:00"
  },
  {
    id: 11,
    name: "Dried Onions",
    description: "Dehydrated onion chunks that can be stored for months. Rehydrate before using in cooking.",
    price: 60,
    category: "Storage Crops",
    stock: 70,
    image_url: "https://images.unsplash.com/photo-1596031708648-31e51c97de64?ixlib=rb-4.0.3",
    created_at: "2023-02-20T16:45:00",
    updated_at: "2023-02-20T16:45:00"
  },
  {
    id: 12,
    name: "Garlic Bulbs",
    description: "Long-lasting garlic bulbs with strong flavor. Store in a cool, dry place for extended shelf life.",
    price: 75,
    category: "Storage Crops",
    stock: 65,
    image_url: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?ixlib=rb-4.0.3",
    created_at: "2023-02-25T11:30:00",
    updated_at: "2023-02-25T11:30:00"
  }
];

export default function ProductDetail() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    // Find the product in our mock data
    if (productId) {
      const foundProduct = mockItems.find(item => item.id === parseInt(productId));
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // Product not found, navigate back to products page
        toast.error("Product not found");
        navigate("/products");
      }
    }
  }, [productId, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const addToCart = () => {
    if (product) {
      // In a real app, this would update a cart state or call an API
      toast.success(`Added ${quantity} ${product.name} to cart`);
    }
  };

  const formattedDate = product ? new Date(product.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  if (!product) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Button 
        variant="ghost" 
        onClick={handleGoBack} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image Section */}
        <div className="rounded-xl overflow-hidden bg-white p-2 border shadow-sm">
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full object-cover rounded-lg aspect-square"
          />
        </div>
        
        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="mr-2">{product.category}</Badge>
              <p className="text-sm text-muted-foreground">Added on {formattedDate}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h2 className="text-2xl font-semibold">₹{product.price}</h2>
            <p className={`mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-2">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="mr-4">Quantity:</span>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="mx-4 min-w-10 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
            </div>
            
            <Button 
              size="lg" 
              onClick={addToCart}
              disabled={product.stock === 0}
              className="w-full"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Total: ₹{(product.price * quantity).toFixed(2)}
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium text-lg mb-2">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                <p>{product.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">ID</h4>
                <p>#{product.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Added</h4>
                <p>{formattedDate}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                <p>{new Date(product.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
