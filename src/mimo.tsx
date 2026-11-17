import { useState } from 'react'
import './App.css'

function App() {
  const prixSandwich = 8

  const [feta, setFeta] = useState(false)

  let prixTotal = prixSandwich

  if (feta) {
    prixTotal = prixTotal + 1
  }

  return (
    <div>
      <h1>MIMOZA</h1>
      <h2>Cuisine Anatolienne</h2>

      <hr />

      <h2>Compose ton sandwich 🥙</h2>

      <p>Sandwich Mimoza : 8 €</p>

      <h3>Suppléments</h3>

      <label>
        <input
          type="checkbox"
          checked={feta}
          onChange={(event) => setFeta(event.target.checked)}
        />
        Feta +1 €
      </label>

      <h3>Prix : {prixTotal} €</h3>
    </div>
  )
}

export default App