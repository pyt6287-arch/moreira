import { createClient } from '@supabase/supabase-js'

// Obtener variables de entorno de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan las variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_KEY.')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Elementos del DOM
const bookmarkForm = document.getElementById('bookmark-form')
const titleInput = document.getElementById('title')
const urlInput = document.getElementById('url')
const bookmarksList = document.getElementById('bookmarks-list')
const loadingState = document.getElementById('loading')
const emptyState = document.getElementById('empty-state')

// Cargar marcadores
async function fetchBookmarks() {
  loadingState.style.display = 'block'
  bookmarksList.style.display = 'none'
  emptyState.style.display = 'none'

  try {
    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    loadingState.style.display = 'none'

    if (!bookmarks || bookmarks.length === 0) {
      emptyState.style.display = 'block'
    } else {
      bookmarksList.innerHTML = ''
      bookmarks.forEach((bookmark) => {
        const item = document.createElement('div')
        item.className = 'bookmark-item'
        item.innerHTML = `
          <div class="bookmark-info">
            <a href="${bookmark.url}" target="_blank" rel="noopener noreferrer" class="bookmark-title">
              ${escapeHtml(bookmark.title)}
            </a>
            <span class="bookmark-url">${escapeHtml(bookmark.url)}</span>
          </div>
          <button class="btn-delete" data-id="${bookmark.id}" title="Eliminar marcador">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        `
        
        // Evento de eliminar
        item.querySelector('.btn-delete').addEventListener('click', async (e) => {
          const id = e.currentTarget.getAttribute('data-id')
          await deleteBookmark(id)
        })

        bookmarksList.appendChild(item)
      })
      bookmarksList.style.display = 'flex'
    }
  } catch (error) {
    loadingState.textContent = `Error al cargar marcadores: ${error.message}`
    console.error(error)
  }
}

// Agregar marcador
bookmarkForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  
  let url = urlInput.value.trim()
  const title = titleInput.value.trim()

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }

  try {
    const { error } = await supabase
      .from('bookmarks')
      .insert([{ url, title }])

    if (error) throw error

    // Limpiar form y recargar
    titleInput.value = ''
    urlInput.value = ''
    await fetchBookmarks()
  } catch (error) {
    alert(`Error al guardar: ${error.message}`)
    console.error(error)
  }
})

// Eliminar marcador
async function deleteBookmark(id) {
  try {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) throw error
    await fetchBookmarks()
  } catch (error) {
    alert(`Error al eliminar: ${error.message}`)
    console.error(error)
  }
}

// Utilidad para escapar HTML
function escapeHtml(text) {
  const div = document.createElement('div')
  div.innerText = text
  return div.innerHTML
}

// Inicializar
fetchBookmarks()
