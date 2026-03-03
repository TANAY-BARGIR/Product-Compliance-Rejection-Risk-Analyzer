import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IngredientRow from '../components/IngredientRow';
import { evaluateProduct } from '../api';
import './EvaluatePage.css';

const EMPTY_INGREDIENT = { name: '', concentration: 0, unit: '%' };

const CATEGORIES = [
  { value: 'soap', label: 'Toilet Soap (BIS IS 2888:2004)' },
  { value: 'cookies', label: 'Cookies & Biscuits (FSSAI 2.11.10)' },
];

function EvaluatePage({ onResult }) {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('soap');
  const [ingredients, setIngredients] = useState([{ ...EMPTY_INGREDIENT }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addIngredient = () => {
    setIngredients([...ingredients, { ...EMPTY_INGREDIENT }]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index, updated) => {
    const next = [...ingredients];
    next[index] = updated;
    setIngredients(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (!productName.trim()) {
      setError('Product name is required');
      return;
    }

    const validIngredients = ingredients.filter((i) => i.name.trim());
    if (validIngredients.length === 0) {
      setError('Add at least one ingredient');
      return;
    }

    const requestData = {
      productName: productName.trim(),
      category,
      ingredients: validIngredients.map((i) => ({
        name: i.name.trim(),
        concentration: Number(i.concentration),
        unit: i.unit,
      })),
    };

    setLoading(true);

    try {
      const result = await evaluateProduct(requestData);
      onResult(result, requestData);
      navigate('/results');
    } catch (err) {
      setError(err.message || 'Evaluation failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Hero section */}
      <div className="evaluate-hero animate-fade-in">
        <div className="hero-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 14l2 2 4-4" />
          </svg>
        </div>
        <div>
          <h1>Evaluate Product Compliance</h1>
          <p>Submit a product formulation to check regulatory compliance and assess rejection risk.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="evaluate-form">
        {/* Product info */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h3 className="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Product Information
          </h3>

          <div className="product-fields">
            <div className="form-group" style={{ flex: 2 }}>
              <label htmlFor="productName">Product Name</label>
              <input
                id="productName"
                type="text"
                className="form-input"
                placeholder="e.g. Premium Bath Soap"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="section-header">
            <h3 className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              Ingredients
            </h3>
            <button type="button" className="btn btn-outline btn-sm" onClick={addIngredient}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Ingredient
            </button>
          </div>

          <div className="ingredient-labels">
            <div style={{ width: 28 }}></div>
            <span className="il-name">Ingredient Name</span>
            <span className="il-conc">Concentration</span>
            <span className="il-unit">Unit</span>
            {ingredients.length > 1 && <div style={{ width: 32 }}></div>}
          </div>

          <div className="ingredients-list">
            {ingredients.map((ing, i) => (
              <IngredientRow
                key={i}
                ingredient={ing}
                index={i}
                onChange={updateIngredient}
                onRemove={removeIngredient}
                canRemove={ingredients.length > 1}
              />
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error-banner animate-fade-in">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="submit-section animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Evaluating...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" />
                  <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
                </svg>
                Evaluate Compliance
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EvaluatePage;
