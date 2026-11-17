
import { useState } from 'react'
import './App.css'

// Types TypeScript
type ProduitPanier = {
  id: number
  nom: string
  details: string[]
  prix: number
}

type Categorie = 'Kebabs' | 'Pide & Lahmacun' | 'Tacos'

// Données des produits
const pains = [
  { nom: 'Galette maison', image: '/galette-mimoza.png' },
  { nom: 'Pain maison', image: '/pain-maison-mimoza.png' }
]

const cruditesDisponibles = [
  'Salade', 'Tomates', 'Oignons', 'Chou rouge'
]

const supplementsDisponibles = [
  { nom: 'Feta', prix: 1 },
  { nom: 'Olives', prix: 1 },
  { nom: 'Viande supplémentaire', prix: 3 }
]

const saucesDisponibles = [
  'Blanche', 'Algérienne', 'Samouraï', 'Harissa',
  'Ketchup', 'Biggy', 'Barbecue', 'Mayo'
]

const boissonsDisponibles = [
  { nom: 'Fuze Tea pêche', image: '/fuze-tea.png', prix: 0 },
  { nom: 'Orangina', image: '/orangina.png', prix: 0 },
  { nom: 'Oasis Tropical', image: '/oasis.png', prix: 0 },
  { nom: 'Desperados', image: '/desperados.png', prix: 1.5 }
]

const pide = [
  { nom: 'Pide 2 fromages', prix: 9, image: '/pide-2-fromages.png' },
  { nom: 'Pide viande hachée', prix: 10, image: '/pide-viande-hachee.png' },
  { nom: 'Pide épinards', prix: 10, image: '/pide-epinards.png' },
  { nom: 'Pide kebab', prix: 10, image: '/pide-kebab.png' },
  { nom: 'Pide sucuk', prix: 10, image: '/pide-sucuk.png' }
]

const taillesTacos = [
  { nom: 'M', prix: 7.5, viandes: 1 },
  { nom: 'L', prix: 9.5, viandes: 2 },
  { nom: 'XL', prix: 13, viandes: 3 }
]

const viandesDisponibles = [
  'Cordon bleu', 'Kebab', 'Nuggets',
  'Tenders', 'Steak haché'
]

// Affichage des prix
function euros(prix: number) {
  return prix.toFixed(2).replace('.', ',') + ' €'
}

