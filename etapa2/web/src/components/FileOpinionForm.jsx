import { useState } from 'react'
import { Button, Form, Col, Spinner } from 'react-bootstrap'
import { FaArrowLeft, FaRedo, FaSearch } from 'react-icons/fa'

const FileOpinionForm = ({
  clearResults,
  loading,
  onBack,
  onSubmit,
  setError,
}) => {
  const [file, setFile] = useState(null)
  const [showRefresh, setShowRefresh] = useState(false)

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]
    const fileExtension = uploadedFile.name.split('.').pop().toLowerCase()

    if (fileExtension === 'csv') {
      setFile(uploadedFile)
      setError(null)
    } else {
      setError('Por favor, sube un archivo válido (CSV).')
    }
  }

  const handleRefresh = () => {
    setFile(null)
    clearResults()
    setError(null)
    setShowRefresh(false)
  }

  const handlePredict = () => {
    setShowRefresh(true)
    onSubmit(file)
  }

  return (
    <Col md={6} className='mx-auto'>
      <h4 className='text-center'>Subir Archivo (CSV)</h4>

      <Form.Group>
        <Form.Control 
          type='file' 
          accept='.csv' 
          onChange={handleFileUpload} 
        />
      </Form.Group>

      <div className='text-center'>
        <Button onClick={handlePredict} disabled={loading || !file} className='mt-3'>
          {loading ? (
            <>
              <Spinner
                as='span'
                animation='border'
                size='sm'
                role='status'
                aria-hidden='true'
                className='me-2'
              />
              Cargando...
            </>
          ) : (
            <>
              <FaSearch className='me-2' /> Predecir
            </>
          )}
        </Button>
      </div>

      <div className='text-center mt-4'>
        <Button variant='secondary' onClick={onBack} className='me-2'>
          <FaArrowLeft className='me-2' /> Volver
        </Button>
        {showRefresh && (
          <Button variant='info' onClick={handleRefresh}>
            <FaRedo className='me-2' /> Refrescar
          </Button>
        )}
      </div>
    </Col>
  )
}

export default FileOpinionForm
