import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const defaultProducts = [
  { id: 1, name: "Men's Shirt", price: 699, oldPrice: 899, tag: 'New', image: 'photo-1602810318383-e386cc2a3ccf' },
  { id: 2, name: "Women's Dress", price: 899, oldPrice: 1299, tag: 'Hot', image: 'photo-1595777457583-95e059d581b8' },
  { id: 3, name: "Men's Sweatshirt", price: 1099, oldPrice: 1499, image: 'photo-1556821840-3a63f95609a7' },
];

function AdminDashboard() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('kalai_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [form, setForm] = useState({ name: '', price: '', oldPrice: '', image: '', tag: '' });
  const [preview,setPreview] = useState('');
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      name: form.name,
      price: Number(form.price),
      oldPrice: Number(form.oldPrice) || Number(form.price) + 200,
      tag: form.tag,
      image: form.image
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem('kalai_products', JSON.stringify(updated));
    setForm({ name: '', price: '', oldPrice: '', image: '', tag: '' });
    alert('Product Added! Go to Home to see.');
  };

  const handleDelete = (id) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('kalai_products', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  const handleFileChange=(e)=>{
    const file = e.target.files[0];
    if(!file) return;

    if(file.size > 2000000){
      alert('File size exceeds 2MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
    setForm({...form, image: reader.result});
    setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="auth-container" style={{alignItems:'flex-start'}}>
      <div className="auth-card" style={{maxWidth:'800px', width:'100%'}}>
        <h1>Admin Dashboard</h1>
        <p>Add new collection - will show in Home</p>

        <form onSubmit={handleAdd} style={{display:'grid', gap:'10px', marginTop:'20px'}}>
          <input placeholder="Product Name e.g. Women's Saree" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <input placeholder="Price e.g. 799" type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required />
          <input placeholder="Old Price e.g. 999" type="number" value={form.oldPrice} onChange={e=>setForm({...form, oldPrice:e.target.value})} />
          {/* <p style={{margin:'10px 0 0', fontWeight:'bold'}}>Image - Choose ONE:</p> */}
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <input placeholder="OR Paste https:// link" value={form.image.startsWith('data:') ? '' : form.image} onChange={e=>setForm({...form, image:e.target.value})} />
      
          {preview && <img src={preview} style={{width:'100px', height:'100px', objectFit:'cover'}} alt="preview" />}
          {/* <input placeholder="Image - Unsplash ID or full https:// link" value={form.image} onChange={e=>setForm({...form, image:e.target.value})} required /> */}
          <input placeholder="Tag e.g. New / Hot (optional)" value={form.tag} onChange={e=>setForm({...form, tag:e.target.value})} />
          <button type="submit" className="primary-btn">Add Product</button>
        </form>

        <h2 style={{marginTop:'30px'}}>Current Products ({products.length})</h2>
        <div style={{display:'grid', gap:'10px', marginTop:'10px'}}>
          {products.map(p=>(
            <div key={p.id} style={{display:'flex', justifyContent:'space-between', border:'1px solid #ddd', padding:'8px', borderRadius:'8px'}}>
              <span>{p.name} - ₹{p.price}</span>
              <button onClick={()=>handleDelete(p.id)} style={{background:'red', color:'white', border:'none', padding:'2px 8px', borderRadius:'4px'}}>Delete</button>
            </div>
          ))}
        </div>

        <div style={{marginTop:'20px', display:'flex', gap:'10px'}}>
          <Link to="/" className="back-link">Go to Home</Link>
          <button onClick={handleLogout} className="login-btn">Logout</button>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboard;