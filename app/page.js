"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { ToastContainer, toast } from 'react-toastify';
import { FaShoppingCart } from 'react-icons/fa'; // Importa el icono de carrito
import 'react-toastify/dist/ReactToastify.css';
import { getAllProducts } from "./services/products.service";
import Header from "./Header";

export default function Home() {
  const [productsInStock, setProductsInStock] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const products = await getAllProducts();
      const filteredProducts = products.filter(product => product["Cantidad en Stock"] > 0);
      setProductsInStock(filteredProducts);

      const uniqueCategories = [...new Set(filteredProducts.map(product => product.Categoria).filter(Boolean))];
      setCategories(uniqueCategories);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = productsInStock.filter(product => {
    const matchesCategory = selectedCategory ? product.Categoria === selectedCategory : true;
    const matchesSearch = product.Nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isSingleProduct = filteredProducts.length === 1;

  const addToCart = (product) => {
    if (cart.filter(item => item['Row ID'] === product['Row ID']).length < product["Cantidad en Stock"]) {
      setCart((prevCart) => [...prevCart, product]);
      toast.success(`${product.Nombre} ha sido añadido al carrito!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error("Cantidad máxima disponible", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const removeFromCart = (productToRemove) => {
    setCart(cart.filter(product => product['Row ID'] !== productToRemove['Row ID']));
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const calculateTotal = () => {
    const total = cart.reduce((total, product) => {
      const price = parseFloat(product["Precio de Venta"]) || 0;
      return total + price;
    }, 0);

    return total.toFixed(2);
  };

  return (
    <div className={styles.page}>
      <Header/>
      <ToastContainer />

      {/* Buscador por nombre */}
      <div className={styles.buscador}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.inputBuscador}
        />
      </div>

      {/* Filtro de categoría */}
      <div className={styles.filtroCategorias}>
        <label htmlFor="categoria" className={styles.labelCategoria}>Filtrar por categoría:</label>
        <select
          id="categoria"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.selectCategoria}
        >
          <option value="">Todas las categorías</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Botón para abrir el carrito */}
      <button onClick={toggleCart} className={styles.botonCarrito}>
        Ver Carrito ({cart.length})
      </button>

      {/* Loader mientras se cargan los productos */}
      {loading ? (
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <div className={`${styles.grillaProductos} ${isSingleProduct ? styles.centroProducto : ''}`}>
        {filteredProducts.map((product) => (
          <div key={product['Row ID']} className={styles.tarjetaProducto}>
            <Image
              src={JSON.parse(product.Imagen).Url}
              alt={product.Nombre}
              width={250}
              height={200} // Ajusta la altura de la imagen
              className={styles.imagenProducto}
            />
            <h2 className={styles.nombreProducto}>{product.Nombre}</h2>
            <p className={styles.precioProducto}>${product["Precio de Venta"]}</p>
            <button onClick={() => addToCart(product)} className={styles.botonAgregar}>
              <FaShoppingCart className={styles.icono} /> {/* Añadir icono de carrito */}
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
      )}

      {/* Modal del carrito */}
      {isCartOpen && (
        <div className={styles.modal}>
          <h2>Carrito de Compras</h2>
          {cart.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            <ul className={styles.listaCarrito}>
              {cart.map((product) => (
                <li key={product['Row ID']} className={styles.itemCarrito}>
                  <Image
                    src={JSON.parse(product.Imagen).Url}
                    alt={product.Nombre}
                    width={80}
                    height={80}
                    className={styles.imagenCarrito}
                  />
                  <div className={styles.detallesProducto}>
                    <span>{product.Nombre}</span>
                    <span>${product["Precio de Venta"]}</span>
                  </div>
                  <button onClick={() => removeFromCart(product)} className={styles.botonEliminar}>Eliminar</button>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.totalCarrito}>
            <strong>Total:</strong> ${calculateTotal()}
          </div>
          <a
            href={`https://wa.me/5493765026150?text=Hola! Quiero comprar: ${cart.map(product => `${product.Nombre} - $${product["Precio de Venta"]}`).join(', ')}. Total: $${calculateTotal()}`}
            className={styles.botonWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contactar por WhatsApp
          </a>
          <button onClick={toggleCart} className={styles.botonCerrar}>Cerrar</button>
        </div>
      )}
    </div>
  );
}
