import React, { useMemo, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {
  Search, UserRound, LogIn, House, Compass, Info, Heart, ShoppingCart,
  Shirt, Footprints, Crown, Truck, ShieldCheck, Headphones, Menu, X,
  ArrowRight, Check
} from 'lucide-react';
import '../App.css';

const categories = [
  { name: "Men's Wear", icon: Shirt, image: 'photo-1618354691373-d851c5c3a990' },
  { name: 'Casual Wear', icon: Shirt, image: 'photo-1618354691229-88d47f285158' },
  { name: "Women's Wear", icon: Crown, image: 'photo-1610030469983-98e550d6193c' },
  { name: 'Western Wear', icon: Shirt, image: 'photo-1483985988355-763728e1935b' },
  { name: 'Accessories', icon: Crown, image: 'photo-1529139574466-a303027c1d8b' },
  { name: 'Footwear', icon: Footprints, image: 'photo-1542291026-7eec264c27ff' },
];

const products = [
  { id: 1, name: "Men's Shirt", price: 699, oldPrice: 899, tag: 'New', image: 'photo-1602810318383-e386cc2a3ccf' },
  { id: 2, name: "Women's Dress", price: 899, oldPrice: 1299, tag: 'Hot', image: 'photo-1595777457583-95e059d581b8' },
  { id: 3, name: "Men's Sweatshirt", price: 1099, oldPrice: 1499, image: 'photo-1556821840-3a63f95609a7' },
  { id: 4, name: "Women's Kurti", price: 799, oldPrice: 1099, image: 'https://i.pinimg.com/originals/de/ea/91/deea918c26372cbde15ede8c7d3bacd7.jpg' },
  { id: 5, name: "Men's Casual Shirt", price: 749, oldPrice: 1099, image: 'photo-1598033129183-c4f50c736f10' },
  { id: 6, name: "Women's Top", price: 699, oldPrice: 999, image: 'photo-1485968579580-b6d095142e6e' },
];

const photo = (id, width = 700) =>{
    if(!id) return '';
    if(id.startsWith('http')) return id;
    if(id.startsWith('data:')) return id;
    return  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
};

function UserDashboard() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState(()=>{
    const saved =localStorage.getItem('kalai_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState('');

  const [allProducts] = useState(() => {
    const saved = localStorage.getItem('kalai_products');
    return saved ? JSON.parse(saved) : products;
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const visibleProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' ||
        (activeCategory === "Men's Wear" && product.name.startsWith("Men's")) ||
        (activeCategory === "Women's Wear" && product.name.startsWith("Women's")) ||
        (activeCategory === 'Casual Wear' && product.name.includes('Casual')) ||
        (activeCategory === 'Western Wear' && product.name.includes('Top'));
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory,allProducts]);


const addToCart = (product) => {
  setCart((current) => {
    const saved = JSON.parse(localStorage.getItem('kalai_cart') || '[]');
    const exists = saved.find(p => p.id === product.id);
    let updated;
    if(exists){
      updated = saved.map(p => p.id === product.id ? {...p, qty: p.qty + 1} : p);
    } else {
      updated = [...saved, {...product, qty: 1}];
    }
    localStorage.setItem('kalai_cart', JSON.stringify(updated));
    return updated;
  });
  setNotice(`${product.name} added to your bag`);
  setTimeout(() => setNotice(''), 2200);
};

  const toggleFavorite = (id) => {
    setFavorites((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]);
  };

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenu(false);
  };
    const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="store" id="home">
      <header className="navbar">
        <a className="brand" href="#home" aria-label="Kalai's home">
          <span className="brand-mark">K</span>
          <span>Kalai's<span className="brand-dot">.</span></span>
        </a>

        <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">
          {mobileMenu ? <X /> : <Menu />}
        </button>

        <nav className={`nav-links ${mobileMenu ? 'nav-open' : ''}`}>
          <button className="nav-item active" onClick={() => goTo('home')}><House size={16} /> Home</button>
          <button className="nav-item" onClick={() => goTo('categories')}><Compass size={16} /> Explore</button>
          <button className="nav-item" onClick={() => goTo('about')}><Info size={16} /> About</button>
        </nav>

        <label className="search-box">
          <Search size={18} />
          <input value={search} onChange={(e) => { setSearch(e.target.value); goTo('collection'); }} placeholder="Search clothes..." />
          {search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={15} /></button>}
        </label>

        <button className="account-btn" aria-label="Account"><UserRound size={20} /></button>
        <button className="login-btn" onClick={handleLogout}><LogIn size={17} /> Logout</button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">FASHION <span>•</span> STYLE <span>•</span> YOU</p>
            <span>Hi, {user.name || 'user'}</span>
            <h1>Welcome to<br /><em>Kalai's</em></h1>
            <p className="hero-subtitle">Dress Better. Feel Better.</p>
            <button className="primary-btn" onClick={() => goTo('collection')}>Explore Now <ArrowRight size={18} /></button>
            <div className="hero-dots"><span className="selected" /><span /><span /></div>
          </div>
          <div className="hero-visual">
            <div className="sun-disc" />
            <img className="hero-image" src={photo('photo-1483985988355-763728e1935b', 1200)} alt="Fashion models wearing modern outfits" />
            <div className="hero-note">Be stylish.<br />Always.</div>
            <div className="hero-sticker">✦</div>
          </div>
        </section>

        <section className="section categories-section" id="categories">
          <div className="section-title"><span /><h2>Shop by <em>Category</em></h2><span /></div>
          <div className="category-grid">
            {categories.map(({ name, icon: Icon, image }) => (
              <button className={`category-card ${activeCategory === name ? 'category-selected' : ''}`} key={name}
                onClick={() => { setActiveCategory(activeCategory === name ? 'All' : name); goTo('collection'); }}>
                <img src={photo(image, 450)} alt={name} loading="lazy" />
                <span className="category-label"><Icon size={19} fill="currentColor" />{name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="section collection-section" id="collection">
          <div className="collection-heading">
            <h2>Featured <em>Collection</em></h2>
            <span className="heading-line" />
            <button className="view-all" onClick={() => { setActiveCategory('All'); setSearch(''); }}>View All <ArrowRight size={16} /></button>
          </div>
          {activeCategory !== 'All' && <div className="filter-row">Showing: {activeCategory} <button onClick={() => setActiveCategory('All')}>Clear filter ×</button></div>}
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <img src={photo(product.image, 600)} alt={product.name} loading="lazy" />
                  {product.tag && <span className={`product-tag ${product.tag === 'Hot' ? 'hot' : ''}`}>{product.tag}</span>}
                  <button className={`favorite-btn ${favorites.includes(product.id) ? 'favorited' : ''}`}
                    onClick={() => toggleFavorite(product.id)} aria-label={`Favorite ${product.name}`}>
                    <Heart size={19} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">₹{product.price.toLocaleString('en-IN')} <del>₹{product.oldPrice.toLocaleString('en-IN')}</del></p>
                  <button className="cart-btn" onClick={() => addToCart(product)}><ShoppingCart size={15} /> Add to Cart</button>
                </div>
              </article>
            ))}
          </div>
          {visibleProducts.length === 0 && <p className="empty-state">No products found. Try another search.</p>}
        </section>

        <section className="benefits" id="about">
          <div className="benefit"><Truck size={34} /><div><strong>Free Shipping</strong><span>On orders above ₹999</span></div></div>
          <i />
          <div className="benefit"><ShieldCheck size={34} /><div><strong>Secure Payments</strong><span>100% protected</span></div></div>
          <i />
          <div className="benefit"><Headphones size={34} /><div><strong>24/7 Support</strong><span>We're here to help</span></div></div>
          <div className="footer-slogan">Shop Smart,<br />Shop Kalai's</div>
          <button className="footer-btn" onClick={() => goTo('collection')}>Explore More <ArrowRight size={16} /></button>
        </section>
      </main>

      <footer className="copyright">© 2026 Kalai's. Made for your everyday style.</footer>
      {notice && <div className="toast"><Check size={17} /> {notice}</div>}
      {cart.length > 0 && <button className="cart-floating" onClick={() => navigate('/cart')}>
  <ShoppingCart size={18} /> {cart.reduce((s,p)=>s+p.qty,0) || cart.length}
</button>}
    </div>
  );
}



export default UserDashboard;