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
import * as XLSX from 'xlsx'
import NavBar from './NavBar'
import Footer from './Footer'
import axios from 'axios'

const ModelRetrainingPage = () => {
  const [file, setFile] = useState(null)
  const [opinionColumn, setOpinionColumn] = useState('')
  const [labelColumn, setLabelColumn] = useState('')
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleRetrain = async () => {
    if (!file || !opinionColumn || !labelColumn) {
      setError('Por favor, completa todos los campos.')
      return
    }

    setLoading(true)
    setError('')
    setMetrics(null)

    try {
      const { texts, labels } = await processFile(file)
      const response = await axios.post('http://localhost:8000/retrain', {
        texts,
        labels,
      })

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
      const reader = new FileReader()
      reader.onload = (e) => {
        const fileData = e.target.result
        let texts = []
        let labels = []

        const workbook = XLSX.read(fileData, { type: 'binary' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })

        const headers = jsonData[0]
        const opinionIdx = headers.indexOf(opinionColumn)
        const labelIdx = headers.indexOf(labelColumn)

        if (opinionIdx === -1 || labelIdx === -1) {
          return reject('Columnas no encontradas en el archivo Excel.')
        }

        for (let i = 1; i < jsonData.length; i++) {
          texts.push(jsonData[i][opinionIdx])
          labels.push(jsonData[i][labelIdx])
        }
        resolve({ texts, labels })
      }

      reader.onerror = (err) => {
        console.error('File Reading Error:', err)
        reject('Error al leer el archivo.')
      }

      reader.readAsBinaryString(file)
    })
  }

  return (
    <>
      <NavBar />
      <Container className='mt-5'>
        <h2 className='text-center'>Reentrenar Modelo</h2>
        <Form>
          <Form.Group controlId='formFile' className='mb-3'>
            <Form.Label>Selecciona un archivo (Excel/CSV)</Form.Label>
            <Form.Control
              type='file'
              accept='.xls, .xlsx, .csv'
              onChange={handleFileChange}
            />
          </Form.Group>

          <Form.Group controlId='opinionColumn' className='mb-3'>
            <Form.Label>Nombre de la columna de opiniones</Form.Label>
            <Form.Control
              type='text'
              value={opinionColumn}
              onChange={(e) => setOpinionColumn(e.target.value)}
              placeholder='Ej: opinion'
            />
          </Form.Group>

          <Form.Group controlId='labelColumn' className='mb-3'>
            <Form.Label>Nombre de la columna de etiquetas</Form.Label>
            <Form.Control
              type='text'
              value={labelColumn}
              onChange={(e) => setLabelColumn(e.target.value)}
              placeholder='Ej: etiqueta'
            />
          </Form.Group>

          <div className='text-center mb-4'>
            <Button
              variant='primary'
              onClick={handleRetrain}
              disabled={loading}
            >
              {loading ? (
                <Spinner animation='border' size='sm' />
              ) : (
                'Reentrenar'
              )}
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
                    now={metrics.f1_score * 100}
                    label={`${(metrics.f1_score * 100).toFixed(2)}%`}
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