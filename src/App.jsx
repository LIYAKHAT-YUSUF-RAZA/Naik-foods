import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Award, CakeSlice, Camera, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Cookie, FlaskConical, Gift, Globe2, Grid2X2, Heart, Mail, MessageCircle, PackageCheck, Pause, Play, Search, Send, ShieldCheck, ShoppingBasket, ShoppingCart, Star, Target, Timer, Truck, UserRound, Video } from 'lucide-react'
import './App.css'

const imageSources = (name) => ['jpeg', 'jpg', 'png', 'webp', 'avif', 'gif'].map((extension) => `/assets/${name}.${extension}`)

const categories = [
  { label: 'All Categories', icon: Grid2X2 },
  { label: 'Snacks & Namkeen', icon: Cookie },
  { label: 'Pickles & Chutneys', icon: FlaskConical },
  { label: 'Masalas & Spices', icon: ShoppingBasket },
  { label: 'Sweets & Treats', icon: CakeSlice },
  { label: 'Groceries', icon: ShoppingBasket },
  { label: 'Gift Boxes', icon: Gift },
]

const navigationItems = ['Home', 'Shop', 'Groceries', 'Our Story', 'Gift Boxes', 'Recipes', 'Best Sellers', 'Offers', 'About Us', 'Contact']

const popularSearches = ['Maharashtrian Snacks', 'Mango Pickles', 'Goda Masala', 'Chakli', 'Jwari Bhel', 'Traditional Sweets', 'Maharashtrian Gift Boxes', 'Maharashtrian Recipes', 'Healthy Snacks', 'Festive Specials']
const footerColumns = {
  Shop: ['All Products', 'Snacks', 'Pickles', 'Masalas', 'Sweets', 'Grocery Essentials', 'Gift Boxes', 'Festive Specials', 'New Arrivals', 'Offers'],
  'Quick Links': ['Our Story', 'Recipes', 'Best Sellers', 'Track Your Order', 'FAQs', 'Blog', 'Customer Reviews', 'Store Locator', 'Careers', 'Contact Us'],
  'Customer Care': ['My Account', 'Shipping Policy', 'Return & Refund Policy', 'Terms & Conditions', 'Privacy Policy', 'Bulk Orders', 'Corporate Gifting', 'Help & Support'],
}
const footerBenefits = [
  { title: 'Pan India Delivery', text: 'Authentic flavours across India', icon: Truck },
  { title: '100% Authentic', text: 'Pure Maharashtrian taste', icon: LeafIcon },
  { title: 'Premium Quality', text: 'Handpicked with care', icon: Award },
  { title: 'Secure Payments', text: 'Shop with confidence', icon: ShieldCheck },
  { title: 'Easy Returns', text: 'Hassle-free experience', icon: PackageCheck },
]

const finderCategories = [
  { label: 'Snacks', description: 'Crunchy. Tasty. Always a good idea.', image: '/assets/product-poha.jpeg' },
  { label: 'Pickles', description: 'Tangy flavours from Maharashtra', image: '/assets/product-mango.jpeg' },
  { label: 'Masalas', description: 'Traditional taste in every dish', image: '/assets/product-goda.jpeg' },
  { label: 'Sweets', description: 'Celebrate every occasion', image: '/assets/product-chakli.jpeg' },
  { label: 'Gifting', description: 'Make moments special', image: '/assets/hero-gifting-hero.jpeg' },
]

const finderPreferences = {
  time: ['Any Time', 'Morning', 'Evening', 'Tea Time'],
  spice: ['Mild', 'Medium', 'Spicy'],
  diet: ['No Preference', 'Low Oil', 'Jain Friendly', 'No Garlic'],
  shopper: ['Myself', 'Family', 'Gifting', 'Office / Corporate'],
}

function LeafIcon(props) { return <span {...props} aria-hidden="true">◒</span> }
function AtSignIcon() { return <span aria-hidden="true">@</span> }

function SpinWheelModal({ open, onClose, cartValue, isNewUser, onApplied }) {
  const [spinning, setSpinning] = useState(false)
  const [discount, setDiscount] = useState(null)
  const eligible = isNewUser || cartValue >= 1500
  const spin = () => {
    if (!eligible || spinning) return
    setSpinning(true)
    window.setTimeout(() => {
      setDiscount([5, 10, 20, 30][Math.floor(Math.random() * 4)])
      setSpinning(false)
    }, 1200)
  }
  if (!open) return null
  return <div className="spin-overlay" role="dialog" aria-modal="true" aria-label="Spin and win discount">
    <div className="spin-modal"><button type="button" className="spin-close" aria-label="Close spin wheel" onClick={onClose}>×</button><span className="spin-confetti">✦</span><h2>Spin &amp; Win</h2><p>{isNewUser ? 'Welcome to Naik Foods! Enjoy your free discount spin.' : 'You have unlocked a discount spin.'}</p><div className={`spin-wheel ${spinning ? 'spinning' : ''}`}><span className="spin-pointer">▼</span><div className="spin-wheel-label">{discount ? `${discount}% OFF` : 'SPIN'}</div></div>{discount ? <div className="spin-result"><strong>🎉 Congratulations!</strong><span>You unlocked {discount}% off your order.</span><button type="button" onClick={() => { onApplied(discount); onClose() }}>Apply Discount</button></div> : <><div className={`spin-eligibility ${eligible ? 'eligible' : ''}`}>{eligible ? isNewUser ? 'Free spin unlocked for new users' : 'Cart target reached: ₹1,500' : `Add ₹${Math.max(0, 1500 - cartValue).toLocaleString('en-IN')} more to unlock your spin`}</div><button className="spin-action" type="button" disabled={!eligible || spinning} onClick={spin}>{spinning ? 'Spinning...' : 'Spin Now'} <span>→</span></button></>}</div>
  </div>
}

