import './IngredientRow.css';

function IngredientRow({ ingredient, index, onChange, onRemove, canRemove }) {
  const handleChange = (field, value) => {
    onChange(index, { ...ingredient, [field]: field === 'concentration' ? parseFloat(value) || 0 : value });
  };

  return (
    <div className="ingredient-row animate-slide-in">
      <div className="ir-number">{index + 1}</div>

      <div className="ir-fields">
        <input
          type="text"
          className="form-input ir-name"
          placeholder="e.g. TFM, Sodium Hydroxide, Lye"
          value={ingredient.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />

        <input
          type="number"
          className="form-input ir-concentration"
          placeholder="0.0"
          value={ingredient.concentration || ''}
          onChange={(e) => handleChange('concentration', e.target.value)}
          min="0"
          step="any"
          required
        />

        <select
          className="form-input ir-unit"
          value={ingredient.unit}
          onChange={(e) => handleChange('unit', e.target.value)}
        >
          <option value="%">%</option>
          <option value="ppm">ppm</option>
          <option value="mg/kg">mg/kg</option>
        </select>
      </div>

      {canRemove && (
        <button
          type="button"
          className="btn btn-danger btn-sm ir-remove"
          onClick={() => onRemove(index)}
          title="Remove ingredient"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default IngredientRow;
