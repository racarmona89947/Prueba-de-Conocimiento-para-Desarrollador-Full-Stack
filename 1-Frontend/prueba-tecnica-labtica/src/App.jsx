import React, { useEffect, useState } from 'react'

// URL base de la API (si existe variable de entorno la toma, si no usa localhost)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/prueba_api/items.php';

function App() {
  // Estados principales
  const [items, setItems] = useState([]);              // Lista de elementos
  const [loading, setLoading] = useState(true);        // Indicador de carga
  const [form, setForm] = useState({ nombre: '', descripcion: '' }); // Datos del formulario
  const [errors, setErrors] = useState({});            // Errores de validación
  const [editingId, setEditingId] = useState(null);    // Id del elemento en edición

  // Al cargar el componente, traer los datos iniciales
  useEffect(() => {
    fetchItems();
  }, []);

  // Obtener lista de elementos desde la API
  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []); // Asegurarse de que sea un array
    } catch (err) {
      console.error(err);
      alert('Error al cargar items. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  }

  // Validar los datos del formulario
  function validate() {
    const errs = {};
    if (!form.nombre || form.nombre.trim().length < 2) errs.nombre = 'Nombre mínimo 2 caracteres';
    if (form.nombre && form.nombre.length > 255) errs.nombre = 'Nombre muy largo';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // Enviar datos (crear o actualizar)
  async function handleSubmit(e) {
    e.preventDefault(); // Evitar recarga de la página
    if (!validate()) return; // No enviar si hay errores
    try {
      if (editingId) {
        // Si existe editingId → EDITAR (PUT)
        const res = await fetch(`${API_URL}?id=${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Error al actualizar');
        await fetchItems(); // Refrescar lista
        resetForm();
      } else {
        // Si no hay editingId → CREAR (POST)
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error al crear');
        }
        await fetchItems();
        resetForm();
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // Resetear formulario a valores iniciales
  function resetForm() {
    setForm({ nombre: '', descripcion: '' });
    setEditingId(null);
    setErrors({});
  }

  // Preparar formulario para editar un elemento
  function startEdit(item) {
    setForm({ nombre: item.nombre, descripcion: item.descripcion || '' });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Eliminar un elemento
  async function handleDelete(id) {
    if (!confirm('¿Eliminar este elemento?')) return;
    try {
      const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      await fetchItems();
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar');
    }
  }

  // Renderizado principal
  return (
    <div className="container">
      <header>
        <h1>Lista de Materiales</h1>
        <p className="subtitle">Elementos escolares y otros.</p>
      </header>

      <main>
        <section className="form-section">
          <h2>{editingId ? 'Editar Elemento' : 'Nuevo Elemento'}</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre del item"
              />
              {errors.nombre && <small className="error">{errors.nombre}</small>}
            </div>

            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción"
              />
            </div>

            <div className="buttons">
              <button type="submit" className="btn primary">{editingId ? 'Actualizar' : 'Agregar'}</button>
              <button type="button" className="btn" onClick={resetForm}>Limpiar</button>
            </div>
          </form>
        </section>

        <section className="list-section">
          <h2>Lista de Elementos</h2>
          {loading ? <p>Cargando...</p> : (
            <>
              {items.length === 0 ? <p>No hay items aún.</p> : (
                <ul className="items">
                  {items.map(item => (
                    <li key={item.id} className="item">
                      <div className="item-main">
                        <strong>{item.nombre}</strong>
                        <p className="desc">{item.descripcion}</p>
                      </div>
                      <div className="item-actions">
                        <button className="btn small" onClick={() => startEdit(item)}>Editar</button>
                        <button className="btn small danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </main>

      <footer>
        <p>LÁBTICA</p>
      </footer>
    </div>
  )
}

export default App;
