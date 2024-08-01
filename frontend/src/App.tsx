import React, { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const [data, setData] = useState<any>('')

  const fetchData = async () => {
    const response = await axios.get('/api')
    setData(response.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  console.log(data)


  return (
    <div>
      <h1>Initial Setup</h1>
      <p>{data.message}</p>
    </div>
  )
}

export default App
