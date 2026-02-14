// import React from 'react'
// import { Link } from 'react-router-dom'
// import { useData } from '../state/DataContext'

// export default function ThirdPartyLanding(){
//   const { brands } = useData()
//   const tp = brands.filter(b => b !== 'S.H.Figuarts')
//   return (
//     <section>
//       <h1>Third Party Figures</h1>
//       <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16}}>
//         {tp.map(b => (
//           <Link key={b} to={`/third-party/${encodeURIComponent(b)}`} className="card" style={{padding:18, fontWeight:600}}>
//             {b}
//           </Link>
//         ))}
//       </div>
//     </section>
//   )
// }
