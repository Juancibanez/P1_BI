import { useState } from 'react'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import axios from 'axios'
import * as XLSX from 'xlsx'
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
      const response = await axios.post('http://localhost:8000/predict/', {
        texts: opinions,
      })
      setResults(response.data)
      setError(null)
    } catch (error) {
      setError('Error al realizar la predicción')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const predictFromFile = (file, columnName) => {
    if (!file || !columnName) {
      setError('Sube un archivo e ingresa el nombre de la columna.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const binaryStr = event.target.result
      const workbook = XLSX.read(binaryStr, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const data = XLSX.utils.sheet_to_json(sheet)
      const texts = data.map((row) => row[columnName])

      if (texts.length > 0) {
        setOpinions(texts)
        setLoading(true)
        axios
          .post('http://localhost:8000/predict/', { texts })
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
    }

    reader.readAsBinaryString(file)
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
        <h1 className='mb-4'>Análisis de Opiniones y ODS</h1>

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
              opinions={opinions}
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