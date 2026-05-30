import styles from './Landing.module.css'

const SOCIALS = [
  { label: 'Spotify',   url: 'https://open.spotify.com/intl-es/artist/6YJv8uvliYQrpqgvnCK6U7', icon: SpotifyIcon },
  { label: 'Instagram', url: 'https://www.instagram.com/1943ezpeletarecords/',               icon: IGIcon },
  { label: 'Facebook',  url: 'https://www.facebook.com/1943ezpeletarecords',                 icon: FBIcon },
  { label: 'YouTube',   url: 'https://www.youtube.com/@1943EzpeletaRecords',                        icon: YouTubeIcon },
]

const SHOWS = [
  { day: '30', month: 'MAY', venue: 'Club Tucumán', city: 'Quilmes · Zona Sur', tag: 'ESTA SEMANA', cls: 'next', entradas: null },
  { day: '06', month: 'JUN', venue: 'Strummer Bar', city: 'Palermo · CABA', tag: 'PRÓXIMO', cls: '', entradas: null },
  { day: '20', month: 'JUN', venue: 'Teatro Bar El Suplicante', city: 'Gral. Belgrano · Bs. As.', tag: 'PRÓXIMO', cls: '', entradas: 'https://alpogo.com/evento/1943-tribulacion-7-la-miseria-26317' },
]

const DISCOS = [
  '1994 — Sábado a las 14:30',
  '1995 — Ezpeleta Records',
  '1998 — Supervida',
  '2011 — Recalculando',
  '2014 — Más vivos que nunca',
  '2017 — Víctimas',
  '2018 — DVD 25 años',
  '2023 — Sin mirar atrás',
]

const MERCH_WA = 'https://wa.me/message/DAHWDP23TXKBG1'

