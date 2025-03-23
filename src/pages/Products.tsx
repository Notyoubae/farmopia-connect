
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Mock data for products based on the provided database schema
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

// Get unique categories for filter
const categories = [...new Set(mockItems.map(item => item.category))];

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

export default function Products() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [items, setItems] = useState<Item[]>(mockItems);
  const [cart, setCart] = useState<{ item: Item; quantity: number }[]>([]);

  // Filter and sort items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "price_low") {
      return a.price - b.price;
    } else if (sortBy === "price_high") {
      return b.price - a.price;
    } else if (sortBy === "latest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  });

  const addToCart = (item: Item) => {
    const existingItem = cart.find(cartItem => cartItem.item.id === item.id);
    
    if (existingItem) {
      // Check if adding one more would exceed stock
      if (existingItem.quantity >= item.stock) {
        toast.error("Cannot add more items. Stock limit reached.");
        return;
      }
      
      setCart(cart.map(cartItem => 
        cartItem.item.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
    
    toast.success(`Added ${item.name} to cart`);
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.item.id !== itemId));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    const item = items.find(i => i.id === itemId);
    
    if (item && newQuantity > item.stock) {
      toast.error("Cannot add more items. Stock limit reached.");
      return;
    }
    
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(cart.map(cartItem => 
      cartItem.item.id === itemId 
        ? { ...cartItem, quantity: newQuantity } 
        : cartItem
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  };

  // Navigate to product detail page
  const handleViewProductDetail = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Farm Products</h1>
        <p className="text-muted-foreground">
          Browse our selection of fresh farm products from verified farmers
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        {/* Filters - Desktop */}
        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Button 
                      variant={selectedCategory === "" ? "default" : "outline"} 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory("")}
                    >
                      All Categories
                    </Button>
                  </div>
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <Button 
                        variant={selectedCategory === category ? "default" : "outline"} 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="price_low">Price (Low to High)</SelectItem>
                    <SelectItem value="price_high">Price (High to Low)</SelectItem>
                    <SelectItem value="latest">Latest Added</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Narrow down your product search
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Button 
                          variant={selectedCategory === "" ? "default" : "outline"} 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => setSelectedCategory("")}
                        >
                          All Categories
                        </Button>
                      </div>
                      {categories.map(category => (
                        <div key={category} className="flex items-center">
                          <Button 
                            variant={selectedCategory === category ? "default" : "outline"} 
                            size="sm" 
                            className="w-full justify-start"
                            onClick={() => setSelectedCategory(category)}
                          >
                            {category}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Sort By</h3>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                        <SelectItem value="price_low">Price (Low to High)</SelectItem>
                        <SelectItem value="price_high">Price (High to Low)</SelectItem>
                        <SelectItem value="latest">Latest Added</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Shopping Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {cart.reduce((total, item) => total + item.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                  <SheetDescription>
                    {cart.length > 0
                      ? `You have ${cart.reduce((total, item) => total + item.quantity, 0)} items in your cart`
                      : "Your cart is empty"}
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  {cart.length > 0 ? (
                    <div className="space-y-4">
                      {cart.map(cartItem => (
                        <Card key={cartItem.item.id} className="overflow-hidden">
                          <div className="flex p-4">
                            <div className="h-16 w-16 rounded overflow-hidden mr-4">
                              <img
                                src={cartItem.item.image_url}
                                alt={cartItem.item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{cartItem.item.name}</h3>
                              <p className="text-sm text-muted-foreground">₹{cartItem.item.price}</p>
                              
                              <div className="flex items-center mt-2">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                                >
                                  -
                                </Button>
                                <span className="mx-2 min-w-10 text-center">{cartItem.quantity}</span>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                                >
                                  +
                                </Button>
                                <span className="ml-auto font-medium">
                                  ₹{(cartItem.item.price * cartItem.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                      
                      <Separator />
                      
                      <div className="flex justify-between text-lg font-medium">
                        <span>Total</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                      
                      <Button className="w-full">
                        Proceed to Checkout
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="mb-4 text-muted-foreground">Your cart is empty</p>
                      <Button variant="outline" onClick={() => {}} className="mx-auto">
                        Continue Shopping
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Products Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <Card key={item.id} className="overflow-hidden flex flex-col h-full">
                  <div 
                    className="aspect-square overflow-hidden cursor-pointer"
                    onClick={() => handleViewProductDetail(item.id)}
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4 pb-0 cursor-pointer" onClick={() => handleViewProductDetail(item.id)}>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant="outline" className="mt-2 mb-0">{item.category}</Badge>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="font-semibold text-lg">₹{item.price}</div>
                      <div className="text-sm text-muted-foreground">Stock: {item.stock}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      className="w-full" 
                      onClick={() => addToCart(item)}
                      disabled={
                        item.stock === 0 || 
                        (cart.find(cartItem => cartItem.item.id === item.id)?.quantity || 0) >= item.stock
                      }
                    >
                      {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-center text-muted-foreground mb-4">
                  No products found matching your criteria
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                }}>
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
