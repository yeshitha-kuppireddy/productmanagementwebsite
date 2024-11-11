import { Container, SimpleGrid, Text, VStack, Input, Button, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [products, setProducts] = useState([]);
	const [maxPrice, setMaxPrice] = useState(100);

	useEffect(() => {
		const fetchProducts = async () => {
			const res = await fetch("/api/products");
			const data = await res.json();
			setProducts(data.data);
		};
		fetchProducts();
	}, []);
	const handleDelete = async (productId) => {
		try {
		  const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
		  const data = await res.json();
		  
		  if (data.success) {
			setProducts(products.filter(product => product._id !== productId)); // Update state
		  }
		} catch (error) {
		  console.error("Error deleting product:", error);
		}
	};
	const handleUpdate = async (productId, updatedProductData) => {
		try {
		  const res = await fetch(`/api/products/${productId}`, {
			method: 'PUT',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedProductData),
		  });
		  
		  const data = await res.json();
		  
		  if (data.success) {
			setProducts(products.map(product => 
			  product._id === productId ? data.data : product
			));
		  }
		} catch (error) {
		  console.error("Error updating product:", error);
		}
	};
	  
	  

	const handleSearch = async () => {
		const response = await fetch(`/api/products?name=${searchTerm}`);
		const data = await response.json();
		const searchedProducts = data.data.filter(product => product.price <= maxPrice);
		setProducts(searchedProducts);
	};

	const filteredProducts = products.filter(product => product.price <= maxPrice);

	return (
		<Container maxW='container.xl' py={12}>
			<VStack spacing={8}>
				<Text fontSize={"30"} fontWeight={"bold"} bgGradient={"linear(to-r, cyan.400, blue.500)"} bgClip={"text"} textAlign={"center"}>
					Current Products 🚀
				</Text>

				<Flex alignItems="center" gap={4}>
					<Input 
						placeholder="Search products" 
						value={searchTerm} 
						onChange={(e) => setSearchTerm(e.target.value)} 
					/>
					<Button onClick={handleSearch}>Search</Button>

					<Slider defaultValue={maxPrice} min={0} max={200} onChange={(val) => setMaxPrice(val)} width="200px">
						<SliderTrack>
							<SliderFilledTrack />
						</SliderTrack>
						<SliderThumb />
					</Slider>
					<Text>Max Price: ${maxPrice}</Text>
				</Flex>

				<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w={"full"}>
					{filteredProducts.length > 0 ? (
						filteredProducts.map((product) => (
							<ProductCard key={product._id} product={product} />
						))
					) : (
						<Text>No products available</Text>
					)}
				</SimpleGrid>

				{products.length === 0 && (
					<Text fontSize='xl' textAlign={"center"} fontWeight='bold' color='gray.500'>
						No products found 😢{" "}
						<Link to={"/create"}>
							<Text as='span' color='blue.500' _hover={{ textDecoration: "underline" }}>
								Create a product
							</Text>
						</Link>
					</Text>
				)}
			</VStack>
		</Container>
	);
};

export default HomePage;
