/**
 * Ilustración "foto finish": la carrera de fanáticos por las últimas costillas.
 * Un fan cruza la meta con el plato en alto (11:59:59); el otro, el cliente, llega un
 * paso detrás con la mano estirada (12:00:01). Colores de la marca; las animaciones
 * respetan reduced-motion (ver index.css).
 */
/** Tenis visto de lado, con la punta hacia +x desde el tobillo (0,0). */
function Tenis({ x, y, giro = 0, color = '#FDEED6' }: { x: number; y: number; giro?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${giro})`}>
      <path d="M-4 -3 Q-4 -6 0 -6 L6 -5 Q13 -4 15 1 L15 2 L-5 2 Z" fill={color} />
      <path d="M-5 2 L15 2 Q15 5 12 5 L-4 5 Q-6 5 -5 2 Z" fill="#2F1C15" />
      <path d="M3 -5 l2 3 M6 -5 l2 3" stroke="#B7502B" strokeWidth="1" strokeLinecap="round" />
    </g>
  )
}

export function FotoFinish({ horaGanador = '11:59:59', horaCliente = '12:00:01' }) {
  const piel1 = '#E1B78A'
  const piel2 = '#C98F5E'
  const pelo = '#3A2219'
  return (
    <svg viewBox="0 0 320 200" className="block h-auto w-full" role="img" aria-labelledby="ff-titulo">
      <title id="ff-titulo">
        Foto finish: un fanático cruza la meta con el último plato de costillas en alto; tú llegas
        un paso detrás, con la mano estirada.
      </title>

      <defs>
        <pattern id="ff-cuadros" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#FDEED6" />
          <rect width="4" height="4" fill="#2F1C15" />
          <rect x="4" y="4" width="4" height="4" fill="#2F1C15" />
        </pattern>
        <clipPath id="ff-marco">
          <rect width="320" height="200" rx="14" />
        </clipPath>
      </defs>

      <g clipPath="url(#ff-marco)">
        {/* Cielo y tribuna */}
        <rect width="320" height="200" fill="#3A2219" />
        <rect y="38" width="320" height="58" fill="#4A2A1E" />
        <g fill="#733E21">
          {Array.from({ length: 22 }, (_, i) => (
            <g key={i}>
              <circle cx={8 + i * 14.5} cy={56 + (i % 2) * 3} r="5" />
              <rect x={3 + i * 14.5} y={60 + (i % 2) * 3} width="10" height="10" rx="4" />
              <circle cx={15 + i * 14.5} cy={78 - (i % 3) * 2} r="5" />
              <rect x={10 + i * 14.5} y={82 - (i % 3) * 2} width="10" height="10" rx="4" />
            </g>
          ))}
        </g>
        <g stroke="#9A4B24" strokeWidth="2.5" strokeLinecap="round">
          <path d="M60 60 l-4 -9 M66 60 l4 -9" />
          <path d="M118 80 l-4 -9 M124 80 l4 -9" />
          <path d="M205 80 l-4 -9 M211 80 l4 -9" />
          <path d="M290 60 l-4 -9 M296 60 l4 -9" />
        </g>

        {/* Banderines */}
        <path d="M0 22 Q80 40 160 24 T320 22" fill="none" stroke="#E1B78A" strokeWidth="1" />
        {[14, 40, 66, 92, 118, 144, 172, 198, 224, 250, 276, 302].map((x, i) => {
          const y = 28 - Math.sin((x / 320) * Math.PI * 2) * 6
          return (
            <path key={x} d={`M${x - 7} ${y} L${x + 7} ${y} L${x} ${y + 12} Z`} fill={i % 2 ? '#EF7224' : '#B7502B'} />
          )
        })}

        {/* Pista */}
        <path d="M0 114 L320 106 L320 200 L0 200 Z" fill="#9A4B24" />
        <g stroke="#E1B78A" strokeWidth="1.5" opacity="0.5">
          <path d="M0 136 L320 124" />
          <path d="M0 164 L320 148" />
          <path d="M0 194 L320 174" />
        </g>
        <path d="M0 114 L320 106" stroke="#FDEED6" strokeWidth="2" />

        {/* Línea de meta en el piso, postes y arco */}
        <path d="M198 108 L208 108 L226 200 L210 200 Z" fill="url(#ff-cuadros)" />
        <rect x="186" y="34" width="5" height="78" fill="#FDEED6" />
        <rect x="284" y="32" width="5" height="76" fill="#FDEED6" />
        <rect x="180" y="22" width="114" height="16" rx="3" fill="url(#ff-cuadros)" stroke="#FDEED6" strokeWidth="1.5" />
        <rect x="214" y="25" width="46" height="10" rx="2" fill="#B7502B" />
        <text x="237" y="33" textAnchor="middle" fontSize="8" fontWeight="700" fill="#FDEED6" letterSpacing="1.5">
          META
        </text>

        {/* ---------- Fan 2 (tú): un paso antes de la meta, mano estirada ---------- */}
        <g className="ff-corredor">
          <ellipse cx="146" cy="182" rx="30" ry="4.5" fill="#2F1C15" opacity="0.35" />
          {/* velocidad y polvo */}
          <g stroke="#E1B78A" strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
            <path d="M72 104 h24" />
            <path d="M64 122 h28" />
            <path d="M78 140 h18" />
          </g>
          <g fill="#E1B78A" opacity="0.5">
            <circle cx="106" cy="178" r="6" />
            <circle cx="96" cy="174" r="4" />
          </g>

          {/* pierna de atrás */}
          <path d="M140 138 L124 152 L110 148" fill="none" stroke={piel2} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <Tenis x={111} y={148} giro={150} />
          {/* brazo de atrás */}
          <path d="M158 108 L146 120 L138 112" fill="none" stroke={piel2} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* pantaloneta */}
          <path d="M134 130 L154 126 L160 146 L138 150 Z" fill="#733E21" />
          {/* pierna de adelante */}
          <path d="M150 144 L166 158 L162 177" fill="none" stroke={piel2} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <Tenis x={162} y={176} giro={-4} />
          {/* camiseta */}
          <path d="M136 138 Q132 122 148 104 Q158 97 170 104 Q168 122 156 142 Q146 144 136 138 Z" fill="#F3D8B7" stroke="#E1B78A" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M152 103 Q158 108 166 104" stroke="#E1B78A" strokeWidth="2" fill="none" />
          {/* brazo estirado hacia la meta */}
          <path d="M164 106 L182 108 L198 98" fill="none" stroke={piel2} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M198 98 l5 -3 M198 98 l6 0 M198 98 l5 3" stroke={piel2} strokeWidth="2.5" strokeLinecap="round" />
          {/* cabeza con gorra */}
          <circle cx="172" cy="88" r="11" fill={piel2} />
          <path d="M161 86 Q161 75 172 75 Q183 75 183 85 Q172 82 161 86 Z" fill="#B7502B" />
          <path d="M180 82 l11 1 l-1 3 l-11 0 Z" fill="#9A4B24" />
          {/* cara de "¡nooo!" */}
          <circle cx="175" cy="89" r="1.6" fill="#2F1C15" />
          <circle cx="181" cy="89" r="1.6" fill="#2F1C15" />
          <ellipse cx="179" cy="95" rx="2.2" ry="3" fill="#2F1C15" />
          <path className="ff-sudor" d="M156 90 q-2.5 4 0 5.5 q2.5 -1.5 0 -5.5 Z" fill="#FDEED6" />
          <path className="ff-sudor ff-sudor-2" d="M151 97 q-2.5 4 0 5.5 q2.5 -1.5 0 -5.5 Z" fill="#FDEED6" />
        </g>

        {/* ---------- Fan 1: cruza la meta con el plato en alto ---------- */}
        <g className="ff-ganadora">
          <ellipse cx="252" cy="183" rx="26" ry="4.5" fill="#2F1C15" opacity="0.35" />
          {/* piernas (jean) */}
          <path d="M240 136 L236 156 L238 172" fill="none" stroke="#4A5068" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <Tenis x={238} y={174} giro={-20} />
          <path d="M248 136 L262 152 L264 174" fill="none" stroke="#4A5068" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <Tenis x={264} y={176} />
          {/* camiseta */}
          <path d="M234 102 Q244 96 256 102 L254 138 L236 138 Z" fill="#EF7224" stroke="#B7502B" strokeWidth="1.5" strokeLinejoin="round" />
          {/* cinta de meta rota sobre el pecho */}
          <path d="M191 92 Q214 112 236 116 Q246 118 254 114 Q270 104 289 90" fill="none" stroke="#FDEED6" strokeWidth="3" strokeLinecap="round" />
          {/* brazos arriba */}
          <path d="M236 106 L226 88 L232 70" fill="none" stroke={piel1} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M254 106 L264 88 L258 70" fill="none" stroke={piel1} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* plato de costillas con papas */}
          <ellipse cx="245" cy="66" rx="24" ry="6" fill="#FDEED6" stroke="#E1B78A" strokeWidth="1.5" />
          <g stroke="#F2B233" strokeWidth="2.5" strokeLinecap="round">
            <path d="M226 62 l3 -6 M231 63 l1 -7 M260 62 l-2 -7 M264 63 l-4 -6" />
          </g>
          <rect x="232" y="52" width="26" height="11" rx="4" fill="#9A4B24" />
          <path d="M233 56 Q245 51 257 56" stroke="#B7502B" strokeWidth="3" fill="none" />
          <g fill="#FDEED6">
            <rect x="229" y="54" width="5" height="3" rx="1.5" />
            <rect x="229" y="58" width="5" height="3" rx="1.5" />
            <rect x="256" y="54" width="5" height="3" rx="1.5" />
            <rect x="256" y="58" width="5" height="3" rx="1.5" />
          </g>
          {/* vapor */}
          <path d="M238 46 q3 -5 0 -9 M246 44 q3 -5 0 -9 M254 46 q3 -5 0 -9" stroke="#FDEED6" strokeWidth="1.5" fill="none" opacity="0.6" />
          {/* cabeza */}
          <circle cx="245" cy="88" r="11" fill={piel1} />
          <path d="M234 86 Q234 74 246 74 Q257 74 256 86 Q252 80 246 80 Q238 80 234 86 Z" fill={pelo} />
          {/* cara feliz: ojos cerrados y boca abierta */}
          <path d="M239 88 q2 -2 4 0 M247 88 q2 -2 4 0" stroke="#2F1C15" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M240 93 Q245 100 250 93 Z" fill="#2F1C15" />
          {/* destellos */}
          <path d="M214 60 l-6 -3 M216 48 l-5 -6 M276 60 l6 -3 M274 48 l5 -6" stroke="#F2B233" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Línea de la cámara de llegada */}
        <path d="M204 18 L204 200" stroke="#EF7224" strokeWidth="1" strokeDasharray="4 3" opacity="0.8" />

        {/* Tiempos de la foto finish */}
        <g fontFamily="ui-monospace, monospace" fontWeight="800" fontSize="9" textAnchor="middle">
          <rect x="262" y="128" width="52" height="15" rx="3" fill="#2F1C15" opacity="0.85" />
          <text x="288" y="139" fill="#FDEED6">1° {horaGanador}</text>
          <rect x="88" y="62" width="56" height="15" rx="3" fill="#B7502B" />
          <text x="116" y="73" fill="#FDEED6">2° {horaCliente}</text>
        </g>

        {/* Marco de cámara */}
        <g fill="none" stroke="#FDEED6" strokeWidth="2.5" strokeLinecap="round">
          <path d="M10 26 V10 H26" />
          <path d="M294 10 H310 V26" />
          <path d="M10 174 V190 H26" />
          <path d="M294 190 H310 V174" />
        </g>
        <rect x="16" y="170" width="92" height="18" rx="4" fill="#2F1C15" opacity="0.85" />
        <circle className="ff-rec" cx="27" cy="179" r="3.5" fill="#EF7224" />
        <text x="36" y="183" fontSize="9.5" fontWeight="700" fill="#FDEED6" letterSpacing="1.2">
          FOTO FINISH
        </text>

        {/* Destello de la cámara al abrir */}
        <rect className="ff-flash" width="320" height="200" fill="#FDEED6" opacity="0" />
      </g>
    </svg>
  )
}
