const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt
  }

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })

    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })

    response.code(400)
    return response
  }

  books.push(newBook)
  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })

    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })

  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query
  // console.log(finished);

  if (reading === '1') {
    return {
      status: 'success',
      data: {
        books: books.filter(book => book.reading === true).map(buku => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher
        }))
      }
    }
  } else if (reading === '0') {
    return {
      status: 'success',
      data: {
        books: books.filter(book => book.reading === false).map(buku => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher
        }))
      }
    }
  }

  if (finished === '1') {
    return {
      status: 'success',
      data: {
        books: books.filter(book => book.finished === true).map(buku => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher
        }))
      }
    }
  } else if (finished === '0') {
    return {
      status: 'success',
      data: {
        books: books.filter(book => book.finished === false).map(buku => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher
        }))
      }
    }
  }

  if (name) {
    return {
      status: 'success',
      data: {
        books: books.filter(book => book.name.toLowerCase().includes(name.toLowerCase())).map(buku => ({
          id: buku.id,
          name: buku.name,
          publisher: buku.publisher
        }))
      }
    }
  }

  return {
    status: 'success',
    data: {
      books: books.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  }
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params

  const book = books.filter(x => x.id === id)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })

  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()

  const index = books.findIndex(x => x.id === id)

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })

    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })

    response.code(400)
    return response
  } else if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })

    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })

  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex(x => x.id === id)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })

    response.code(200)
    return response
  };

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })

  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