function CartPanel({ open, onClose, items, cartValue, discount, onQuantity, onRemove, onSpin, showNotice }) {
  if (!open) return null
  const discountedTotal = Math.round(cartValue * (1 - discount / 100))
  const remaining = Math.max(0, 1500 - cartValue)
  return <div className="cart-overlay" role="dialog" aria-modal="true" aria-label="Shopping cart"><aside className="cart-panel"><div className="cart-panel-header"><div><span>YOUR CART</span><h2>Smart Cart</h2></div><button type="button" aria-label="Close cart" onClick={onClose}>×</button></div>{items.length === 0 ? <div className="empty-cart"><ShoppingCart size={43} /><h3>Your cart is empty</h3><p>Add your favourite Maharashtrian products to unlock rewards.</p><button type="button" onClick={onClose}>Continue Shopping</button></div> : <><div className="cart-items">{items.map((item) => <article className="cart-item" key={item.name}><img src={item.image || productImages[item.name] || '/assets/product-mango.jpeg'} alt="" /><div><h3>{item.name}</h3><small>{item.size}</small><strong>₹{item.price}</strong></div><div className="cart-item-actions"><button type="button" onClick={() => onQuantity(item.name, -1)}>−</button><b>{item.quantity}</b><button type="button" onClick={() => onQuantity(item.name, 1)}>+</button><button className="remove-item" type="button" onClick={() => onRemove(item.name)}>Remove</button></div></article>)}</div><div className="cart-progress"><div className="cart-progress-copy"><b>{remaining ? `Add ₹${remaining.toLocaleString('en-IN')} more to unlock Spin & Win` : '🎉 Spin & Win unlocked!'}</b><span>₹{cartValue.toLocaleString('en-IN')} / ₹1,500</span></div><div><i style={{ width: `${Math.min(100, (cartValue / 1500) * 100)}%` }} /></div>{remaining ? <button type="button" onClick={onClose}>Continue Shopping</button> : <button type="button" onClick={onSpin}>Spin for Discount →</button>}</div><div className="cart-summary"><h3>Order Summary</h3><p>Subtotal <b>₹{cartValue.toLocaleString('en-IN')}</b></p>{discount > 0 && <p>Discount ({discount}%) <b className="discount-text">−₹{Math.round(cartValue * discount / 100).toLocaleString('en-IN')}</b></p>}<p>Delivery <span>Calculated at checkout</span></p><strong>Total <b>₹{discountedTotal.toLocaleString('en-IN')}</b></strong><button type="button" onClick={() => showNotice('Checkout is ready to connect')}>Proceed to Checkout <ArrowRight size={17} /></button></div></>}</aside></div>
}

function SmartProductFinder({ open, onClose, onAdd, onWishlist, wishlist, showNotice, onOpen }) {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState('Snacks')
  const [preferences, setPreferences] = useState({ time: 'Any Time', spice: 'Mild', diet: 'No Preference', shopper: 'Myself' })
  const recommendations = [
    { name: 'Chakli', size: '500 g', price: 250, rating: '4.8', reviews: '1.2k', emoji: '🥨', color: 'biscuit' },
    { name: 'Jwari Bhel', size: '400 g', price: 180, rating: '4.7', reviews: '980', emoji: '🥗', color: 'yellow' },
    { name: 'Bakharwadi', size: '400 g', price: 220, rating: '4.9', reviews: '1.5k', image: '/assets/product-chakli.jpeg', color: 'gold' },
    { name: 'Kothimbir Vadi Chivda', size: '400 g', price: 190, rating: '4.6', reviews: '760', image: '/assets/product-vadi.jpeg', color: 'sage' },
    { name: 'Sabudana Papad', size: '200 g', price: 160, rating: '4.5', reviews: '620', image: '/assets/product-sabudana.jpeg', color: 'cream' },
  ]

  if (!open) return null
  const setPreference = (group, value) => setPreferences((current) => ({ ...current, [group]: value }))
  const closeAndReset = () => { setStep(1); onClose() }

  return <div className="finder-overlay" role="dialog" aria-modal="true" aria-labelledby="finder-title">
    <div className="finder-modal">
      <button className="finder-close" type="button" aria-label="Close product finder" onClick={closeAndReset}>×</button>
      <div className="finder-brand">✦ Naik Foods <small>TASTE OF MAHARASHTRA</small></div>
      <div className="finder-title"><span>◉ &nbsp; FIND WHAT YOU LOVE, FASTER</span><h2 id="finder-title">Smart Product Finder</h2><p>Answer a few quick questions, and we’ll find the perfect products for you!</p></div>
      <div className="finder-steps" aria-label="Finder progress">{['What are you looking for?', 'Tell us more', 'Get Recommendations'].map((label, index) => <div className={step === index + 1 ? 'active' : step > index + 1 ? 'complete' : ''} key={label}><b>{step > index + 1 ? <Check size={18} /> : index + 1}</b><span><strong>{label}</strong><small>{index === 0 ? 'Select a category' : index === 1 ? 'Choose your preference' : 'Products tailored for you'}</small></span></div>)}</div>
      {step === 1 && <div className="finder-page"><h3>What are you looking for?</h3><p>Select a category to get started</p><div className="finder-category-grid">{finderCategories.map((item) => <button type="button" className={category === item.label ? 'selected' : ''} key={item.label} onClick={() => setCategory(item.label)}><span className="finder-category-image"><img src={item.image} alt="" /></span><strong>{item.label}</strong><small>{item.description}</small></button>)}</div><button className="finder-next" type="button" onClick={() => setStep(2)}>Tell Us More <ArrowRight size={17} /></button></div>}
      {step === 2 && <div className="finder-page"><h3>Tell us more about your preferences</h3><p>This helps us recommend the best products for you.</p>{Object.entries(finderPreferences).map(([group, options]) => <div className="preference-row" key={group}><span className="preference-icon">{group === 'time' ? <Clock3 size={24} /> : group === 'spice' ? '🌶️' : group === 'diet' ? '♥' : <Target size={24} />}</span><div><h4>{group === 'time' ? 'When do you usually enjoy these?' : group === 'spice' ? 'What spice level do you prefer?' : group === 'diet' ? 'Any dietary preferences?' : 'Who are you shopping for?'}</h4><div className="preference-options">{options.map((option) => <button type="button" className={preferences[group] === option ? 'selected' : ''} key={option} onClick={() => setPreference(group, option)}>{option}</button>)}</div></div></div>)}<div className="finder-navigation"><button type="button" onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</button><button className="finder-next" type="button" onClick={() => setStep(3)}>Find Products <ArrowRight size={17} /></button></div></div>}
      {step === 3 && <div className="finder-page finder-results"><div className="results-banner"><h3>Here are your personalized recommendations!</h3><p>Based on your choices, we’ve handpicked these products for you.</p><span>{category} · {preferences.time} · {preferences.spice} · {preferences.diet}</span></div><div className="finder-product-grid">{recommendations.map((product) => <ProductCard key={product.name} product={product} onAdd={onAdd} onWishlist={onWishlist} isWishlisted={wishlist.includes(product.name)} onOpen={onOpen} />)}</div><div className="finder-navigation"><button type="button" onClick={() => setStep(2)}><ArrowLeft size={16} /> Back</button><button className="finder-next" type="button" onClick={() => showNotice('Showing all recommended products')}>View All Recommended Products <ArrowRight size={17} /></button></div></div>}
    </div>
  </div>
}

