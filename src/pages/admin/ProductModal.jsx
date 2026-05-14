import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Upload, Save, Image, ChevronDown, Plus, Trash2, Loader } from 'lucide-react'
import { createProduct, updateProduct, getCategories } from '../../api/products'

/* ─── shared styles ─── */
const INPUT_STYLE_BASE = {
  backgroundColor: '#080D1A', borderRadius: '6px', height: '38px',
  padding: '0 12px', border: '1px solid #1B2333', color: '#F5F7FA',
  fontFamily: 'Poppins', fontSize: '13px', width: '100%',
}
const TEXTAREA_STYLE_BASE = {
  ...INPUT_STYLE_BASE, height: '72px', padding: '10px 12px',
  resize: 'none', display: 'block',
}
const LABEL_STYLE = { color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500' }
const ERR_STYLE  = { color: '#EF4444', fontFamily: 'Poppins', fontSize: '11px', marginTop: '3px' }

const inputStyle  = (hasErr) => ({ ...INPUT_STYLE_BASE,  border: `1px solid ${hasErr ? '#EF4444' : '#1B2333'}` })
const taStyle     = (hasErr) => ({ ...TEXTAREA_STYLE_BASE, border: `1px solid ${hasErr ? '#EF4444' : '#1B2333'}` })

const MOBILE_INPUT = {
  backgroundColor: '#0E1424', borderRadius: '10px', height: '44px',
  padding: '0 14px', border: '1px solid #1B2333', color: '#F5F7FA',
  fontFamily: 'Poppins', fontSize: '13px',
  width: '100%', boxSizing: 'border-box',
}
const MOBILE_TA = { ...MOBILE_INPUT, height: 'auto', padding: '12px 14px', resize: 'none' }
const MOBILE_LABEL = { color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }

const emptyForm = {
  brand: '', name: '', spec: '', description: '', priceArs: '', stock: '',
  categoryId: '', badge: '',
}

/* ─── useProductForm — shared logic for add & edit ─── */
const useProductForm = ({ mode, product, onSave, onClose, navigate }) => {
  const isEdit = mode === 'edit'

  const [form, setForm] = useState(() => {
    if (isEdit && product) {
      return {
        brand: product.brand ?? '',
        name: product.name ?? '',
        spec: product.spec ?? '',
        description: product.description ?? '',
        priceArs: String(product.price_ars ?? ''),
        stock: String(product.stock ?? ''),
        categoryId: product.category_id ?? '',
        badge: product.badge ?? '',
      }
    }
    return emptyForm
  })

  const [specRows, setSpecRows] = useState(() => {
    if (isEdit && product?.specs) {
      return Object.entries(product.specs).map(([key, value]) => ({ id: crypto.randomUUID(), key, value }))
    }
    return []
  })

  const [imageFile, setImage]   = useState(null)
  const [gallery, setGalleryRaw] = useState([])
  const [existingGallery, setExistingGallery] = useState(() =>
    isEdit && product?.gallery ? [...product.gallery] : []
  )
  const [galleryDirty, setGalleryDirty] = useState(false)
  const setGallery = (next) => {
    setGalleryRaw(typeof next === 'function' ? next : () => next)
    setGalleryDirty(true)
  }
  const removeExistingGallery = (url) => {
    setExistingGallery(g => g.filter(u => u !== url))
    setGalleryDirty(true)
  }
  const [categories, setCats]   = useState([])
  const [catsLoading, setCL]    = useState(true)
  const [fieldErrs, setFieldErrs] = useState({})
  const [globalErr, setGlobalErr] = useState(null)
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    getCategories()
      .then(setCats)
      .catch(() => setCats([]))
      .finally(() => setCL(false))
  }, [])

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    setFieldErrs(fe => ({ ...fe, [k]: undefined }))
  }

  const addSpecRow    = () => setSpecRows(r => r.length >= 20 ? r : [...r, { id: crypto.randomUUID(), key: '', value: '' }])
  const removeSpecRow = (id) => setSpecRows(r => r.filter(row => row.id !== id))
  const setSpecKey    = (id, v) => setSpecRows(r => r.map(row => row.id === id ? { ...row, key: v }   : row))
  const setSpecVal    = (id, v) => setSpecRows(r => r.map(row => row.id === id ? { ...row, value: v } : row))

  const validate = () => {
    const errs = {}
    if (!form.brand.trim())                      errs.brand     = 'La marca es obligatoria'
    else if (form.brand.trim().length > 50)      errs.brand     = 'La marca no puede superar 50 caracteres'
    if (!form.name.trim())                       errs.name      = 'El nombre es obligatorio'
    else if (form.name.trim().length > 150)      errs.name      = 'El nombre no puede superar 150 caracteres'
    if (form.spec && form.spec.trim().length > 255)
                                                 errs.spec      = 'La especificación no puede superar 255 caracteres'
    if (form.description && form.description.length > 2000)
                                                 errs.description = 'La descripción no puede superar 2000 caracteres'
    if (!form.categoryId)                        errs.categoryId = 'La categoría es obligatoria'
    if (!form.priceArs || isNaN(Number(form.priceArs)) || Number(form.priceArs) <= 0)
                                                 errs.priceArs  = 'El precio debe ser mayor a cero'
    else if (!/^\d{1,10}(\.\d{1,2})?$/.test(String(form.priceArs)))
                                                 errs.priceArs  = 'Formato de precio inválido'
    if (form.stock === '' || isNaN(Number(form.stock)) || Number(form.stock) < 0)
                                                 errs.stock     = 'El stock no puede ser negativo'
    else if (Number(form.stock) > 999999)        errs.stock     = 'El stock no puede superar 999999'
    if (form.badge && !['NUEVO', 'HOT', 'OFERTA'].includes(form.badge))
                                                 errs.badge     = 'Badge inválido. Valores permitidos: NUEVO, HOT, OFERTA'
    if (!isEdit && !imageFile)                   errs.image     = 'La imagen principal es obligatoria'
    if (existingGallery.length + gallery.length > 3)
                                                 errs.gallery   = 'La galería no puede tener más de 3 fotos'

    if (specRows.length > 20) {
      errs.specs = 'No se permiten más de 20 specs'
    } else {
      for (const { key, value } of specRows) {
        const k = key.trim()
        if (!k && value.trim()) { errs.specs = 'Las claves de specs no pueden estar vacías'; break }
        if (k.length > 50)      { errs.specs = 'Las claves de specs no pueden superar 50 caracteres'; break }
        if (value.length > 200) { errs.specs = 'Los valores de specs no pueden superar 200 caracteres'; break }
      }
    }
    return errs
  }

  const setImageSafe = (file) => {
    if (!file) { setImage(null); return }
    if (!file.type.startsWith('image/')) {
      setFieldErrs(fe => ({ ...fe, image: 'El archivo debe ser una imagen válida' }))
      return
    }
    setFieldErrs(fe => ({ ...fe, image: undefined }))
    setImage(file)
  }

  const addGalleryFiles = (files) => {
    const arr = Array.from(files)
    const invalid = arr.find(f => !f.type.startsWith('image/'))
    if (invalid) {
      setFieldErrs(fe => ({ ...fe, gallery: 'Todos los archivos de galería deben ser imágenes válidas' }))
      return
    }
    const remaining = 3 - existingGallery.length - gallery.length
    if (remaining <= 0) return
    setFieldErrs(fe => ({ ...fe, gallery: undefined }))
    const toAdd = arr.slice(0, remaining)
    setGallery(prev => [...prev, ...toAdd])
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setFieldErrs(errs); return }

    const specs = {}
    specRows.forEach(({ key, value }) => { if (key.trim()) specs[key.trim()] = value })

    const data = {
      brand: form.brand.trim(),
      name: form.name.trim(),
      categoryId: form.categoryId,
      priceArs: Number(form.priceArs),
      stock: Number(form.stock),
      ...(form.spec        && { spec: form.spec.trim() }),
      ...(form.description && { description: form.description.trim() }),
      ...(form.badge       && { badge: form.badge }),
      ...(Object.keys(specs).length && { specs }),
    }

    setSaving(true)
    setGlobalErr(null)
    try {
      if (isEdit) {
        const keep = galleryDirty ? existingGallery : null
        const saved = await updateProduct(product.id, data, imageFile, gallery, keep)
        onSave(saved, 'edit')
      } else {
        const created = await createProduct(data, imageFile, gallery)
        onSave(created, 'add')
      }
      onClose()
    } catch (err) {
      if (err.status === 401) { navigate('/login'); return }
      if (err.fields) { setFieldErrs(err.fields); setSaving(false); return }
      if (err.status === 404) setGlobalErr('Producto o categoría no encontrada')
      else if (err.status >= 500) setGlobalErr('Error al subir la imagen, intentá de nuevo')
      else setGlobalErr(err.message ?? 'Error al guardar el producto')
      setSaving(false)
    }
  }

  return {
    form, set, specRows, addSpecRow, removeSpecRow, setSpecKey, setSpecVal,
    imageFile, setImage: setImageSafe, gallery, setGallery, addGalleryFiles,
    existingGallery, removeExistingGallery,
    categories, catsLoading, fieldErrs, globalErr, saving, handleSave,
  }
}

