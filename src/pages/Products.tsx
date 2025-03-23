import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Plus, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
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

const mockItems = [
  // ... keep existing mockItems array data
];

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
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [items, setItems] = useState<Item[]>(mockItems);
  const [cart, setCart] = useState<{ item: Item; quantity: number }[]>([]);

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

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const navigateToAddProduct = () => {
    navigate('/products/add');
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Farm Products</h1>
          <p className="text-muted-foreground">
            Browse our selection of fresh farm products from verified farmers
          </p>
        </div>
        
        {user && user.role === "farmer" && (
          <Button onClick={navigateToAddProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <Card key={item.id} className="overflow-hidden flex flex-col h-full">
                <div 
                  className="aspect-square overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(item.id)}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="p-4 pb-0 cursor-pointer" onClick={() => handleProductClick(item.id)}>
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
        </div>
      </div>
    </div>
  );
}