function ProductDetail({ product, onClose, onAdd, showNotice }) {
  const [tab, setTab] = useState('Overview')
  const [weight, setWeight] = useState('200 g')
  const [quantity, setQuantity] = useState(1)
  const [openFaq, setOpenFaq] = useState(0)
  const image = product.image || productImages[product.name] || '/assets/product-mango.jpeg'
  const tabs = ['Overview', 'Ingredients', 'Nutritional Info', 'Reviews (1,245)', 'FAQs']
  const faqs = ['What are the ingredients in this product?', 'How spicy is this product?', 'What is the shelf life of this product?', 'How should I store this product?', 'Is this product suitable for vegetarians?']

  const buy = (message) => { onAdd(product.name, quantity); showNotice(message) }

  return <div className="detail-overlay" role="dialog" aria-modal="true" aria-label={`${product.name} product details`}>
    <div className="detail-page">
      <button className="detail-close" type="button" aria-label="Close product details" onClick={onClose}>×</button>
      <div className="detail-breadcrumb">Home &nbsp;›&nbsp; Shop &nbsp;›&nbsp; {product.name}</div>
      <div className="detail-layout">
        <aside className="detail-gallery"><div className="detail-main-image"><span className="detail-badge">Bestseller</span><img src={image} alt={product.name} /></div><div className="detail-thumbnails"><img src={image} alt="" /><img src={image} alt="" /><img src={image} alt="" /></div><h2>{product.name}</h2><p>Traditional Maharashtrian Taste</p><span className="detail-rating">★ 4.8 <small>(1,245 reviews)</small></span><strong className="detail-price">₹{product.price || 280}</strong><div className="detail-trust"><span>◒<small>Authentic<br />Ingredients</small></span><span>♧<small>Pan India<br />Delivery</small></span><span>♡<small>Secure<br />Payments</small></span></div></aside>
        <main className="detail-content"><div className="detail-tabs">{tabs.map((item) => <button type="button" className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>
          {tab === 'Overview' && <div className="detail-panel"><h1>{product.name}</h1><p className="detail-subtitle">Traditional Maharashtrian Taste</p><div className="detail-stars">★★★★★ <span>4.8 (1,245 reviews)</span></div><p>Made with handpicked ingredients and a traditional blend of spices, this timeless favourite brings authentic Maharashtrian flavour to your home.</p><h3>Key Highlights</h3><div className="highlight-grid"><span>✓ Handpicked ingredients</span><span>✓ Rich in natural flavours</span><span>✓ Traditional recipe</span><span>✓ Hygienically packed</span><span>✓ No artificial colours</span><span>✓ Long shelf life</span></div></div>}
          {tab === 'Ingredients' && <div className="detail-panel"><h1>Ingredients Used</h1><p className="detail-subtitle">Natural ingredients for an authentic taste of Maharashtra.</p><div className="ingredient-grid"><span>🥭<b>Raw Mangoes</b><small>Handpicked fresh produce</small></span><span>🌶️<b>Red Chilli</b><small>Adds the perfect spice</small></span><span>🌾<b>Mustard Seeds</b><small>Traditional flavour</small></span><span>🍃<b>Curry Leaves</b><small>For extra flavour</small></span><span>🧂<b>Rock Salt</b><small>Balances the taste</small></span></div></div>}
          {tab === 'Nutritional Info' && <div className="detail-panel"><h1>Nutritional Information</h1><p className="detail-subtitle">Know what you’re consuming. Good food, informed choices.</p><div className="nutrition-table"><div><b>Energy</b><span>300 kcal</span></div><div><b>Total Fat</b><span>23 g</span></div><div><b>Carbohydrates</b><span>27 g</span></div><div><b>Protein</b><span>6 g</span></div><div><b>Dietary Fibre</b><span>3 g</span></div></div></div>}
          {tab === 'Reviews (1,245)' && <div className="detail-panel"><h1>Customer Reviews</h1><p className="detail-subtitle">Real experiences. Real flavours. Real people.</p><div className="review-summary"><strong>4.8<small>/ 5</small></strong><span>★★★★★<small>1,245 ratings</small></span><b>98%<small>recommend this product</small></b></div>{['Authentic taste! Highly recommended.', 'Best pickle ever! Amazing taste and quality.', 'Must try! Perfect with every meal.'].map((review) => <article className="review-row" key={review}><span>★★★★★</span><b>Verified Purchase</b><p>{review}</p><small>Helpful (18) &nbsp; Reply</small></article>)}<button className="detail-secondary" type="button" onClick={() => showNotice('Review form opened')}>Write a Review</button></div>}
          {tab === 'FAQs' && <div className="detail-panel"><h1>Frequently Asked Questions</h1><p className="detail-subtitle">Everything you need to know before bringing it home.</p>{faqs.map((question, index) => <button className="faq-row" type="button" key={question} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>Q</span><strong>{question}</strong><b>{openFaq === index ? '−' : '+'}</b>{openFaq === index && <p>Our products are made with carefully selected ingredients and traditional recipes. Please check the product label for the most accurate information.</p>}</button>)}</div>}
        </main>
        <aside className="purchase-panel"><strong>₹{product.price || 280}</strong><small>(Inclusive of all taxes)</small><label>Select Weight</label><div className="weight-options">{['200 g', '300 g', '500 g'].map((option) => <button type="button" className={weight === option ? 'selected' : ''} key={option} onClick={() => setWeight(option)}>{option}</button>)}</div><label>Quantity</label><div className="quantity-control"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><b>{quantity}</b><button type="button" onClick={() => setQuantity(quantity + 1)}>+</button></div><button className="detail-add" type="button" onClick={() => buy(`${product.name} added to cart`)}><ShoppingCart size={17} /> Add to Cart</button><button className="detail-buy" type="button" onClick={() => buy(`Buying ${product.name}`)}>Buy Now <ArrowRight size={16} /></button><p>🚚 Deliver to 411001</p><p>✓ Get it by <b>Thu, 12 Sep</b></p><div className="detail-tip">🎁 Add items worth ₹1,220 more and unlock a FREE Spin & Win!</div></aside>
      </div>
    </div>
  </div>
}
const timeProducts = {
  Morning: [
    { name: 'Poha Chivda', size: '200 g', price: 120, rating: '4.8', reviews: '1.2k', emoji: '🥣', color: 'mint' },
    { name: 'Sabudana Chivda', size: '200 g', price: 140, rating: '4.7', reviews: '980', emoji: '🍚', color: 'cream' },
    { name: 'Kothimbir Vadi Mix', size: '200 g', price: 110, rating: '4.6', reviews: '750', emoji: '🟩', color: 'sage' },
    { name: 'Thecha', size: '100 g', price: 180, rating: '4.6', reviews: '760', emoji: '🫙', color: 'stone' },
    { name: 'Jwari Bhel', size: '200 g', price: 120, rating: '4.7', reviews: '900', emoji: '🥗', color: 'yellow' },
  ],
  Afternoon: [
    { name: 'Aaji’s Mango Pickle', size: '500 g', price: 250, rating: '4.9', reviews: '2.1k', emoji: '🥭', color: 'peach' },
    { name: 'Goda Masala', size: '200 g', price: 180, rating: '4.8', reviews: '1.4k', emoji: '🫙', color: 'spice' },
    { name: 'Bhajani', size: '500 g', price: 160, rating: '4.7', reviews: '850', emoji: '🌾', color: 'gold' },
    { name: 'Chakli', size: '200 g', price: 190, rating: '4.8', reviews: '1.5k', emoji: '🥨', color: 'biscuit' },
    { name: 'Jwari Bhel', size: '200 g', price: 120, rating: '4.7', reviews: '900', emoji: '🥗', color: 'yellow' },
  ],
  Evening: [
    { name: 'Chakli', size: '200 g', price: 190, rating: '4.8', reviews: '1.5k', emoji: '🥨', color: 'biscuit' },
    { name: 'Kothimbir Vadi Mix', size: '200 g', price: 110, rating: '4.6', reviews: '750', emoji: '🟩', color: 'sage' },
    { name: 'Nari Bhel', size: '200 g', price: 140, rating: '4.7', reviews: '1k', emoji: '🥣', color: 'peach' },
    { name: 'Thecha', size: '100 g', price: 180, rating: '4.6', reviews: '760', emoji: '🫙', color: 'stone' },
    { name: 'Masala Peanuts', size: '200 g', price: 130, rating: '4.8', reviews: '1.1k', emoji: '🥜', color: 'gold' },
  ],
  Night: [
    { name: 'Aaji’s Mango Pickle', size: '500 g', price: 250, rating: '4.9', reviews: '2.1k', emoji: '🥭', color: 'peach' },
    { name: 'Goda Masala', size: '200 g', price: 180, rating: '4.8', reviews: '1.4k', emoji: '🫙', color: 'spice' },
    { name: 'Thecha', size: '100 g', price: 180, rating: '4.6', reviews: '760', emoji: '🫙', color: 'stone' },
    { name: 'Bhajani', size: '500 g', price: 160, rating: '4.7', reviews: '850', emoji: '🌾', color: 'gold' },
    { name: 'Chakli', size: '200 g', price: 190, rating: '4.8', reviews: '1.5k', emoji: '🥨', color: 'biscuit' },
  ],
}

const timeTabs = [
  { label: 'Morning', range: '6 AM - 12 PM', icon: '☀️' },
  { label: 'Afternoon', range: '12 PM - 4 PM', icon: '🌤️' },
  { label: 'Evening', range: '4 PM - 8 PM', icon: '🌄' },
  { label: 'Night', range: '8 PM - 12 AM', icon: '🌙' },
]

const getTimeOfDay = (hour) => {
  if (hour >= 6 && hour < 12) return 'Morning'
  if (hour >= 12 && hour < 16) return 'Afternoon'
  if (hour >= 16 && hour < 20) return 'Evening'
  return 'Night'
}

const offerProducts = [
  { name: 'Aaji’s Mango Pickle', size: '500 g', price: 203, oldPrice: 299, discount: '32% OFF', rating: '4.8', reviews: '2.1k', emoji: '🥭', color: 'peach' },
  { name: 'Goda Masala', size: '200 g', price: 130, oldPrice: 180, discount: '28% OFF', rating: '4.7', reviews: '980', emoji: '🫙', color: 'spice' },
  { name: 'Chakli', size: '200 g', price: 113, oldPrice: 150, discount: '25% OFF', rating: '4.8', reviews: '1.5k', emoji: '🥨', color: 'biscuit' },
  { name: 'Bhajani', size: '500 g', price: 112, oldPrice: 160, discount: '30% OFF', rating: '4.6', reviews: '850', emoji: '🌾', color: 'gold' },
  { name: 'Jwari Bhel', size: '400 g', price: 160, oldPrice: 200, discount: '20% OFF', rating: '4.7', reviews: '1.1k', emoji: '🥗', color: 'yellow' },
]

const bestSellerProducts = [
  { name: 'Chakli', size: '200 g', price: 150, rating: '4.8', reviews: '1.5k', badge: 'Bestseller', emoji: '🥨', color: 'biscuit' },
  { name: 'Aaji’s Mango Pickle', size: '500 g', price: 239, rating: '4.7', reviews: '980', badge: 'Bestseller', emoji: '🥭', color: 'peach' },
  { name: 'Goda Masala', size: '100 g', price: 144, rating: '4.9', reviews: '2.1k', badge: "Customer's Choice", emoji: '🫙', color: 'spice' },
  { name: 'Jwari Bhel', size: '200 g', price: 120, rating: '4.7', reviews: '900', badge: 'Bestseller', emoji: '🥗', color: 'yellow' },
  { name: 'Thecha', size: '100 g', price: 180, rating: '4.6', reviews: '760', badge: "Customers' Choice", emoji: '🫙', color: 'stone' },
]

const productImages = {
  'Poha Chivda': '/assets/product-poha.jpeg',
  'Sabudana Chivda': '/assets/product-sabudana.jpeg',
  'Kothimbir Vadi Mix': '/assets/product-vadi.jpeg',
  Thecha: '/assets/product-thecha.jpeg',
  'Jwari Bhel': '/assets/product-jwari.jpeg',
  'Aaji’s Mango Pickle': '/assets/product-mango.jpeg',
  'Goda Masala': '/assets/product-goda.jpeg',
  Chakli: '/assets/product-chakli.jpeg',
  Bhajani: '/assets/product-bhajani.jpeg',
}

const slides = [
  {
    sources: imageSources('hero-kitchen-hero'),
    alt: "Naik Foods pickles, masalas and snacks from Aaji's kitchen",
    eyebrow: 'AUTHENTIC MAHARASHTRIAN FLAVOURS',
    title: "From Aaji's Kitchen\nto Your Home",
    description: 'Traditional snacks, pickles, masalas and more, made with love and delivered across India.',
    action: 'Shop Now',
    theme: 'kitchen',
  },
  {
    sources: imageSources('hero-deals-hero'),
    alt: 'Limited time deals on Naik Foods snacks and masalas',
    eyebrow: 'LIMITED TIME OFFER',
    title: "Grab It\nBefore It's Gone!",
    description: "Today's hot deals on your favourite Maharashtrian products.",
    action: 'Shop Deals',
    theme: 'deals',
  },
  {
    sources: imageSources('hero-taste-hero'),
    alt: 'A selection of Naik Foods products for every Maharashtrian taste',
    eyebrow: 'NOT SURE WHAT TO TRY?',
    title: 'Find Your Perfect\nMaharashtrian Taste',
    description: "Tell us what you're craving and we'll recommend the best products for you.",
    action: 'Find My Products',
    theme: 'taste',
  },
  {
    sources: imageSources('hero-gifting-hero'),
    alt: 'Naik Foods gift box filled with traditional Maharashtrian treats',
    eyebrow: 'THOUGHTFUL GIFTS, TIMELESS FLAVOURS',
    title: 'Gift the Taste\nof Maharashtra',
    description: 'Beautifully curated gift boxes filled with authentic snacks, pickles and masalas.',
    action: 'Explore Gift Boxes',
    theme: 'gifting',
  },
]

function ProductCard({ product, onAdd, onWishlist, isWishlisted, offer = false, bestSeller = false, onOpen }) {
  return (
    <article className="product-card" onClick={() => onOpen?.(product)}>
      <div className={`product-visual product-${product.color}`}>
        {offer && <span className="discount-badge">{product.discount}</span>}
        {bestSeller && <span className={`seller-badge ${product.badge.includes('Choice') ? 'choice' : ''}`}>{product.badge}</span>}
        <button className={`wishlist-button ${isWishlisted ? 'saved' : ''}`} type="button" aria-label={`${isWishlisted ? 'Remove' : 'Add'} ${product.name} ${isWishlisted ? 'from' : 'to'} wishlist`} onClick={(event) => { event.stopPropagation(); onWishlist(product.name) }}><Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} /></button>
        {(product.image || productImages[product.name]) ? <img className="product-image" src={product.image || productImages[product.name]} alt="" /> : <span className="product-emoji" aria-hidden="true">{product.emoji}</span>}
      </div>
      <div className="product-details">
        <h3>{product.name}</h3>
        <p>{product.size}</p>
        <strong>₹{product.price}</strong>
        {offer && <del>₹{product.oldPrice}</del>}
        <span className="rating"><Star size={13} fill="currentColor" /> {product.rating} ({product.reviews})</span>
        <button className="add-button" type="button" onClick={(event) => { event.stopPropagation(); onAdd(product.name) }}><ShoppingCart size={15} /> Add to Cart</button>
      </div>
    </article>
  )
}

function App() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('Home')
  const [notice, setNotice] = useState('')
  const [activeTime, setActiveTime] = useState('Morning')
  const [timeOffset, setTimeOffset] = useState(0)
  const [offerOffset, setOfferOffset] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const [wishlist, setWishlist] = useState([])
  const [countdown, setCountdown] = useState({ days: '02', hours: '15', minutes: '32', seconds: '18' })
  const [email, setEmail] = useState('')
  const [finderOpen, setFinderOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [spinOpen, setSpinOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartValue, setCartValue] = useState(0)
  const [cartItems, setCartItems] = useState([])
  const [discount, setDiscount] = useState(0)
  const [isNewUser, setIsNewUser] = useState(() => window.localStorage.getItem('naik-user-status') !== 'existing')
  const touchStart = useRef(null)
  const offerEnd = useRef(null)

  const goToSlide = (index) => setActiveSlide((index + slides.length) % slides.length)

  useEffect(() => {
    if (isPaused) return undefined
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 3500)
    return () => window.clearInterval(timer)
  }, [isPaused])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft') goToSlide(activeSlide - 1)
      if (event.key === 'ArrowRight') goToSlide(activeSlide + 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeSlide])

  const handleTouchStart = (event) => { touchStart.current = event.changedTouches[0].clientX }
  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return
    const distance = event.changedTouches[0].clientX - touchStart.current
    if (Math.abs(distance) > 45) goToSlide(activeSlide + (distance > 0 ? -1 : 1))
    touchStart.current = null
  }

  const showNotice = (message) => setNotice(message)

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 2600)
    return () => window.clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    const updateTimeOfDay = () => {
      const currentTime = getTimeOfDay(new Date().getHours())
      setActiveTime((previousTime) => {
        if (previousTime !== currentTime) setTimeOffset(0)
        return currentTime
      })
    }
    updateTimeOfDay()
    const timer = window.setInterval(updateTimeOfDay, 60000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    offerEnd.current = Date.now() + (2 * 86400000) + (15 * 3600000) + (32 * 60000) + 18000
    const updateCountdown = () => {
      const remaining = Math.max(0, offerEnd.current - Date.now())
      const days = Math.floor(remaining / 86400000)
      const hours = Math.floor((remaining % 86400000) / 3600000)
      const minutes = Math.floor((remaining % 3600000) / 60000)
      const seconds = Math.floor((remaining % 60000) / 1000)
      setCountdown({ days: String(days).padStart(2, '0'), hours: String(hours).padStart(2, '0'), minutes: String(minutes).padStart(2, '0'), seconds: String(seconds).padStart(2, '0') })
    }
    updateCountdown()
    const timer = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    showNotice(searchQuery.trim() ? `Searching for “${searchQuery.trim()}”` : 'Type a product or category to search')
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setIsCategoryOpen(false)
    showNotice(`${category} selected`)
  }

  const handleNavClick = (item, event) => {
    event.preventDefault()
    setActiveNav(item)
    const targetId = item === 'Home' ? '#home' : item === 'Groceries' ? '#time-products' : item === 'Offers' ? '#offers' : null
    if (targetId) document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' })
    else showNotice(`${item} section selected`)
  }

  const addToCart = (name, quantity = 1) => {
    const allProducts = [...Object.values(timeProducts).flat(), ...offerProducts, ...bestSellerProducts]
    const product = allProducts.find((item) => item.name === name)
    setCartCount((count) => count + 1)
    setCartValue((value) => value + ((product?.price || 0) * quantity))
    if (product) setCartItems((items) => {
      const existing = items.find((item) => item.name === name)
      return existing ? items.map((item) => item.name === name ? { ...item, quantity: item.quantity + quantity } : item) : [...items, { ...product, quantity }]
    })
    showNotice(`${name} added to cart`)
  }

  const changeCartQuantity = (name, change) => {
    const item = cartItems.find((entry) => entry.name === name)
    if (!item) return
    const nextQuantity = item.quantity + change
    if (nextQuantity <= 0) return removeCartItem(name)
    setCartItems((items) => items.map((entry) => entry.name === name ? { ...entry, quantity: nextQuantity } : entry))
    setCartCount((count) => count + change)
    setCartValue((value) => value + (item.price * change))
  }

  const removeCartItem = (name) => {
    const item = cartItems.find((entry) => entry.name === name)
    if (!item) return
    setCartItems((items) => items.filter((entry) => entry.name !== name))
    setCartCount((count) => count - item.quantity)
    setCartValue((value) => value - (item.price * item.quantity))
  }

  const applyDiscount = (amount) => {
    setDiscount(amount)
    setIsNewUser(false)
    window.localStorage.setItem('naik-user-status', 'existing')
    showNotice(`${amount}% discount applied at checkout`)
  }

  const toggleWishlist = (name) => {
    setWishlist((items) => items.includes(name) ? items.filter((item) => item !== name) : [...items, name])
    showNotice(`${name} ${wishlist.includes(name) ? 'removed from' : 'added to'} wishlist`)
  }

  const cycleProducts = (type, direction) => {
    const setter = type === 'time' ? setTimeOffset : setOfferOffset
    setter((offset) => (offset + direction + 5) % 5)
  }

  const selectTime = (time) => {
    setActiveTime(time)
    setTimeOffset(0)
  }

  const rotate = (products, offset) => [...products.slice(offset), ...products.slice(0, offset)]

  const handleSubscribe = (event) => {
    event.preventDefault()
    showNotice(email.trim() ? 'You are subscribed to Naik Foods updates' : 'Enter your email address to subscribe')
    if (email.trim()) setEmail('')
  }

  const handleFooterLink = (label) => showNotice(`${label} selected`)

  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Naik Foods home">
          <span className="brand-mark">✦</span>
          <span>Naik Foods<small>TASTE OF MAHARASHTRA</small></span>
        </a>
        <form className="search-row" onSubmit={handleSearch}>
          <div className="category-menu-wrap" onMouseEnter={() => setIsCategoryOpen(true)} onMouseLeave={() => setIsCategoryOpen(false)}>
            <button className="category-select" type="button" aria-haspopup="menu" aria-expanded={isCategoryOpen} onClick={() => setIsCategoryOpen((open) => !open)}>
              {selectedCategory} <ChevronDown size={15} />
            </button>
            {isCategoryOpen && <div className="category-menu" role="menu">
              {categories.map(({ label, icon: Icon }) => <button type="button" role="menuitem" className={selectedCategory === label ? 'selected' : ''} key={label} onClick={() => handleCategorySelect(label)}><Icon size={14} />{label}</button>)}
            </div>}
          </div>
          <div className="search-box"><button className="search-trigger" type="submit" aria-label="Search"><Search size={19} /></button><input aria-label="Search products" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search for pickles, snacks, masalas, gift boxes..." /></div>
        </form>
        <button className="finder-launch" type="button" onClick={() => setFinderOpen(true)}><Target size={17} /><span>Smart Product Finder</span></button>
        <button className="spin-launch" type="button" aria-label="Spin and win discount" onClick={() => setSpinOpen(true)}><span className="spin-launch-icon">◉</span><span>Spin &amp; Win</span></button>
        <div className="header-actions">
          <button type="button" aria-label="Login" onClick={() => showNotice('Login is ready to connect')}><UserRound size={21} /><span>Login</span></button>
          <button type="button" aria-label="Wishlist" onClick={() => showNotice('Your wishlist is empty')}><Heart size={23} /><span>Wishlist</span></button>
          <button type="button" aria-label="Cart" className="cart-button" onClick={() => setCartOpen(true)}><ShoppingCart size={24} /><i>{cartCount}</i><span>Cart</span></button>
        </div>
      </header>
      <nav className="main-nav" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <div className="nav-item-wrap" key={item} onMouseEnter={() => item === 'Shop' && setIsShopOpen(true)} onMouseLeave={() => item === 'Shop' && setIsShopOpen(false)}>
            <a className={activeNav === item ? 'active' : ''} href={`#${item.toLowerCase().replaceAll(' ', '-')}`} onClick={(event) => handleNavClick(item, event)}>{item}{item === 'Shop' && <ChevronDown size={14} />}</a>
            {item === 'Shop' && isShopOpen && <div className="shop-menu" role="menu"><button type="button" onClick={() => showNotice('Snacks selected')}>Snacks & Namkeen</button><button type="button" onClick={() => showNotice('Pickles selected')}>Pickles & Chutneys</button><button type="button" onClick={() => showNotice('Masalas selected')}>Masalas & Spices</button><button type="button" onClick={() => showNotice('Gift boxes selected')}>Gift Boxes</button></div>}
          </div>
        ))}
      </nav>
      {notice && <p className="header-notice" role="status">{notice}</p>}
      <section id="home" className="carousel" aria-roledescription="carousel" aria-label="Naik Foods highlights" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="slides-track" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
          {slides.map((slide) => (
            <article className={`slide slide-${slide.theme}`} key={slide.sources[0]} aria-hidden={slides[activeSlide].sources[0] !== slide.sources[0]}>
              <img src={slide.sources[0]} alt={slide.alt} data-source-index="0" onError={(event) => {
                const image = event.currentTarget
                const nextIndex = Number(image.dataset.sourceIndex) + 1
                if (nextIndex < slide.sources.length) {
                  image.dataset.sourceIndex = String(nextIndex)
                  image.src = slide.sources[nextIndex]
                } else {
                  image.style.display = 'none'
                }
              }} />
              <div className="slide-fallback">
                <span>{slide.eyebrow}</span>
                <h1>{slide.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
                <p>{slide.description}</p>
              </div>
            </article>
          ))}
        </div>
        <button className="carousel-control previous" type="button" aria-label="Previous slide" onClick={() => goToSlide(activeSlide - 1)}><ChevronLeft size={25} /></button>
        <button className="carousel-control next" type="button" aria-label="Next slide" onClick={() => goToSlide(activeSlide + 1)}><ChevronRight size={25} /></button>
        <div className="carousel-tools">
          <div className="pagination" aria-label="Choose slide">
            {slides.map((slide, index) => <button key={slide.sources[0]} className={index === activeSlide ? 'selected' : ''} aria-label={`Go to slide ${index + 1}`} aria-current={index === activeSlide ? 'true' : undefined} onClick={() => goToSlide(index)} type="button" />)}
          </div>
          <button className="pause-control" type="button" aria-label={isPaused ? 'Resume carousel' : 'Pause carousel'} onClick={() => setIsPaused((paused) => !paused)}>
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
          </button>
        </div>
      </section>
      <section id="time-products" className="shopping-band time-band" aria-labelledby="time-heading">
        <div className="band-intro">
          <img className="time-intro-image" src="/assets/time-intro.jpeg" alt="Good morning Maharashtrian flavours" />
          <span className="band-kicker">SHOP BY TIME OF DAY</span>
          <h2 id="time-heading">Good Morning!</h2>
          <p>Start your day with authentic<br />Maharashtrian flavours</p>
          <div className="benefit-row"><span>◉<small>Wholesome<br />Ingredients</small></span><span>♡<small>Traditional<br />Recipes</small></span><span>♧<small>Healthy<br />Snacking</small></span><span>♧<small>Pan India<br />Delivery</small></span></div>
        </div>
        <div className="band-products">
          <div className="time-tabs" role="tablist" aria-label="Shop by time of day">
            {timeTabs.map((tab) => <button className={activeTime === tab.label ? 'active' : ''} key={tab.label} type="button" role="tab" aria-selected={activeTime === tab.label} onClick={() => selectTime(tab.label)}><span>{tab.icon}</span><b>{tab.label}</b><small>({tab.range})</small></button>)}
          </div>
          <div className="band-heading"><span>Fresh picks for your {activeTime.toLowerCase()}</span><button type="button" onClick={() => showNotice(`Showing all ${activeTime.toLowerCase()} products`)}>View All <ChevronRight size={16} /></button></div>
          <div className="product-viewport">
            <div className="product-grid">{rotate(timeProducts[activeTime], timeOffset).map((product) => <ProductCard key={product.name} product={product} onAdd={addToCart} onWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.name)} onOpen={setSelectedProduct} />)}</div>
            <button className="product-arrow product-arrow-left" type="button" aria-label="Previous time-of-day products" onClick={() => cycleProducts('time', -1)}><ChevronLeft size={20} /></button>
            <button className="product-arrow product-arrow-right" type="button" aria-label="Next time-of-day products" onClick={() => cycleProducts('time', 1)}><ChevronRight size={20} /></button>
          </div>
        </div>
      </section>
      <section id="offers" className="shopping-band offers-band" aria-labelledby="offers-heading">
        <div className="band-intro">
          <img className="offers-intro-image" src="/assets/offers-intro.jpeg" alt="Limited time offers on Maharashtrian favourites" />
          <span className="band-kicker">🔥 LIMITED TIME OFFERS</span>
          <h2 id="offers-heading">Grab Your<br />Favourites Before<br />It’s Gone!</h2>
          <p>Special prices on our most loved products.</p>
          <button className="band-cta" type="button" onClick={() => showNotice('Showing all current offers')}>View All Offers <ChevronRight size={17} /></button>
        </div>
        <div className="offers-content">
          <div className="offer-timer" aria-label="Offer countdown"><Timer size={23} /><b>Offer Ends In</b><span><strong>{countdown.days}</strong><small>Days</small></span><span><strong>{countdown.hours}</strong><small>Hours</small></span><span><strong>{countdown.minutes}</strong><small>Minutes</small></span><span><strong>{countdown.seconds}</strong><small>Seconds</small></span></div>
          <div className="product-viewport offers-viewport"><div className="product-grid">{rotate(offerProducts, offerOffset).map((product) => <ProductCard key={product.name} product={product} offer onAdd={addToCart} onWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.name)} onOpen={setSelectedProduct} />)}</div><button className="product-arrow product-arrow-left" type="button" aria-label="Previous offers" onClick={() => cycleProducts('offer', -1)}><ChevronLeft size={20} /></button><button className="product-arrow product-arrow-right" type="button" aria-label="Next offers" onClick={() => cycleProducts('offer', 1)}><ChevronRight size={20} /></button></div>
        </div>
      </section>
      <section id="best-sellers" className="shopping-band best-sellers-band" aria-labelledby="best-sellers-heading">
        <div className="best-sellers-intro">
          <span className="best-sellers-kicker">♛ &nbsp; BEST SELLERS</span>
          <h2 id="best-sellers-heading">Maharashtra’s<br />Most Loved<br />Flavours</h2>
          <p>Our customers’ all-time favourites, crafted with tradition and trusted for their authentic taste.</p>
          <div className="best-seller-benefits"><span>♧<small>Authentic<br />Flavours</small></span><span>♡<small>Loved by<br />Thousands</small></span><span>☆<small>Top Rated<br />Products</small></span><span>♧<small>Pan India<br />Delivery</small></span></div>
          <button className="band-cta" type="button" onClick={() => showNotice('Showing all best sellers')}>Explore All Best Sellers <ChevronRight size={17} /></button>
        </div>
        <div className="best-sellers-content">
          <div className="best-sellers-heading"><span>Customer favourites</span><button type="button" onClick={() => showNotice('Showing all best sellers')}>View All Best Sellers <ChevronRight size={16} /></button></div>
          <div className="product-viewport"><div className="product-grid">{rotate(bestSellerProducts, offerOffset).map((product) => <ProductCard key={product.name} product={product} onAdd={addToCart} onWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.name)} bestSeller onOpen={setSelectedProduct} />)}</div><button className="product-arrow product-arrow-left" type="button" aria-label="Previous best sellers" onClick={() => cycleProducts('offer', -1)}><ChevronLeft size={20} /></button><button className="product-arrow product-arrow-right" type="button" aria-label="Next best sellers" onClick={() => cycleProducts('offer', 1)}><ChevronRight size={20} /></button></div>
          <div className="best-sellers-dots"><span className="active"></span><span></span><span></span></div>
        </div>
      </section>
      <footer className="site-footer">
        <section className="popular-searches" aria-labelledby="popular-searches-heading">
          <div className="footer-section-heading"><Search size={29} /><div><h2 id="popular-searches-heading">Popular Searches</h2><p>Explore what others are looking for...</p></div><span className="footer-script">Discover<br />Maharashtra’s<br />Rich Flavours ♡</span></div>
          <div className="search-chips">{popularSearches.map((search) => <button type="button" key={search} onClick={() => { setSearchQuery(search); showNotice(`Searching for ${search}`) }}>{search}</button>)}</div>
        </section>
        <section className="footer-benefits" aria-label="Our service promises">
          {footerBenefits.map(({ title, text, icon: Icon }) => <button type="button" key={title} onClick={() => showNotice(title)}><span className="benefit-icon"><Icon size={25} /></span><span><b>{title}</b><small>{text}</small></span></button>)}
        </section>
        <section className="footer-main">
          <div className="footer-brand-column"><a className="footer-brand" href="#home" onClick={(event) => { event.preventDefault(); document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' }) }}><span>✦</span>Naik Foods<small>TASTE OF MAHARASHTRA</small></a><p>Bringing authentic Maharashtrian flavours from local kitchens to homes across India.</p><strong>Same Tradition,<br />More Happiness ♡</strong></div>
          {Object.entries(footerColumns).map(([title, links]) => <div className="footer-link-column" key={title}><h3>{title}</h3>{links.map((link) => <button type="button" key={link} onClick={() => handleFooterLink(link)}>›&nbsp; {link}</button>)}</div>)}
          <div className="footer-connect"><h3>Stay Connected</h3><p>Get exclusive offers, new product updates and traditional recipes straight to your inbox.</p><form className="subscribe-form" onSubmit={handleSubscribe}><Mail size={18} /><input aria-label="Email address" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email address" type="email" /><button type="submit">Subscribe <Send size={15} /></button></form><h4>Download Our App</h4><div className="app-links"><button type="button" onClick={() => showNotice('Google Play download selected')}>▶ Google Play</button><button type="button" onClick={() => showNotice('App Store download selected')}>● App Store</button></div><h4>Follow Us</h4><div className="social-links"><button type="button" aria-label="Instagram" onClick={() => showNotice('Instagram selected')}><Camera size={20} /></button><button type="button" aria-label="Facebook" onClick={() => showNotice('Facebook selected')}><Globe2 size={20} /></button><button type="button" aria-label="YouTube" onClick={() => showNotice('YouTube selected')}><Video size={20} /></button><button type="button" aria-label="Twitter" onClick={() => showNotice('Twitter selected')}><AtSignIcon /></button><button type="button" aria-label="WhatsApp" onClick={() => showNotice('WhatsApp selected')}><MessageCircle size={20} /></button></div></div>
        </section>
        <section className="footer-bottom"><span>© 2024 Naik Foods. All rights reserved.</span><span>♧ &nbsp; AUTHENTIC TASTE &nbsp; • &nbsp; RICH TRADITION &nbsp; • &nbsp; A BRIGHTER TOMORROW &nbsp; ♧</span><span>We Accept &nbsp; <b>VISA</b> <b>MC</b> <b>UPI</b> <b>RuPay</b> <b>Paytm</b></span></section>
      </footer>
      <SmartProductFinder open={finderOpen} onClose={() => setFinderOpen(false)} onAdd={addToCart} onWishlist={toggleWishlist} wishlist={wishlist} showNotice={showNotice} onOpen={setSelectedProduct} />
      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} showNotice={showNotice} />}
      <SpinWheelModal open={spinOpen} onClose={() => setSpinOpen(false)} cartValue={cartValue} isNewUser={isNewUser} onApplied={applyDiscount} />
      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} cartValue={cartValue} discount={discount} onQuantity={changeCartQuantity} onRemove={removeCartItem} onSpin={() => { setCartOpen(false); setSpinOpen(true) }} showNotice={showNotice} />
    </main>
  )
}

export default App