export default function Landing() {
  return (
    <div className={styles.wrap}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroVideoWrap}>
          <iframe
            className={styles.heroVideo}
            src="https://www.youtube.com/embed/slmX3N6izBU?autoplay=1&mute=1&loop=1&playlist=slmX3N6izBU&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&start=4"
            allow="autoplay"
            frameBorder="0"
            title="1943 background"
          />
        </div>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <img src="/logo.jpg" alt="1943 Ezpeleta Records" className={styles.heroLogo} />
          <div className={styles.heroCtas}>
            <a href="https://open.spotify.com/intl-es/artist/6YJv8uvliYQrpqgvnCK6U7"
               target="_blank" rel="noreferrer" className={styles.ctaPrimary}>
              <SpotifyIcon /> Escuchar
            </a>
            <a href="#shows" className={styles.ctaSecondary}>Ver Shows</a>
          </div>
        </div>
        <div className={styles.heroScroll}>↓</div>
      </section>

      {/* ── MANIFIESTO ── */}
      <section className={styles.manifiesto}>
        <div className={styles.manifiestoInner}>
          <div className={styles.manifiestoLeft}>
            <blockquote className={styles.manifiestoQuote}>
              "A principios del '94, en plena adolescencia, con los pibes del barrio nos juntamos a tocar en el taller."
            </blockquote>
          </div>
          <div className={styles.manifiestoRight}>
            <p className={styles.manifiestoBody}>
              Fanáticos del jueguito 1943, punk rock, Ramones, Sumo, Los Violadores.
              Una banda autogestiva con todo lo que ello conlleva — tiempo, dedicación, compromiso.
              Los temas, los shows, el sonido: todo armado entre todos los integrantes.
              Orgullosos de llegar a más de 30 años manteniendo nuestra ideología e identidad.
            </p>
          </div>
        </div>
      </section>

      {/* ── MÚSICA ── */}
      <section className={styles.musicaWrap}>
        <div className={styles.musicaHeader}>
          <h2 className={styles.musicaTitulo}>La Música</h2>
          <span className={styles.musicaSub}>8 discos · 30 años · independiente</span>
        </div>
        <div className={styles.musicaEmbed}>
          <iframe
            style={{ borderRadius: '2px' }}
            src="https://open.spotify.com/embed/artist/6YJv8uvliYQrpqgvnCK6U7?utm_source=generator&theme=0"
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
        <div className={styles.discografia}>
          {DISCOS.map((d, i) => (
            <div key={i} className={styles.discoItem}>{d}</div>
          ))}
        </div>
      </section>

      {/* ── SHOWS ── */}
      <section id="shows" className={styles.showsWrap}>
        <div className={styles.showsHeader}>
          <h2 className={styles.showsTitulo}>
            Próximos <span className={styles.showsTituloRed}>Shows</span>
          </h2>
        </div>
        <div className={styles.showsList}>
          {SHOWS.map((s, i) => (
            <div key={i} className={`${styles.showItem} ${s.cls ? styles[s.cls] : ''}`}>
              <div className={styles.showDateBlock}>
                <div className={styles.showDay}>{s.day}</div>
                <div className={styles.showMonth}>{s.month}</div>
              </div>
              <div className={styles.showInfo}>
                <div className={styles.showVenue}>{s.venue}</div>
                <div className={styles.showCity}>{s.city}</div>
                {s.entradas && (
                  <a href={s.entradas} target="_blank" rel="noreferrer" className={styles.showEntradasMobile}>
                    Comprar entrada →
                  </a>
                )}
              </div>
              <div className={styles.showActions}>
                {s.entradas && (
                  <a href={s.entradas} target="_blank" rel="noreferrer" className={styles.showEntradas}>
                    Comprar entrada
                  </a>
                )}
                <span className={styles.showTag}>{s.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MERCH ── */}
      <div className={styles.merchWrap}>
        <div className={styles.merchLeft}>
          <h2 className={styles.merchTitulo}>Merch</h2>
          <p className={styles.merchText}>Remeras, discos y más.<br/>Escribinos directo por WhatsApp.</p>
        </div>
        <div className={styles.merchRight}>
          <a href={MERCH_WA} target="_blank" rel="noreferrer" className={styles.merchBtn}>
            <WAIcon /> Pedir por WhatsApp
          </a>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <p className={styles.footerFrase}>
            "Resistir nos hace<br/>cada vez más fuertes"
          </p>
          <div className={styles.footerBanda}>
            <span className={styles.footerBandaTitle}>La Banda</span>
            <div className={styles.footerIntegrantes}>
              <span>Diego Pele — Voz y guitarra</span>
              <span>Lucas Domínguez — Guitarra</span>
              <span>Daniel Falcón — Bajo</span>
              <span>Mariano Carabajal — Batería</span>
            </div>
          </div>
          <img src="/logo.jpg" alt="1943" className={styles.footerLogo} />
        </div>
        <div className={styles.footerBottom}>
          <div className={styles.footerLinks}>
            {SOCIALS.map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer"
                 className={styles.footerSocial}>
                <s.icon />
              </a>
            ))}
          </div>
          <p className={styles.footerCopy}>© 1943 Ezpeleta Records · Desde 1994</p>
        </div>
      </footer>

    </div>
  )
}

function SpotifyIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.55 14.42a.627.627 0 01-.86.21c-2.35-1.44-5.32-1.76-8.81-.97a.627.627 0 11-.28-1.22c3.82-.87 7.1-.5 9.73 1.12.3.17.39.56.22.86zm1.21-2.71a.78.78 0 01-1.08.26c-2.69-1.65-6.79-2.13-9.97-1.17a.784.784 0 01-.97-.52.784.784 0 01.52-.97c3.63-1.1 8.14-.57 11.22 1.32.38.23.5.72.28 1.08zm.1-2.84C14.61 8.77 8.87 8.57 5.49 9.59a.943.943 0 11-.55-1.8c3.86-1.17 10.27-.95 14.33 1.42a.943.943 0 01-1.41.86z"/></svg>
}
function YouTubeIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.67 12 3.67 12 3.67s-7.5 0-9.38.38A3.02 3.02 0 00.5 6.19C.12 8.09 0 10.1 0 12.07c0 1.97.12 3.98.5 5.88a3.02 3.02 0 002.12 2.14c1.88.38 9.38.38 9.38.38s7.5 0 9.38-.38a3.02 3.02 0 002.12-2.14C23.88 16.05 24 14.04 24 12.07c0-1.97-.12-3.98-.5-5.88zM9.75 15.52V8.62l6.25 3.45-6.25 3.45z"/></svg>
}
function IGIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="2.2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.2"/><circle cx="17.5" cy="6.5" r="1.3"/></svg>
}
function FBIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
}
function WAIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
}
