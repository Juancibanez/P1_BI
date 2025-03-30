import { useState } from 'react'
import {
  Button,
  Form,
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  ProgressBar,
} from 'react-bootstrap'
import Papa from 'papaparse'
import NavBar from './NavBar'
import Footer from './Footer'
import axios from 'axios'

const ModelRetrainingPage = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleRetrain = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo CSV.')
      return
    }

    setLoading(true)
    setError('')
    setMetrics(null)

    try {
      const data = await processFile(file)
      const response = await axios.post('http://localhost:8000/retrain', data)
      setMetrics(response.data)
    } catch (error) {
      console.error('Error:', error)
      setError('Error al reentrenar el modelo. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors && results.errors.length > 0) {
            return reject('Error al parsear el archivo CSV.')
          }
          if (!results.data || results.data.length === 0) {
            return reject('El archivo CSV está vacío.')
          }

          const requiredColumns = ["ID", "Titulo", "Descripcion", "Fecha", "Label"]
          const firstRow = results.data[0]
          for (const col of requiredColumns) {
            if (!(col in firstRow)) {
              return reject(`Columna ${col} no encontrada en el archivo CSV.`)
            }
          }

          resolve(results.data)
        },
        error: (err) => {
          reject('Error al parsear el archivo CSV.')
        }
      })
    })
  }

  return (
    <>
      <NavBar />
      <Container className='mt-5'>
        <h2 className='text-center'>Reentrenar Modelo</h2>
        <Form>
          <Form.Group controlId='formFile' className='mb-3'>
            <Form.Label>Selecciona un archivo CSV</Form.Label>
            <Form.Control
              type='file'
              accept='.csv'
              onChange={handleFileChange}
            />
          </Form.Group>

          <div className='text-center mb-4'>
            <Button variant='primary' onClick={handleRetrain} disabled={loading}>
              {loading ? <Spinner animation='border' size='sm' /> : 'Reentrenar'}
            </Button>
          </div>
        </Form>

        {error && (
          <Alert variant='danger' className='mt-3'>
            {error}
          </Alert>
        )}

        {metrics && (
          <Row className='mt-4'>
            <Col>
              <Alert variant='success'>
                <h4>Métricas de Reentrenamiento</h4>
                <div className='mb-3'>
                  <strong>Precisión:</strong>
                  <ProgressBar
                    now={metrics.precision * 100}
                    label={`${(metrics.precision * 100).toFixed(2)}%`}
                    style={{ height: '30px' }}
                    className='mt-1'
                  />
                </div>
                <div className='mb-3'>
                  <strong>Recall:</strong>
                  <ProgressBar
                    now={metrics.recall * 100}
                    label={`${(metrics.recall * 100).toFixed(2)}%`}
                    style={{ height: '30px' }}
                    className='mt-1'
                  />
                </div>
                <div className='mb-3'>
                  <strong>F1 Score:</strong>
                  <ProgressBar
                    now={metrics.f1 * 100}
                    label={`${(metrics.f1 * 100).toFixed(2)}%`}
                    style={{ height: '30px' }}
                    className='mt-1'
                  />
                </div>
              </Alert>
            </Col>
          </Row>
        )}
      </Container>
      <Footer className='mt-5' />
    </>
  )
}

export default ModelRetrainingPage