/* ─────────────────────────────────── Mobile body ─── */
const MobileBody = ({ mode, product, state, onClose }) => {
  const isEdit = mode === 'edit'
  const { form, set, specRows, addSpecRow, removeSpecRow, setSpecKey, setSpecVal,
          imageFile, setImage, gallery, setGallery, addGalleryFiles,
          existingGallery, removeExistingGallery,
          categories, catsLoading, fieldErrs, globalErr, saving, handleSave } = state
  const imgRef = useRef()
  const galRef = useRef()
  const totalGallery = existingGallery.length + gallery.length
  const specsFull = specRows.length >= 20

  return (
    <div className="flex md:hidden flex-col w-full h-screen" style={{ backgroundColor: '#070B16' }}>
      {/* Header */}
      <div className="flex items-center justify-between w-full"
        style={{ height: '56px', padding: '0 16px', backgroundColor: '#0A0F1C', borderBottom: '1px solid #1B2333', flexShrink: 0 }}>
        <button onClick={onClose} className="flex items-center justify-center border-none cursor-pointer"
          style={{ width: '36px', height: '36px', backgroundColor: '#1E2232', borderRadius: '8px' }}>
          <X size={18} color="#F5F7FA" />
        </button>
        <div className="flex flex-col items-center">
          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '15px', fontWeight: '700' }}>
            {isEdit ? 'Editar Producto' : 'Agregar Producto'}
          </span>
          <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>
            {isEdit ? (product?.name ?? '') : 'Nuevo producto'}
          </span>
        </div>
        <div style={{ width: '36px' }} />
      </div>

      {/* Form */}
      <div className="flex flex-col" style={{ flex: 1, padding: '16px', gap: '14px', overflowY: 'auto', paddingBottom: '110px' }}>

        {globalErr && (
          <div style={{ backgroundColor: '#2D1010', border: '1px solid #EF4444', borderRadius: '8px', padding: '10px 14px' }}>
            <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '12px' }}>{globalErr}</span>
          </div>
        )}

        {/* Imagen principal */}
        <div className="flex flex-col" style={{ gap: '6px' }}>
          <span style={MOBILE_LABEL}>Imagen principal {!isEdit && '*'}</span>
          <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { setImage(e.target.files[0] ?? null); e.target.value = '' }} />
          <button type="button" className="flex flex-col items-center justify-center cursor-pointer"
            style={{ height: '120px', borderRadius: '12px', gap: '8px', overflow: 'hidden', width: '100%',
              border: `1px dashed ${fieldErrs.image ? '#EF4444' : '#1B2333'}`, backgroundColor: '#0E1424', padding: 0 }}
            onClick={() => imgRef.current.click()}>
            {imageFile ? (
              <>
                <Upload size={24} color="#24A8F5" />
                <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', textAlign: 'center', padding: '0 8px', wordBreak: 'break-all' }}>
                  {imageFile.name}
                </span>
              </>
            ) : isEdit && product?.image_url ? (
              <>
                <img src={product.image_url} alt={product.name}
                  style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '6px' }} />
                <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
                  Imagen actual · tocá para cambiar
                </span>
              </>
            ) : (
              <>
                <Upload size={24} color={fieldErrs.image ? '#EF4444' : '#AAB3C5'} />
                <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px' }}>
                  Tocá para seleccionar imagen
                </span>
              </>
            )}
          </button>
          {fieldErrs.image && <span style={ERR_STYLE}>{fieldErrs.image}</span>}
        </div>

        {/* Galería */}
        <div className="flex flex-col" style={{ gap: '6px' }}>
          <span style={MOBILE_LABEL}>Galería (opcional)</span>
          <input ref={galRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
            onChange={e => { addGalleryFiles(e.target.files); e.target.value = '' }} />
          <button onClick={() => galRef.current.click()} className="border-none cursor-pointer"
            style={{ ...MOBILE_INPUT, border: `1px solid ${fieldErrs.gallery ? '#EF4444' : '#1B2333'}`, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', justifyContent: 'flex-start' }}>
            <Upload size={14} color="#AAB3C5" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px' }}>
              {totalGallery > 0
                ? `${totalGallery}/3 foto(s) en galería · tocá para agregar`
                : 'Seleccionar fotos (máx 3)'}
            </span>
          </button>
          {existingGallery.length > 0 && (
            <div className="flex" style={{ gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              {existingGallery.map((url) => (
                <div key={url} style={{ position: 'relative', width: '64px', height: '64px' }}>
                  <img src={url} alt="" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #1B2333' }} />
                  <button onClick={() => removeExistingGallery(url)} className="border-none cursor-pointer flex items-center justify-center"
                    style={{ position: 'absolute', top: '-6px', right: '-6px', width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#EF4444', padding: 0 }}>
                    <X size={12} color="#FFFFFF" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {gallery.length > 0 && (
            <div className="flex flex-col" style={{ gap: '4px', marginTop: '4px' }}>
              {gallery.map((f) => (
                <div key={`${f.name}-${f.lastModified}-${f.size}`} className="flex items-center justify-between">
                  <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{f.name}</span>
                  <button onClick={() => setGallery(prev => prev.filter(g => g !== f))} className="border-none cursor-pointer" style={{ background: 'none', padding: '0 0 0 6px' }}>
                    <X size={14} color="#EF4444" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {fieldErrs.gallery && <span style={ERR_STYLE}>{fieldErrs.gallery}</span>}
        </div>

        {/* Nombre + Marca */}
        <div className="flex" style={{ gap: '10px' }}>
          <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
            <span style={MOBILE_LABEL}>Nombre *</span>
            <input style={{ ...MOBILE_INPUT, border: `1px solid ${fieldErrs.name ? '#EF4444' : '#1B2333'}` }}
              maxLength={150} value={form.name} onChange={set('name')} placeholder="Ej: RTX 5090 24GB" />
            {fieldErrs.name && <span style={ERR_STYLE}>{fieldErrs.name}</span>}
          </div>
          <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
            <span style={MOBILE_LABEL}>Marca *</span>
            <input style={{ ...MOBILE_INPUT, border: `1px solid ${fieldErrs.brand ? '#EF4444' : '#1B2333'}` }}
              maxLength={50} value={form.brand} onChange={set('brand')} placeholder="Ej: NVIDIA" />
            {fieldErrs.brand && <span style={ERR_STYLE}>{fieldErrs.brand}</span>}
          </div>
        </div>

        {/* Spec corta */}
        <div className="flex flex-col" style={{ gap: '6px' }}>
          <span style={MOBILE_LABEL}>Resumen técnico</span>
          <input style={{ ...MOBILE_INPUT, border: `1px solid ${fieldErrs.spec ? '#EF4444' : '#1B2333'}` }}
            maxLength={255} value={form.spec} onChange={set('spec')} placeholder="Ej: 12GB GDDR6X" />
          {fieldErrs.spec && <span style={ERR_STYLE}>{fieldErrs.spec}</span>}
        </div>

        {/* Descripción */}
        <div className="flex flex-col" style={{ gap: '6px' }}>
          <span style={MOBILE_LABEL}>Descripción</span>
          <textarea rows={3} style={{ ...MOBILE_TA, border: `1px solid ${fieldErrs.description ? '#EF4444' : '#1B2333'}` }}
            maxLength={2000} value={form.description} onChange={set('description')}
            placeholder="Describí el producto brevemente..." />
          {fieldErrs.description && <span style={ERR_STYLE}>{fieldErrs.description}</span>}
        </div>

        {/* Precio + Stock */}
        <div className="flex" style={{ gap: '10px' }}>
          <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
            <span style={MOBILE_LABEL}>Precio (ARS) *</span>
            <input type="number" min={0} step="0.01" style={{ ...MOBILE_INPUT, border: `1px solid ${fieldErrs.priceArs ? '#EF4444' : '#1B2333'}` }}
              value={form.priceArs} onChange={set('priceArs')} placeholder="0" />
            {fieldErrs.priceArs && <span style={ERR_STYLE}>{fieldErrs.priceArs}</span>}
          </div>
          <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
            <span style={MOBILE_LABEL}>Stock *</span>
            <input type="number" min={0} max={999999} style={{ ...MOBILE_INPUT, border: `1px solid ${fieldErrs.stock ? '#EF4444' : '#1B2333'}` }}
              value={form.stock} onChange={set('stock')} placeholder="0" />
            {fieldErrs.stock && <span style={ERR_STYLE}>{fieldErrs.stock}</span>}
          </div>
        </div>

        {/* Categoría + Badge */}
        <div className="flex" style={{ gap: '10px' }}>
          <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
            <span style={MOBILE_LABEL}>Categoría *</span>
            <div className="flex items-center justify-between"
              style={{ ...MOBILE_INPUT, border: `1px solid ${fieldErrs.categoryId ? '#EF4444' : '#1B2333'}`, cursor: 'pointer' }}>
              <select value={form.categoryId} onChange={set('categoryId')} disabled={catsLoading}
                style={{ background: 'none', border: 'none', color: form.categoryId ? '#F5F7FA' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', width: '100%', cursor: 'pointer', appearance: 'none' }}>
                <option value="" disabled>{catsLoading ? 'Cargando...' : 'Categoría'}</option>
                {categories.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#0E1424' }}>{c.label}</option>)}
              </select>
              <ChevronDown size={14} color="#AAB3C5" style={{ pointerEvents: 'none', flexShrink: 0 }} />
            </div>
            {fieldErrs.categoryId && <span style={ERR_STYLE}>{fieldErrs.categoryId}</span>}
          </div>
          <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
            <span style={MOBILE_LABEL}>Badge</span>
            <div className="flex items-center justify-between" style={{ ...MOBILE_INPUT, border: `1px solid ${fieldErrs.badge ? '#EF4444' : '#1B2333'}`, cursor: 'pointer' }}>
              <select value={form.badge} onChange={set('badge')}
                style={{ background: 'none', border: 'none', color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', width: '100%', cursor: 'pointer', appearance: 'none' }}>
                <option value="">Sin badge</option>
                <option value="NUEVO" style={{ backgroundColor: '#0E1424' }}>NUEVO</option>
                <option value="HOT" style={{ backgroundColor: '#0E1424' }}>HOT</option>
                <option value="OFERTA" style={{ backgroundColor: '#0E1424' }}>OFERTA</option>
              </select>
              <ChevronDown size={14} color="#AAB3C5" style={{ pointerEvents: 'none', flexShrink: 0 }} />
            </div>
            {fieldErrs.badge && <span style={ERR_STYLE}>{fieldErrs.badge}</span>}
          </div>
        </div>

        {/* Specs clave-valor */}
        <div className="flex flex-col" style={{ gap: '8px' }}>
          <span style={MOBILE_LABEL}>Especificaciones técnicas</span>
          {fieldErrs.specs && <span style={ERR_STYLE}>{fieldErrs.specs}</span>}
          {specRows.map((row) => (
            <div key={row.id} className="flex items-center" style={{ gap: '6px' }}>
              <input placeholder="Clave" maxLength={50} value={row.key} onChange={e => setSpecKey(row.id, e.target.value)}
                style={{ ...MOBILE_INPUT, flex: 1 }} />
              <input placeholder="Valor" maxLength={200} value={row.value} onChange={e => setSpecVal(row.id, e.target.value)}
                style={{ ...MOBILE_INPUT, flex: 1 }} />
              <button onClick={() => removeSpecRow(row.id)} className="border-none cursor-pointer"
                style={{ background: 'none', padding: 0 }}>
                <Trash2 size={16} color="#EF4444" />
              </button>
            </div>
          ))}
          <button onClick={addSpecRow} disabled={specsFull} className="flex items-center justify-center border-none"
            style={{ backgroundColor: '#0E1424', borderRadius: '8px', height: '36px', border: '1px dashed #1B2333', gap: '6px',
              cursor: specsFull ? 'not-allowed' : 'pointer', opacity: specsFull ? 0.5 : 1 }}>
            <Plus size={14} color="#24A8F5" />
            <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>
              {specsFull ? 'Máximo 20 specs' : 'Agregar especificación'}
            </span>
          </button>
        </div>
      </div>

      {/* Footer fijo */}
      <div className="flex items-center justify-between w-full"
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px', gap: '10px', backgroundColor: '#0E1424', borderTop: '1px solid #1B2333', zIndex: 55 }}>
        <button onClick={onClose} className="flex items-center justify-center flex-1 border-none cursor-pointer"
          style={{ backgroundColor: '#1B2333', borderRadius: '10px', height: '46px' }}>
          <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '600' }}>Cancelar</span>
        </button>
        <button onClick={handleSave} disabled={saving} className="flex items-center justify-center flex-1 border-none cursor-pointer"
          style={{ backgroundColor: saving ? '#1A6FA8' : '#24A8F5', borderRadius: '10px', height: '46px', gap: '8px' }}>
          {saving
            ? <Loader size={16} color="#FFFFFF" style={{ animation: 'spin 1s linear infinite' }} />
            : <Save size={16} color="#FFFFFF" />
          }
          <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '14px', fontWeight: '700' }}>
            {saving ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Guardar Producto'}
          </span>
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────── Desktop body ─── */
const DesktopBody = ({ mode, product, state, onClose }) => {
  const isEdit = mode === 'edit'
  const { form, set, specRows, addSpecRow, removeSpecRow, setSpecKey, setSpecVal,
          imageFile, setImage, gallery, setGallery, addGalleryFiles,
          existingGallery, removeExistingGallery,
          categories, catsLoading, fieldErrs, globalErr, saving, handleSave } = state
  const imgRef = useRef()
  const galRef = useRef()
  const totalGallery = existingGallery.length + gallery.length
  const specsFull = specRows.length >= 20

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between"
        style={{ height: '64px', padding: '0 24px', borderBottom: '1px solid #1B2333', flexShrink: 0 }}>
        <div className="flex flex-col" style={{ gap: '3px' }}>
          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '16px', fontWeight: '700' }}>
            {isEdit ? 'Editar Producto' : 'Agregar Producto'}
          </span>
          <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
            {isEdit ? (product?.name ?? '') : 'Completá los datos del nuevo producto'}
          </span>
        </div>
        <button onClick={onClose} className="flex items-center justify-center border-none cursor-pointer"
          style={{ width: '32px', height: '32px', backgroundColor: '#1B2333', borderRadius: '16px' }}>
          <X size={16} color="#AAB3C5" />
        </button>
      </div>

      {globalErr && (
        <div style={{ margin: '12px 24px 0', backgroundColor: '#2D1010', border: '1px solid #EF4444', borderRadius: '8px', padding: '10px 14px' }}>
          <span style={{ color: '#EF4444', fontFamily: 'Poppins', fontSize: '12px' }}>{globalErr}</span>
        </div>
      )}

      {/* Body */}
      <div className="flex" style={{ flex: 1, overflow: 'hidden' }}>
        {/* Left — imagen + galería */}
        <div className="flex flex-col"
          style={{ width: 'clamp(220px, 28%, 280px)', flexShrink: 0, backgroundColor: '#080D1A', padding: '24px', gap: '16px', borderRight: '1px solid #1B2333', overflowY: 'auto' }}>
          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>
            Imagen del producto {!isEdit && '*'}
          </span>
          <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { setImage(e.target.files[0] ?? null); e.target.value = '' }} />
          <button type="button" className="flex flex-col items-center justify-center cursor-pointer"
            style={{ height: '180px', borderRadius: '8px', gap: '10px', overflow: 'hidden', width: '100%', padding: 0,
              border: `1px dashed ${fieldErrs.image ? '#EF4444' : isEdit && !imageFile ? '#24A8F5' : '#1B2333'}`,
              backgroundColor: isEdit && !imageFile ? '#0D2035' : 'transparent' }}
            onClick={() => imgRef.current.click()}>
            {imageFile ? (
              <>
                <Image size={36} color="#24A8F5" />
                <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500', textAlign: 'center', padding: '0 8px', wordBreak: 'break-all' }}>
                  {imageFile.name}
                </span>
              </>
            ) : isEdit && product?.image_url ? (
              <>
                <img src={product.image_url} alt={product.name}
                  style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '6px' }} />
                <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px', textAlign: 'center', padding: '0 8px' }}>
                  Imagen actual
                </span>
                <button className="border-none cursor-pointer"
                  style={{ backgroundColor: '#0D2035', borderRadius: '6px', padding: '7px 14px', border: '1px solid #24A8F5' }}>
                  <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600' }}>Cambiar imagen</span>
                </button>
              </>
            ) : (
              <>
                <Upload size={36} color={fieldErrs.image ? '#EF4444' : '#AAB3C5'} />
                <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '500', textAlign: 'center', padding: '0 8px' }}>
                  Arrastrá la imagen aquí
                </span>
                <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>o</span>
                <button className="border-none cursor-pointer"
                  style={{ backgroundColor: '#0D2035', borderRadius: '6px', padding: '7px 14px', border: '1px solid #24A8F5' }}>
                  <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '11px', fontWeight: '600' }}>Examinar archivos</span>
                </button>
              </>
            )}
          </button>
          {fieldErrs.image && <span style={ERR_STYLE}>{fieldErrs.image}</span>}
          <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px', textAlign: 'center' }}>
            JPG, PNG, WEBP · Máx 5MB
          </span>

          <div style={{ height: '1px', backgroundColor: '#1B2333' }} />

          <span style={{ color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>Galería (opcional)</span>
          <input ref={galRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
            onChange={e => { addGalleryFiles(e.target.files); e.target.value = '' }} />
          <button onClick={() => galRef.current.click()} className="flex items-center border-none cursor-pointer"
            style={{ backgroundColor: '#0D2035', borderRadius: '6px', padding: '7px 14px', border: `1px solid ${fieldErrs.gallery ? '#EF4444' : '#1B2333'}`, gap: '6px' }}>
            <Upload size={12} color="#AAB3C5" />
            <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '11px' }}>
              {totalGallery > 0 ? `${totalGallery}/3 foto(s)` : 'Agregar fotos (máx 3)'}
            </span>
          </button>
          {existingGallery.length > 0 && (
            <div className="flex" style={{ gap: '6px', flexWrap: 'wrap' }}>
              {existingGallery.map((url) => (
                <div key={url} style={{ position: 'relative', width: '56px', height: '56px' }}>
                  <img src={url} alt="" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #1B2333' }} />
                  <button onClick={() => removeExistingGallery(url)} className="border-none cursor-pointer flex items-center justify-center"
                    style={{ position: 'absolute', top: '-5px', right: '-5px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#EF4444', padding: 0 }}>
                    <X size={10} color="#FFFFFF" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {gallery.length > 0 && (
            <div className="flex flex-col" style={{ gap: '4px' }}>
              {gallery.map((f) => (
                <div key={`${f.name}-${f.lastModified}-${f.size}`} className="flex items-center justify-between">
                  <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{f.name}</span>
                  <button onClick={() => setGallery(prev => prev.filter(g => g !== f))} className="border-none cursor-pointer" style={{ background: 'none', padding: '0 0 0 6px' }}>
                    <X size={12} color="#EF4444" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {fieldErrs.gallery && <span style={ERR_STYLE}>{fieldErrs.gallery}</span>}
        </div>

        {/* Right — campos */}
        <div className="flex flex-col" style={{ flex: 1, padding: '24px', gap: '14px', overflowY: 'auto' }}>
          {/* Nombre + Marca */}
          <div className="flex" style={{ gap: '14px' }}>
            <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
              <span style={LABEL_STYLE}>Nombre *</span>
              <input style={inputStyle(fieldErrs.name)} maxLength={150} value={form.name} onChange={set('name')} placeholder="Ej: RTX 5090 24GB GDDR7" />
              {fieldErrs.name && <span style={ERR_STYLE}>{fieldErrs.name}</span>}
            </div>
            <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
              <span style={LABEL_STYLE}>Marca *</span>
              <input style={inputStyle(fieldErrs.brand)} maxLength={50} value={form.brand} onChange={set('brand')} placeholder="Ej: NVIDIA" />
              {fieldErrs.brand && <span style={ERR_STYLE}>{fieldErrs.brand}</span>}
            </div>
          </div>

          {/* Spec corta */}
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <span style={LABEL_STYLE}>Resumen técnico</span>
            <input style={inputStyle(fieldErrs.spec)} maxLength={255} value={form.spec} onChange={set('spec')} placeholder="Ej: 12GB GDDR6X" />
            {fieldErrs.spec && <span style={ERR_STYLE}>{fieldErrs.spec}</span>}
          </div>

          {/* Descripción */}
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <span style={LABEL_STYLE}>Descripción</span>
            <textarea style={taStyle(fieldErrs.description)} maxLength={2000} value={form.description} onChange={set('description')}
              placeholder="Describí el producto brevemente..." />
            {fieldErrs.description && <span style={ERR_STYLE}>{fieldErrs.description}</span>}
          </div>

          {/* Precio + Stock */}
          <div className="flex" style={{ gap: '14px' }}>
            <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
              <span style={LABEL_STYLE}>Precio (ARS) *</span>
              <input type="number" min={0} step="0.01" style={inputStyle(fieldErrs.priceArs)} value={form.priceArs} onChange={set('priceArs')} placeholder="0" />
              {fieldErrs.priceArs && <span style={ERR_STYLE}>{fieldErrs.priceArs}</span>}
            </div>
            <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
              <span style={LABEL_STYLE}>Stock *</span>
              <input type="number" min={0} max={999999} style={inputStyle(fieldErrs.stock)} value={form.stock} onChange={set('stock')} placeholder="0" />
              {fieldErrs.stock && <span style={ERR_STYLE}>{fieldErrs.stock}</span>}
            </div>
          </div>

          {/* Categoría + Badge */}
          <div className="flex" style={{ gap: '14px' }}>
            <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
              <span style={LABEL_STYLE}>Categoría *</span>
              <div className="flex items-center justify-between"
                style={{ ...INPUT_STYLE_BASE, border: `1px solid ${fieldErrs.categoryId ? '#EF4444' : '#1B2333'}`, cursor: 'pointer', padding: '0 12px' }}>
                <select value={form.categoryId} onChange={set('categoryId')} disabled={catsLoading}
                  style={{ background: 'none', border: 'none', color: form.categoryId ? '#F5F7FA' : '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', width: '100%', cursor: 'pointer', appearance: 'none' }}>
                  <option value="" disabled>{catsLoading ? 'Cargando...' : 'Seleccioná una categoría'}</option>
                  {categories.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#0E1424' }}>{c.label}</option>)}
                </select>
                <ChevronDown size={14} color="#AAB3C5" style={{ pointerEvents: 'none', flexShrink: 0 }} />
              </div>
              {fieldErrs.categoryId && <span style={ERR_STYLE}>{fieldErrs.categoryId}</span>}
            </div>
            <div className="flex flex-col" style={{ flex: 1, gap: '6px' }}>
              <span style={LABEL_STYLE}>Badge</span>
              <div className="flex items-center justify-between"
                style={{ ...INPUT_STYLE_BASE, border: `1px solid ${fieldErrs.badge ? '#EF4444' : '#1B2333'}`, cursor: 'pointer', padding: '0 12px' }}>
                <select value={form.badge} onChange={set('badge')}
                  style={{ background: 'none', border: 'none', color: '#F5F7FA', fontFamily: 'Poppins', fontSize: '13px', width: '100%', cursor: 'pointer', appearance: 'none' }}>
                  <option value="">Sin badge</option>
                  <option value="NUEVO" style={{ backgroundColor: '#0E1424' }}>NUEVO</option>
                  <option value="HOT" style={{ backgroundColor: '#0E1424' }}>HOT</option>
                  <option value="OFERTA" style={{ backgroundColor: '#0E1424' }}>OFERTA</option>
                </select>
                <ChevronDown size={14} color="#AAB3C5" style={{ pointerEvents: 'none', flexShrink: 0 }} />
              </div>
              {fieldErrs.badge && <span style={ERR_STYLE}>{fieldErrs.badge}</span>}
            </div>
          </div>

          {/* Specs clave-valor */}
          <div className="flex flex-col" style={{ gap: '8px' }}>
            <span style={LABEL_STYLE}>Especificaciones técnicas</span>
            {fieldErrs.specs && <span style={ERR_STYLE}>{fieldErrs.specs}</span>}
            {specRows.map((row) => (
              <div key={row.id} className="flex items-center" style={{ gap: '8px' }}>
                <input placeholder="Clave (ej: VRAM)" maxLength={50} value={row.key} onChange={e => setSpecKey(row.id, e.target.value)}
                  style={{ ...INPUT_STYLE_BASE, flex: 1 }} />
                <input placeholder="Valor (ej: 12GB)" maxLength={200} value={row.value} onChange={e => setSpecVal(row.id, e.target.value)}
                  style={{ ...INPUT_STYLE_BASE, flex: 1 }} />
                <button onClick={() => removeSpecRow(row.id)} className="border-none cursor-pointer" style={{ background: 'none', padding: 0, flexShrink: 0 }}>
                  <Trash2 size={16} color="#EF4444" />
                </button>
              </div>
            ))}
            <button onClick={addSpecRow} disabled={specsFull} className="flex items-center justify-center border-none"
              style={{ backgroundColor: 'transparent', borderRadius: '6px', height: '34px', border: '1px dashed #1B2333', gap: '6px',
                cursor: specsFull ? 'not-allowed' : 'pointer', opacity: specsFull ? 0.5 : 1 }}>
              <Plus size={14} color="#24A8F5" />
              <span style={{ color: '#24A8F5', fontFamily: 'Poppins', fontSize: '12px', fontWeight: '600' }}>
                {specsFull ? 'Máximo 20 specs' : 'Agregar especificación'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ height: '1px', backgroundColor: '#1B2333', flexShrink: 0 }} />
      <div className="flex items-center justify-between"
        style={{ height: '60px', padding: '0 24px', flexShrink: 0 }}>
        <button onClick={onClose} className="flex items-center justify-center border-none cursor-pointer"
          style={{ backgroundColor: '#1B2333', borderRadius: '6px', height: '38px', padding: '0 20px' }}>
          <span style={{ color: '#AAB3C5', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>Cancelar</span>
        </button>
        <button onClick={handleSave} disabled={saving} className="flex items-center justify-center border-none cursor-pointer"
          style={{ backgroundColor: saving ? '#1A6FA8' : '#24A8F5', borderRadius: '6px', height: '38px', padding: '0 20px', gap: '8px' }}>
          {saving
            ? <Loader size={14} color="#FFFFFF" style={{ animation: 'spin 1s linear infinite' }} />
            : <Save size={14} color="#FFFFFF" />
          }
          <span style={{ color: '#FFFFFF', fontFamily: 'Poppins', fontSize: '13px', fontWeight: '600' }}>
            {saving ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Guardar Producto'}
          </span>
        </button>
      </div>
    </>
  )
}

/* ─────────────────────── ProductModal entry ─── */
const ProductModal = ({ mode, product, onClose, onSave }) => {
  const navigate = useNavigate()
  const state = useProductForm({ mode, product, onSave, onClose, navigate })

  return (
    <>
      {/* Mobile */}
      <div className="flex md:hidden items-start justify-center"
        style={{ position: 'fixed', inset: 0, backgroundColor: '#070B16', zIndex: 60 }}>
        <MobileBody mode={mode} product={product} state={state} onClose={onClose} />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center" aria-hidden="true"
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,6,16,0.97)', zIndex: 50, padding: '20px' }}>
        <div role="dialog" aria-modal="true" aria-label={mode === 'edit' ? 'Editar Producto' : 'Agregar Producto'} className="flex flex-col"
          style={{ width: 'min(820px, 95vw)', height: 'min(730px, calc(100vh - 40px))', backgroundColor: '#0E1424', borderRadius: '12px', border: '1px solid #1B2333', overflow: 'hidden' }}>
          <DesktopBody mode={mode} product={product} state={state} onClose={onClose} />
        </div>
      </div>
    </>
  )
}

export default ProductModal