function App() {
  // Onglet actif
  const [categorie, setCategorie] =
    useState<Categorie>('Kebabs')

  // Personnalisation du kebab
  const [pain, setPain] = useState('Galette maison')
  const [crudites, setCrudites] = useState<string[]>([])
  const [supplements, setSupplements] = useState<string[]>([])
  const [saucesKebab, setSaucesKebab] = useState<string[]>([])
  const [menuKebab, setMenuKebab] = useState(false)
  const [boissonKebab, setBoissonKebab] = useState('')

  // Personnalisation du tacos
  const [tailleTacos, setTailleTacos] = useState('M')
  const [viandesTacos, setViandesTacos] = useState<string[]>([])
  const [saucesTacos, setSaucesTacos] = useState<string[]>([])
  const [menuTacos, setMenuTacos] = useState(false)
  const [boissonTacos, setBoissonTacos] = useState('')

  // Personnalisation du lahmacun uniquement
  const [lahmacunOuvert, setLahmacunOuvert] = useState(false)
  const [cruditesLahmacun, setCruditesLahmacun] = useState<string[]>([])
  const [saucesLahmacun, setSaucesLahmacun] = useState<string[]>([])

  // Panier commun
  const [panier, setPanier] = useState<ProduitPanier[]>([])
  // Identifiant de l'article en cours de modification
  const [idModification, setIdModification] = useState<number | null>(null)

  function allerAuPanier() {
    document.getElementById('panier')?.scrollIntoView({ behavior: 'smooth' })
  }

  function annulerModification() {
    setIdModification(null)
  }

  // Recharger les choix d'un article dans le formulaire
  function modifierProduit(produit: ProduitPanier) {
    setIdModification(produit.id)
    const lire = (debut: string) =>
      produit.details.find((d) => d.startsWith(debut))?.slice(debut.length) ?? ''
    const liste = (debut: string) => {
      const valeur = lire(debut)
      return valeur === 'Aucun' || valeur === 'Aucune' || !valeur
        ? [] : valeur.split(', ')
    }

    if (produit.nom.startsWith('Kebab')) {
      setCategorie('Kebabs')
      setPain(lire('Pain : ') || 'Galette maison')
      setCrudites(liste('Crudités : '))
      setSupplements(liste('Suppléments : '))
      setSaucesKebab(liste('Sauces : '))
      const menu = produit.details.find((d) => d.startsWith('Menu avec '))
      setMenuKebab(Boolean(menu))
      setBoissonKebab(menu?.replace('Menu avec ', '') ?? '')
    } else if (produit.nom.startsWith('Tacos')) {
      setCategorie('Tacos')
      setTailleTacos(lire('Taille : ') || 'M')
      setViandesTacos(liste('Viandes : '))
      setSaucesTacos(liste('Sauces : '))
      const menu = produit.details.find((d) => d.startsWith('Menu avec '))
      setMenuTacos(Boolean(menu))
      setBoissonTacos(menu?.replace('Menu avec ', '') ?? '')
    } else if (produit.nom === 'Lahmacun') {
      setCategorie('Pide & Lahmacun')
      setLahmacunOuvert(true)
      setCruditesLahmacun(liste('Crudités : '))
      setSaucesLahmacun(liste('Sauces : '))
    } else {
      setCategorie('Pide & Lahmacun')
      setLahmacunOuvert(false)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Ajouter ou retirer un choix
  function changerChoix(
    choix: string,
    selection: string[],
    modifier: (valeur: string[]) => void,
    maximum?: number
  ) {
    if (selection.includes(choix)) {
      modifier(selection.filter((item) => item !== choix))
    } else if (maximum === undefined || selection.length < maximum) {
      modifier([...selection, choix])
    }
  }

  // Calcul du prix kebab
  const prixSupplements = supplementsDisponibles
    .filter((s) => supplements.includes(s.nom))
    .reduce((total, s) => total + s.prix, 0)

  const prixBoissonKebab =
    boissonsDisponibles.find((b) => b.nom === boissonKebab)?.prix ?? 0

  const prixKebab =
    8 + prixSupplements +
    (menuKebab ? 2 + prixBoissonKebab : 0)

  // Calcul du prix tacos
  const tailleSelectionnee =
    taillesTacos.find((t) => t.nom === tailleTacos)!

  const prixBoissonTacos =
    boissonsDisponibles.find((b) => b.nom === boissonTacos)?.prix ?? 0

  const prixTacos =
    tailleSelectionnee.prix +
    (menuTacos ? 2 + prixBoissonTacos : 0)

  // Ajouter un produit au panier
  function ajouterAuPanier(
    nom: string,
    details: string[],
    prix: number
  ) {
    const nouveauProduit: ProduitPanier = {
      id: Date.now() + Math.random(),
      nom,
      details,
      prix
    }

    if (idModification !== null) {
      // Remplacer l'article existant au lieu d'en ajouter un deuxième
      setPanier((ancienPanier) => ancienPanier.map((produit) =>
        produit.id === idModification
          ? { ...nouveauProduit, id: idModification }
          : produit
      ))
      setIdModification(null)
      allerAuPanier()
    } else {
      setPanier((ancienPanier) => [...ancienPanier, nouveauProduit])
    }
  }

  function ajouterLahmacun() {
    ajouterAuPanier('Lahmacun', [
      `Crudités : ${cruditesLahmacun.join(', ') || 'Aucune'}`,
      `Sauces : ${saucesLahmacun.join(', ') || 'Aucune'}`
    ], 5)
    setCruditesLahmacun([])
    setSaucesLahmacun([])
    setLahmacunOuvert(false)
  }

  // Ajouter le kebab personnalisé
  function ajouterKebab() {
    if (menuKebab && !boissonKebab) {
      alert('Choisis une boisson pour ton menu.')
      return
    }

    const details = [
      `Pain : ${pain}`,
      `Crudités : ${crudites.join(', ') || 'Aucune'}`,
      `Suppléments : ${supplements.join(', ') || 'Aucun'}`,
      `Sauces : ${saucesKebab.join(', ') || 'Aucune'}`,
      menuKebab ? `Menu avec ${boissonKebab}` : 'Sandwich seul'
    ]

    ajouterAuPanier('Kebab Mimoza', details, prixKebab)

    // Remettre le configurateur à zéro
    setPain('Galette maison')
    setCrudites([])
    setSupplements([])
    setSaucesKebab([])
    setMenuKebab(false)
    setBoissonKebab('')
  }

  // Ajouter le tacos personnalisé
  function ajouterTacos() {
    if (viandesTacos.length !== tailleSelectionnee.viandes) {
      alert(
        `Choisis exactement ${tailleSelectionnee.viandes} viande(s).`
      )
      return
    }

    if (menuTacos && !boissonTacos) {
      alert('Choisis une boisson pour ton menu.')
      return
    }

    const details = [
      `Taille : ${tailleTacos}`,
      `Viandes : ${viandesTacos.join(', ')}`,
      `Sauces : ${saucesTacos.join(', ') || 'Aucune'}`,
      menuTacos ? `Menu avec ${boissonTacos}` : 'Tacos seul'
    ]

    ajouterAuPanier(`Tacos ${tailleTacos}`, details, prixTacos)

    setTailleTacos('M')
    setViandesTacos([])
    setSaucesTacos([])
    setMenuTacos(false)
    setBoissonTacos('')
  }

  // Supprimer un article
  function supprimerDuPanier(id: number) {
    setPanier((ancienPanier) =>
      ancienPanier.filter((produit) => produit.id !== id)
    )
  }

  // Total du panier
  const totalPanier = panier.reduce(
    (total, produit) => total + produit.prix, 0
  )

  // Afficher le choix des boissons
  function afficherBoissons(
    boisson: string,
    choisirBoisson: (valeur: string) => void
  ) {
    return (
      <div className="section-boissons">
        <h3>Choisis ta boisson</h3>

        <div className="choix-boissons">
          {boissonsDisponibles.map((b) => (
            <label
              key={b.nom}
              className={
                boisson === b.nom
                  ? 'carte-boisson selectionne'
                  : 'carte-boisson'
              }
            >
              <img src={b.image} alt={b.nom} />

              <span className="nom-boisson">
                <input
                  type="radio"
                  name="boisson-active"
                  checked={boisson === b.nom}
                  onChange={() => choisirBoisson(b.nom)}
                />
                {b.nom}
              </span>

              <span className="tarif-boisson">
                {b.prix > 0
                  ? `+${euros(b.prix)}`
                  : 'Inclus dans le menu'}
              </span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="entete">
        <img
          src="/logo-mimoza-transparent.png"
          alt="Logo Mimoza"
          className="logo-mimoza"
        />

        <div className="identite">
          <h1>MIMOZA</h1>
          <p className="sous-titre">Cuisine Anatolienne</p>
        </div>

        <button type="button" className="acces-panier" onClick={allerAuPanier}>
          Mon panier ({panier.length})
          <span>{euros(totalPanier)}</span>
        </button>
      </header>

      <main>
        {idModification !== null && (
          <div className="bandeau-modification">
            Tu modifies un article de ton panier.
            <button type="button" onClick={annulerModification}>Annuler</button>
          </div>
        )}

        {/* Les 3 onglets */}
        <nav className="onglets">
          {(['Kebabs', 'Pide & Lahmacun', 'Tacos'] as Categorie[]).map(
            (nom) => (
              <button
                key={nom}
                type="button"
                className={
                  categorie === nom ? 'onglet actif' : 'onglet'
                }
                onClick={() => setCategorie(nom)}
              >
                
                
                
                {nom}
              </button>
            )
          )}
        </nav>

        {/* ONGLET KEBABS */}
        {categorie === 'Kebabs' && (
          <section>
            <h2>Compose ton kebab de rêve !</h2>
            <p className="description">
              🫵 C'est toi le chef ! Choisis ton pain,
              tes ingrédients et tes sauces pour créer
              le kebab parfait. 
            </p>

            <h3>1. Choisis ton pain</h3>
            <div className="choix-pains">
              {pains.map((p) => (
                <label
                  key={p.nom}
                  className={
                    pain === p.nom
                      ? 'carte-pain selectionne'
                      : 'carte-pain'
                  }
                >
                  <img src={p.image} alt={p.nom} />
                  <span className="nom-pain">
                    <input
                      type="radio"
                      name="pain"
                      checked={pain === p.nom}
                      onChange={() => setPain(p.nom)}
                    />
                    {p.nom}
                  </span>
                </label>
              ))}
            </div>

            <h3>2. Choisis tes crudités (gratuites)</h3>
            <div className="options">
              {cruditesDisponibles.map((c) => (
                <label key={c}>
                  <input
                    type="checkbox"
                    checked={crudites.includes(c)}
                    onChange={() =>
                      changerChoix(c, crudites, setCrudites)
                    }
                  />
                  {c}
                </label>
              ))}
            </div>

            <h3>3. Choisis tes suppléments</h3>
            <div className="options">
              {supplementsDisponibles.map((s) => (
                <label key={s.nom}>
                  <input
                    type="checkbox"
                    checked={supplements.includes(s.nom)}
                    onChange={() =>
                      changerChoix(
                        s.nom, supplements, setSupplements
                      )
                    }
                  />
                  {s.nom} +{euros(s.prix)}
                </label>
              ))}
            </div>

            <h3>4. Choisis tes sauces (maximum 2)</h3>
            <p className="compteur">
              Sauces sélectionnées : {saucesKebab.length}/2
            </p>
            <div className="options">
              {saucesDisponibles.map((s) => (
                <label key={s}>
                  <input
                    type="checkbox"
                    checked={saucesKebab.includes(s)}
                    disabled={
                      saucesKebab.length >= 2 &&
                      !saucesKebab.includes(s)
                    }
                    onChange={() =>
                      changerChoix(
                        s, saucesKebab, setSaucesKebab, 2
                      )
                    }
                  />
                  {s}
                </label>
              ))}
            </div>

            <h3>5. Transformer en menu ? (+2 €)</h3>
            <div className="options">
              <label>
                <input
                  type="radio"
                  name="menu-kebab"
                  checked={!menuKebab}
                  onChange={() => {
                    setMenuKebab(false)
                    setBoissonKebab('')
                  }}
                />
                Non, sandwich seul
              </label>

              <label>
                <input
                  type="radio"
                  name="menu-kebab"
                  checked={menuKebab}
                  onChange={() => setMenuKebab(true)}
                />
                Oui, en menu (+2 €)
              </label>
            </div>

            {menuKebab &&
              afficherBoissons(boissonKebab, setBoissonKebab)}

            <div className="prix">
              Prix : {euros(prixKebab)}
            </div>

            <button
              className="bouton-panier"
              onClick={ajouterKebab}
            >
              {idModification !== null ? 'Enregistrer les modifications' : 'Ajouter ce kebab au panier'}
            </button>
          </section>
        )}

        {/* ONGLET PIDES */}
        {categorie === 'Pide & Lahmacun' && (
          <section>
            <h2>Nos pides et notre lahmacun</h2>
            <p className="description">
              Des recettes gourmandes préparées chez Mimoza !
            </p>

            <div className="grille-produits">
              {pide.map((pide) => (
                <article className="carte-produit" key={pide.nom}>
                  <img src={pide.image} alt={pide.nom} />
                  <div className="contenu-produit">
                    <h3>{pide.nom}</h3>
                    <p className="prix-produit">
                      {euros(pide.prix)}
                    </p>
                    <button
                      className="bouton-panier"
                      onClick={() =>
                        ajouterAuPanier(
                          pide.nom,
                          ['Recette fixe'],
                          pide.prix
                        )
                      }
                    >
                      {idModification !== null ? 'Remplacer par ce pide' : 'Ajouter au panier'}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <h3>Lahmacun — {euros(5)}</h3>
            <div className="grille-produits">
              <article className="carte-produit">
                <img src="/lahmacun-mimoza.png" alt="Lahmacun Mimoza" />
                <div className="contenu-produit">
                  <h3>Lahmacun</h3>
                  <p className="prix-produit">{euros(5)}</p>
                  <button
                    type="button"
                    className="bouton-panier"
                    onClick={() => setLahmacunOuvert(true)}
                  >
                    Choisir mon lahmacun
                  </button>
                </div>
              </article>
            </div>

            {lahmacunOuvert && (
              <div className="personnalisation-lahmacun">
                <h3>Personnalise ton lahmacun</h3>
                <p className="description">Choisis tes crudités et tes sauces.</p>
                <h3>1. Choisis tes crudités (gratuites)</h3>
                <div className="options">
                  {cruditesDisponibles.map((c) => (
                    <label key={c}>
                      <input
                        type="checkbox"
                        checked={cruditesLahmacun.includes(c)}
                        onChange={() => changerChoix(c, cruditesLahmacun, setCruditesLahmacun)}
                      />
                      {c}
                    </label>
                  ))}
                </div>
                <h3>2. Choisis tes sauces (maximum 2)</h3>
                <p className="compteur">Sauces sélectionnées : {saucesLahmacun.length}/2</p>
                <div className="options">
                  {saucesDisponibles.map((sauce) => (
                    <label key={sauce}>
                      <input
                        type="checkbox"
                        checked={saucesLahmacun.includes(sauce)}
                        disabled={saucesLahmacun.length >= 2 && !saucesLahmacun.includes(sauce)}
                        onChange={() => changerChoix(sauce, saucesLahmacun, setSaucesLahmacun, 2)}
                      />
                      {sauce}
                    </label>
                  ))}
                </div>
                <div className="prix">Prix : {euros(5)}</div>
                <button type="button" className="bouton-panier" onClick={ajouterLahmacun}>
                  {idModification !== null ? 'Enregistrer les modifications' : 'Ajouter ce lahmacun au panier'}
                </button>
              </div>
            )}
          </section>
        )}

        {/* ONGLET TACOS */}
        {categorie === 'Tacos' && (
          <section>
            <h2>Compose ton tacos !</h2>
            <p className="description">
              Choisis ta taille, tes viandes et tes sauces.
            </p>

            <img
              src="/tacos-mimoza.png"
              alt="Tacos Mimoza"
              className="photo-tacos"
            />

            <h3>1. Choisis ta taille</h3>
            <div className="options">
              {taillesTacos.map((t) => (
                <label key={t.nom}>
                  <input
                    type="radio"
                    name="taille-tacos"
                    checked={tailleTacos === t.nom}
                    onChange={() => {
                      setTailleTacos(t.nom)
                      setViandesTacos((actuelles) =>
                        actuelles.slice(0, t.viandes)
                      )
                    }}
                  />
                  {t.nom} — {euros(t.prix)}
                  ({t.viandes} viande{t.viandes > 1 ? 's' : ''})
                </label>
              ))}
            </div>

            <h3>
              2. Choisis tes viandes
              ({tailleSelectionnee.viandes} obligatoires)
            </h3>

            <p className="compteur">
              Viandes sélectionnées : {viandesTacos.length}/
              {tailleSelectionnee.viandes}
            </p>

            <div className="options">
              {viandesDisponibles.map((v) => (
                <label key={v}>
                  <input
                    type="checkbox"
                    checked={viandesTacos.includes(v)}
                    disabled={
                      viandesTacos.length >=
                        tailleSelectionnee.viandes &&
                      !viandesTacos.includes(v)
                    }
                    onChange={() =>
                      changerChoix(
                        v,
                        viandesTacos,
                        setViandesTacos,
                        tailleSelectionnee.viandes
                      )
                    }
                  />
                  {v}
                </label>
              ))}
            </div>

            <h3>3. Choisis tes sauces (maximum 2)</h3>
            <p className="compteur">
              Sauces sélectionnées : {saucesTacos.length}/2
            </p>

            <div className="options">
              {saucesDisponibles.map((s) => (
                <label key={s}>
                  <input
                    type="checkbox"
                    checked={saucesTacos.includes(s)}
                    disabled={
                      saucesTacos.length >= 2 &&
                      !saucesTacos.includes(s)
                    }
                    onChange={() =>
                      changerChoix(
                        s, saucesTacos, setSaucesTacos, 2
                      )
                    }
                  />
                  {s}
                </label>
              ))}
            </div>

            <h3>4. Transformer en menu ? (+2 €)</h3>
            <div className="options">
              <label>
                <input
                  type="radio"
                  name="menu-tacos"
                  checked={!menuTacos}
                  onChange={() => {
                    setMenuTacos(false)
                    setBoissonTacos('')
                  }}
                />
                Non, tacos seul
              </label>

              <label>
                <input
                  type="radio"
                  name="menu-tacos"
                  checked={menuTacos}
                  onChange={() => setMenuTacos(true)}
                />
                Oui, en menu (+2 €)
              </label>
            </div>

            {menuTacos &&
              afficherBoissons(boissonTacos, setBoissonTacos)}

            <div className="prix">
              Prix : {euros(prixTacos)}
            </div>

            <button
              className="bouton-panier"
              onClick={ajouterTacos}
              disabled={
                viandesTacos.length !== tailleSelectionnee.viandes ||
                (menuTacos && !boissonTacos)
              }
            >
              {idModification !== null ? 'Enregistrer les modifications' : 'Ajouter ce tacos au panier'}
            </button>
          </section>
        )}

        {/* PANIER COMMUN */}
        <section className="section-panier" id="panier">
          <h2>Mon panier ({panier.length})</h2>

          {panier.length === 0 ? (
            <p className="description">
              Ton panier est vide pour le moment.
            </p>
          ) : (
            <>
              {panier.map((produit) => (
                <article
                  className="article-panier"
                  key={produit.id}
                >
                  <div>
                    <h3>{produit.nom}</h3>
                    {produit.details.map((detail, index) => (
                      <p key={index}>{detail}</p>
                    ))}
                    <strong>{euros(produit.prix)}</strong>
                  </div>

                  <div className="actions-panier">
                    <button
                      type="button"
                      className="bouton-modifier"
                      onClick={() => modifierProduit(produit)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="bouton-supprimer"
                      onClick={() => supprimerDuPanier(produit.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </article>
              ))}

              <div className="prix">
                Total de la commande : {euros(totalPanier)}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
