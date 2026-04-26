import { useState } from 'react'
import { X, Upload, Save, Image, ChevronDown } from 'lucide-react'

const CATEGORIES = ['GPU', 'CPU', 'Monitor', 'RAM', 'Placa Madre', 'Almacenamiento', 'Periféricos']

const emptyForm = { nombre: '', marca: '', desc: '', espec: '', precio: '', stock: '', cat: '', activo: true }

const MOBILE_INPUT_STYLE = {
  backgroundColor: '#0E1424', borderRadius: '10px', height: '44px',
  padding: '0 14px', border: '1px solid #1B2333', color: '#F5F7FA',
  fontFamily: 'Poppins', fontSize: '13px',
}
const MOBILE_TEXTAREA_STYLE = {
  backgroundColor: '#0E1424', borderRadius: '10px', padding: '12px 14px',
  border: '1px solid #1B2333', color: '#F5F7FA',
  fontFamily: 'Poppins', fontSize: '13px', resize: 'none',
}
const MOBILE_LABEL_STYLE = {
  color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600',
}

const MobileModalBody = ({ isEdit, product, onClose, onSave, form, onChange, onToggleActivo }) => (
  <div className="flex md:hidden flex-col min-h-screen" style={{ backgroundColor: '#070B16' }}>
    {/* Header */}
    <div
      className="flex items-center justify-between w-full"
      style={{ height: '56px', padding: '0 16px', backgroundColor: '#0A0F1C', borderBottom: '1px solid #1B2333', flexShrink: 0 }}
    >
      <button
        onClick={onClose}
        className="flex items-center justify-center border-none cursor-pointer"
        style={{ width: '36px', height: '36px', backgroundColor: '#1E2232', borderRadius: '8px' }}
      >
        <X size={18} color="#F5F7FA" />
      </button>
      <div className="flex flex-col items-center">
        <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
          {isEdit ? 'Editar Producto' : 'Agregar Producto'}
        </span>
        <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '10px' }}>
          {isEdit ? product?.name : 'Nuevo producto'}
        </span>
      </div>
      <div style={{ width: '36px' }} />
    </div>

    {/* Scrollable form */}
    <div className="flex flex-col" style={{ flex: 1, padding: '16px', gap: '14px', overflowY: 'auto', paddingBottom: '80px' }}>

      {/* Image upload */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ height: '140px', borderRadius: '12px', gap: '8px', border: `1px dashed ${isEdit ? '#24A8F5' : '#1B2333'}`, backgroundColor: isEdit ? '#0D2035' : '#0E1424' }}
      >
        {isEdit ? <Image size={32} color="#24A8F5" /> : <Upload size={28} color="#AAB3C5" />}
        <span style={{ color: isEdit ? '#F5F7FA' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500' }}>
          {isEdit ? 'Imagen actual cargada' : 'Subí una imagen del producto'}
        </span>
        <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '10px' }}>JPG, PNG, WEBP · Máx 5MB</span>
      </div>

      {/* Nombre + Marca */}
      <div className="flex" style={{ gap: '10px' }}>
        <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
          <span style={MOBILE_LABEL_STYLE}>Nombre del producto *</span>
          <input
            style={MOBILE_INPUT_STYLE}
            value={form.nombre} onChange={onChange('nombre')} placeholder="Ej: RTX 5090 24GB GDDR7"
          />
        </div>
        <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
          <span style={MOBILE_LABEL_STYLE}>Marca *</span>
          <input
            style={MOBILE_INPUT_STYLE}
            value={form.marca} onChange={onChange('marca')} placeholder="Ej: NVIDIA"
          />
        </div>
      </div>

      {/* Descripción */}
      <div className="flex flex-col" style={{ gap: '6px' }}>
        <span style={MOBILE_LABEL_STYLE}>Descripción</span>
        <textarea
          rows={3}
          style={MOBILE_TEXTAREA_STYLE}
          value={form.desc} onChange={onChange('desc')} placeholder="Describí el producto brevemente..."
        />
      </div>

      {/* Especificaciones */}
      <div className="flex flex-col" style={{ gap: '6px' }}>
        <span style={MOBILE_LABEL_STYLE}>Especificaciones técnicas</span>
        <textarea
          rows={3}
          style={MOBILE_TEXTAREA_STYLE}
          value={form.espec} onChange={onChange('espec')} placeholder="Ej: GPU Nativa 16384 CUDA Cores..."
        />
      </div>

      {/* Precio + Stock */}
      <div className="flex" style={{ gap: '10px' }}>
        <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
          <span style={MOBILE_LABEL_STYLE}>Precio (USD) *</span>
          <input
            style={MOBILE_INPUT_STYLE}
            value={form.precio} onChange={onChange('precio')} placeholder="0.00"
          />
        </div>
        <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
          <span style={MOBILE_LABEL_STYLE}>Stock *</span>
          <input
            type="number"
            style={MOBILE_INPUT_STYLE}
            value={form.stock} onChange={onChange('stock')} placeholder="0"
          />
        </div>
      </div>

      {/* Categoría */}
      <div className="flex flex-col" style={{ gap: '6px' }}>
        <span style={MOBILE_LABEL_STYLE}>Categoría *</span>
        <div
          className="flex items-center justify-between"
          style={{ backgroundColor: '#0E1424', borderRadius: '10px', height: '44px', padding: '0 14px', border: '1px solid #1B2333', cursor: 'pointer' }}
        >
          <select
            value={form.cat}
            onChange={onChange('cat')}
            style={{ background: 'none', border: 'none', color: form.cat ? '#F5F7FA' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', width: '100%', cursor: 'pointer', appearance: 'none' }}
          >
            <option value="" disabled>Seleccioná una categoría</option>
            {CATEGORIES.map(c => <option key={c} value={c} style={{ backgroundColor: '#0E1424' }}>{c}</option>)}
          </select>
          <ChevronDown size={14} color="#AAB3C5" style={{ pointerEvents: 'none', flexShrink: 0 }} />
        </div>
      </div>

      {/* Estado toggle */}
      <div className="flex items-center justify-between" style={{ padding: '4px 0' }}>
        <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Estado del producto</span>
        <div className="flex flex-col items-end" style={{ gap: '3px' }}>
          <button
            onClick={onToggleActivo}
            className="flex items-center border-none cursor-pointer"
            style={{
              width: '44px', height: '24px', borderRadius: '12px',
              backgroundColor: form.activo ? '#24A8F5' : '#1B2333',
              padding: '0 3px',
              justifyContent: form.activo ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
          </button>
          <span style={{ color: form.activo ? '#22C55E' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '10px', fontWeight: '600' }}>
            {form.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>
    </div>

    {/* Fixed footer */}
    <div
      className="flex items-center justify-between w-full"
      style={{ position: 'fixed', bottom: '64px', left: 0, right: 0, padding: '12px 16px', gap: '10px', backgroundColor: '#0E1424', borderTop: '1px solid #1B2333', zIndex: 55 }}
    >
      <button
        onClick={onClose}
        className="flex items-center justify-center flex-1 border-none cursor-pointer"
        style={{ backgroundColor: '#1B2333', borderRadius: '10px', height: '46px' }}
      >
        <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>Cancelar</span>
      </button>
      <button
        onClick={() => { onSave(form); onClose() }}
        className="flex items-center justify-center flex-1 border-none cursor-pointer"
        style={{ backgroundColor: '#24A8F5', borderRadius: '10px', height: '46px', gap: '8px' }}
      >
        <Save size={16} color="#FFFFFF" />
        <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
          {isEdit ? 'Guardar Cambios' : 'Guardar Producto'}
        </span>
      </button>
    </div>
  </div>
)

const ProductModal = ({ mode, product, onClose, onSave }) => {
  const isEdit = mode === 'edit'
  const [form, setForm] = useState(
    isEdit && product
      ? { nombre: product.name, marca: '', desc: '', espec: '', precio: product.price, stock: String(product.stock), cat: product.cat, activo: product.active }
      : emptyForm
  )

  const inputBg = isEdit ? '#0E1424' : '#080D1A'
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const inputStyle = {
    backgroundColor: inputBg, borderRadius: '6px', height: '38px',
    padding: '0 12px', border: '1px solid #1B2333', color: '#F5F7FA',
    fontFamily: 'Poppins', fontSize: '13px', width: '100%',
  }
  const textareaStyle = {
    ...inputStyle, height: '72px', padding: '10px 12px',
    resize: 'none', display: 'block',
  }
  const labelStyle = { color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500' }

  return (
    <>
      {/* ── MOBILE: full-screen overlay ── */}
      <div
        className="flex md:hidden items-start justify-center"
        style={{ position: 'fixed', inset: 0, backgroundColor: '#070B16', zIndex: 60 }}
      >
        <MobileModalBody
          isEdit={isEdit}
          product={product}
          onClose={onClose}
          onSave={onSave}
          form={form}
          onChange={set}
          onToggleActivo={() => setForm(f => ({ ...f, activo: !f.activo }))}
        />
      </div>

      {/* ── DESKTOP: modal overlay ── */}
      <div
        className="hidden md:flex items-start justify-center"
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,6,16,0.97)', zIndex: 50, paddingTop: '85px' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Producto"
        className="flex flex-col"
        style={{ width: '820px', height: '730px', backgroundColor: '#0E1424', borderRadius: '12px', border: '1px solid #1B2333', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ height: '64px', padding: '0 24px', borderBottom: '1px solid #1B2333', flexShrink: 0 }}
        >
          <div className="flex flex-col" style={{ gap: '3px' }}>
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '700' }}>
              {isEdit ? 'Editar Producto' : 'Agregar Producto'}
            </span>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
              {isEdit ? product?.name : 'Completá los datos del nuevo producto'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ width: '32px', height: '32px', backgroundColor: '#1B2333', borderRadius: '16px' }}
          >
            <X size={16} color="#AAB3C5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex" style={{ flex: 1, overflow: 'hidden' }}>
          {/* Left col — image */}
          <div
            className="flex flex-col"
            style={{ width: '280px', flexShrink: 0, backgroundColor: '#080D1A', padding: '24px', gap: '16px', borderRight: '1px solid #1B2333' }}
          >
            <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>
              Imagen del producto
            </span>
            <div
              className="flex flex-col items-center justify-center"
              style={{
                height: '200px', borderRadius: '8px', gap: '10px',
                border: `1px solid ${isEdit ? '#24A8F5' : '#1B2333'}`,
                backgroundColor: isEdit ? '#0D2035' : 'transparent',
              }}
            >
              {isEdit
                ? <Image size={40} color="#24A8F5" />
                : <Upload size={36} color="#AAB3C5" />
              }
              <span style={{ color: isEdit ? '#F5F7FA' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500' }}>
                {isEdit ? 'Imagen actual cargada' : 'Arrastrá la imagen aquí'}
              </span>
              {!isEdit && <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>o</span>}
              <button
                className="border-none cursor-pointer"
                style={{ backgroundColor: '#0D2035', borderRadius: '6px', padding: '7px 14px', border: '1px solid #24A8F5' }}
              >
                <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600' }}>
                  {isEdit ? 'Cambiar imagen' : 'Examinar archivos'}
                </span>
              </button>
            </div>
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '10px', textAlign: 'center' }}>
              JPG, PNG, WEBP · Máx 5MB
            </span>
          </div>

          {/* Right col — fields */}
          <div className="flex flex-col" style={{ flex: 1, padding: '24px', gap: '14px', overflowY: 'auto' }}>
            {/* Nombre + Marca */}
            <div className="flex" style={{ gap: '14px' }}>
              <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
                <span style={labelStyle}>Nombre del producto *</span>
                <input style={inputStyle} value={form.nombre} onChange={set('nombre')} placeholder="Ej: RTX 5090 24GB GDDR7" />
              </div>
              <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
                <span style={labelStyle}>Marca *</span>
                <input style={inputStyle} value={form.marca} onChange={set('marca')} placeholder="Ej: NVIDIA" />
              </div>
            </div>

            {/* Descripción */}
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <span style={labelStyle}>Descripción</span>
              <textarea
                style={textareaStyle}
                value={form.desc}
                onChange={set('desc')}
                placeholder="Describí el producto brevemente..."
              />
            </div>

            {/* Especificaciones */}
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <span style={labelStyle}>Especificaciones técnicas</span>
              <textarea
                style={textareaStyle}
                value={form.espec}
                onChange={set('espec')}
                placeholder="Ej: GPU Nativa 16384 CUDA Cores, 24GB GDDR7..."
              />
            </div>

            {/* Precio + Stock */}
            <div className="flex" style={{ gap: '14px' }}>
              <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
                <span style={labelStyle}>Precio (USD) *</span>
                <input style={inputStyle} value={form.precio} onChange={set('precio')} placeholder="0.00" />
              </div>
              <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
                <span style={labelStyle}>Stock *</span>
                <input style={inputStyle} value={form.stock} onChange={set('stock')} placeholder="0" type="number" />
              </div>
            </div>

            {/* Categoría */}
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <span style={labelStyle}>Categoría *</span>
              <div
                className="flex items-center justify-between"
                style={{ backgroundColor: inputBg, borderRadius: '6px', height: '38px', padding: '0 12px', border: '1px solid #1B2333', cursor: 'pointer', position: 'relative' }}
              >
                <select
                  value={form.cat}
                  onChange={set('cat')}
                  style={{ background: 'none', border: 'none', color: form.cat ? '#F5F7FA' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', width: '100%', cursor: 'pointer', appearance: 'none' }}
                >
                  <option value="" disabled>Seleccioná una categoría</option>
                  {CATEGORIES.map(c => <option key={c} value={c} style={{ backgroundColor: '#0E1424' }}>{c}</option>)}
                </select>
                <ChevronDown size={14} color="#AAB3C5" style={{ pointerEvents: 'none', flexShrink: 0 }} />
              </div>
            </div>

            {/* Estado */}
            <div className="flex items-center justify-between" style={{ padding: '4px 0' }}>
              <span style={labelStyle}>Estado del producto</span>
              <div className="flex flex-col items-end" style={{ gap: '3px' }}>
                <button
                  onClick={() => setForm(f => ({ ...f, activo: !f.activo }))}
                  className="flex items-center border-none cursor-pointer"
                  style={{
                    width: '44px', height: '24px', borderRadius: '12px',
                    backgroundColor: form.activo ? '#24A8F5' : '#1B2333',
                    padding: '0 3px',
                    justifyContent: form.activo ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                </button>
                <span style={{ color: form.activo ? '#22C55E' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '10px', fontWeight: '600' }}>
                  {form.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ height: '1px', backgroundColor: '#1B2333', flexShrink: 0 }} />
        <div
          className="flex items-center justify-between"
          style={{ height: '60px', padding: '0 24px', flexShrink: 0 }}
        >
          <button
            onClick={onClose}
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ backgroundColor: '#1B2333', borderRadius: '6px', height: '38px', padding: '0 20px' }}
          >
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Cancelar</span>
          </button>
          <button
            onClick={() => { onSave(form); onClose() }}
            className="flex items-center justify-center border-none cursor-pointer"
            style={{ backgroundColor: '#24A8F5', borderRadius: '6px', height: '38px', padding: '0 20px', gap: '8px' }}
          >
            <Save size={14} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
              {isEdit ? 'Guardar Cambios' : 'Guardar Producto'}
            </span>
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default ProductModal
