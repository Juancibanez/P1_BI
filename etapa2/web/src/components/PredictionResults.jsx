import { useState } from 'react'
import { ListGroup, ProgressBar, Pagination, Button } from 'react-bootstrap'

const ITEMS_PER_PAGE_OPTIONS = [10, 15, 20, 50, 100]

const PredictionResults = ({ results, opinions }) => {
  // Se definen dos colores: uno para "Noticia Verdadera" (0) y otro para "Noticia Falsa" (1)
  const colors = ['#4c9f38', '#c5192d']

  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedOpinions, setExpandedOpinions] = useState({})

  const totalPages = Math.ceil(opinions.length / itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const selectedOpinions = opinions.slice(startIndex, startIndex + itemsPerPage)
  const selectedPredictions = results.predictions.slice(
    startIndex,
    startIndex + itemsPerPage
  )
  const selectedProbabilities = results.probabilities.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  // Lógica para la paginación
  const pageLimit = 11
  const pagesToShow = []
  let firstPage = Math.max(1, currentPage - Math.floor(pageLimit / 2))
  let lastPage = Math.min(totalPages, firstPage + pageLimit - 1)

  if (lastPage - firstPage < pageLimit - 1) {
    firstPage = Math.max(1, lastPage - pageLimit + 1)
  }

  for (let i = firstPage; i <= lastPage; i++) {
    pagesToShow.push(i)
  }

  // Función para expandir o contraer la descripción si es muy larga
  const toggleExpansion = (index) => {
    setExpandedOpinions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <>
      <div className='mb-3'>
        <label htmlFor='itemsPerPage' className='me-2'>
          Noticias por página:
        </label>
        <select
          id='itemsPerPage'
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(+e.target.value)
            setCurrentPage(1)
            setExpandedOpinions({})
          }}
        >
          {ITEMS_PER_PAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <ListGroup>
        {selectedOpinions.map((opinion, index) => {
          const descriptionWords = opinion.Descripcion.split(' ')
          const displayDescription =
            expandedOpinions[index] || descriptionWords.length <= 50
              ? opinion.Descripcion
              : descriptionWords.slice(0, 50).join(' ') + '...'

          const prediction = selectedPredictions[index]
          const predictionLabel =
            prediction === 0 ? 'Noticia Verdadera' : 'Noticia Falsa'

          return (
            <ListGroup.Item
              key={opinion.ID}
              className='d-flex flex-column align-items-md-start'
              style={{ gap: '20px' }}
            >
              <div style={{ width: '100%' }}>
                <h5>{opinion.Titulo}</h5>
                <p>
                  {displayDescription}
                  {descriptionWords.length > 50 && (
                    <Button
                      variant='link'
                      onClick={() => toggleExpansion(index)}
                      className='p-0 ms-2'
                    >
                      {expandedOpinions[index] ? 'Ver menos' : 'Ver más'}
                    </Button>
                  )}
                </p>
                <p>
                  <small>{opinion.Fecha}</small>
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  width: '100%',
                }}
              >
                <div style={{ flex: '0 0 30%' }}>
                  <strong>{predictionLabel}</strong>
                </div>
                <div style={{ flex: '1' }}>
                  <ProgressBar style={{ height: '30px' }}>
                    {selectedProbabilities[index].map((prob, i) => (
                      <ProgressBar
                        now={prob * 100}
                        key={i}
                        style={{
                          backgroundColor: colors[i],
                          height: '30px',
                          fontWeight: 'bold',
                        }}
                        title={
                          i === 0
                            ? `Verdadera: ${(prob * 100).toFixed(2)}%`
                            : `Falsa: ${(prob * 100).toFixed(2)}%`
                        }
                        label={i === 0 ? '0' : '1'}
                      />
                    ))}
                  </ProgressBar>
                </div>
              </div>
            </ListGroup.Item>
          )
        })}
      </ListGroup>

      <div className='d-flex justify-content-center mt-4'>
        <Pagination>
          <Pagination.Prev
            onClick={() =>
              handlePageChange(currentPage > 1 ? currentPage - 1 : totalPages)
            }
            disabled={totalPages === 0}
          />
          {pagesToShow.map((page) => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() =>
              handlePageChange(currentPage < totalPages ? currentPage + 1 : 1)
            }
            disabled={totalPages === 0}
          />
        </Pagination>
      </div>
    </>
  )
}

export default PredictionResults
