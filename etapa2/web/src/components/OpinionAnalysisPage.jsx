import { Container, Row, Col, Alert } from 'react-bootstrap'
import axios from 'axios'
import Papa from 'papaparse'
import { useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import SelectMethod from './SelectMethod'
import ManualOpinionForm from './ManualOpinionForm'
import FileOpinionForm from './FileOpinionForm'
import PredictionResults from './PredictionResults'

const OpinionAnalysisPage = () => {
  const [method, setMethod] = useState(null)
  const [opinions, setOpinions] = useState([])
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const predictManualOpinions = async () => {
    try {
      setLoading(true)
      // Se envía directamente la lista de opiniones
      const response = await axios.post('http://localhost:8000/predict/', opinions)
      setResults(response.data)
      setError(null)
    } catch (error) {
      setError('Error al realizar la predicción')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const predictFromFile = (file) => {
    if (!file) {
      setError('Sube un archivo.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const csvData = event.target.result
      Papa.parse(csvData, {
        header: true, // Se asume que el CSV tiene encabezado
        complete: (results) => {
          const data = results.data
          console.log(data)
          // Se espera que cada objeto tenga las columnas: ID, Titulo, Descripcion, Fecha
          if (data.length > 0) {
            setOpinions(data)
            setLoading(true)
            // Se envía directamente el arreglo de objetos como body
            axios
              .post('http://localhost:8000/predict', data)
              .then((response) => {
                setResults(response.data)
                setError(null)
              })
              .catch((error) => {
                setError('Error al realizar la predicción')
                console.error(error)
              })
              .finally(() => setLoading(false))
          }
        },
        error: (error) => {
          setError('Error al parsear el archivo CSV')
          console.error(error)
        }
      })
    }

    reader.readAsText(file)
  }

  const resetMethod = () => {
    setMethod(null)
    setOpinions([])
    setResults(null)
    setError(null)
  }

  return (
    <>
      <NavBar />
      <Container className='py-5'>
        <h1 className='mb-4'>Análisis de Noticias Falsas</h1>

        {!method && <SelectMethod onSelect={setMethod} />}

        {method === 'manual' && (
          <Row>
            <ManualOpinionForm
              opinions={opinions}
              setOpinions={setOpinions}
              onSubmit={predictManualOpinions}
              loading={loading}
              onBack={resetMethod}
              clearResults={() => setResults(null)}
              setError={setError}
            />
          </Row>
        )}

        {method === 'file' && (
          <Row>
            <FileOpinionForm
              onSubmit={predictFromFile}
              loading={loading}
              onBack={resetMethod}
              clearResults={() => setResults(null)}
              setError={setError}
            />
          </Row>
        )}

        {error && (
          <Alert variant='danger' className='mt-3'>
            {error}
          </Alert>
        )}

        {results && (
          <Row className='mt-5'>
            <Col>
              <PredictionResults results={results} opinions={opinions} />
            </Col>
          </Row>
        )}
      </Container>
      <Footer />
    </>
  )
}

export default OpinionAnalysisPage
