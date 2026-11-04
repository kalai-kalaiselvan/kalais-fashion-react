import React,{ useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import '../App.css';

const photo = (id, w=200) => {
  if(!id) return '';
  if(id.startsWith('http')) return id;
  if(id.startsWith('data:')) return id;
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
};

export default function CartPage() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('kalai_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('kalai_cart', JSON.stringify(cart));
  }, [cart]);

  const remove = (id) => setCart(cart.filter(p => p.id !== id));
  
  const updateQty = (id, type) => {
    setCart(cart.map(p => {
      if(p.id !== id) return p;
      const qty = type === 'inc' ? p.qty + 1 : p.qty - 1;
      return qty <= 0 ? null : {...p, qty};
    }).filter(Boolean));
  };

  const total = cart.reduce((s,p) => s + p.price * p.qty, 0);
  const count = cart.reduce((s,p) => s + p.qty, 0);

  if(cart.length === 0) {
    return (
      <div style={{padding:'80px 20px', textAlign:'center'}}>
        <ShoppingCart size={60} style={{opacity:0.2, margin:'0 auto 20px', display:'block'}}/>
        <h2>Your bag is empty</h2>
        <button className="primary-btn" onClick={() => navigate('/user-dashboard')} style={{marginTop:'20px'}}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div style={{padding:'20px', maxWidth:'800px', margin:'0 auto'}}>
      <button onClick={() => navigate('/user-dashboard')} style={{display:'flex', alignItems:'center', gap:'6px', background:'none', border:'none', cursor:'pointer', marginBottom:'20px'}}>
        <ArrowLeft size={18}/> Back to Shop
      </button>
      
      <h1>Your Bag ({count} items)</h1>

      <div style={{display:'grid', gap:'14px', marginTop:'20px'}}>
        {cart.map(p => (
          <div key={p.id} style={{display:'flex', gap:'14px', border:'1px solid #eee', padding:'12px', borderRadius:'12px', alignItems:'center'}}>
            <img src={photo(p.image)} alt={p.name} style={{width:'80px', height:'80px', objectFit:'cover', borderRadius:'10px'}} />
            <div style={{flex:1}}>
              <h3 style={{margin:0}}>{p.name}</h3>
              <p>₹{p.price} x {p.qty}</p>
              <div style={{display:'flex', gap:'8px', alignItems:'center', marginTop:'6px'}}>
                <button onClick={() => updateQty(p.id, 'dec')} style={{width:'28px', height:'28px', borderRadius:'50%', border:'1px solid #ddd', cursor:'pointer'}}><Minus size={14}/></button>
                <span>{p.qty}</span>
                <button onClick={() => updateQty(p.id, 'inc')} style={{width:'28px', height:'28px', borderRadius:'50%', border:'1px solid #ddd', cursor:'pointer'}}><Plus size={14}/></button>
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <p><strong>₹{p.price * p.qty}</strong></p>
              <button onClick={() => remove(p.id)} style={{background:'#ffeaea', color:'red', border:'none', padding:'6px 10px', borderRadius:'8px', marginTop:'6px', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px'}}><Trash2 size={16}/> Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:'24px', borderTop:'2px solid #111', paddingTop:'16px'}}>
        <div style={{display:'flex', justifyContent:'space-between', fontSize:'20px'}}><span>Total:</span><strong>₹{total.toLocaleString('en-IN')}</strong></div>
        <button className="primary-btn" style={{width:'100%', marginTop:'16px', padding:'14px'}} onClick={() => { alert('Order Placed!'); setCart([]); navigate('/user-dashboard'); }}>Place Order</button>
        <button onClick={() => navigate('/user-dashboard')} style={{width:'100%', marginTop:'10px', padding:'12px', background:'none', border:'1px solid #111', borderRadius:'10px', cursor:'pointer'}}>Add More Products</button>
      </div>
    </div>
  );
}