<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pagination & NoSQL — Cours Complet</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --border: #1e1e2e;
    --accent: #00ff9d;
    --accent2: #7c3aed;
    --accent3: #f59e0b;
    --text: #e2e8f0;
    --muted: #64748b;
    --code-bg: #0d1117;
    --red: #f43f5e;
    --blue: #38bdf8;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    line-height: 1.7;
    overflow-x: hidden;
  }

  /* GRID NOISE BACKGROUND */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0,255,157,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,157,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  /* HERO */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 60px 20px;
    overflow: hidden;
    z-index: 1;
  }

  .hero::after {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--accent);
    color: var(--accent);
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 2px;
    margin-bottom: 32px;
    animation: fadeSlide 0.6s ease both;
  }

  .badge::before {
    content: '●';
    font-size: 8px;
    animation: blink 1.5s infinite;
  }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  h1 {
    font-size: clamp(3rem, 8vw, 6.5rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -2px;
    margin-bottom: 24px;
    animation: fadeSlide 0.7s ease 0.1s both;
  }

  h1 span.green { color: var(--accent); }
  h1 span.purple { color: #a78bfa; }

  .hero-sub {
    font-size: 1.1rem;
    color: var(--muted);
    max-width: 560px;
    margin-bottom: 48px;
    animation: fadeSlide 0.7s ease 0.2s both;
    font-weight: 400;
  }

  .toc-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    animation: fadeSlide 0.7s ease 0.3s both;
  }

  .toc-chip {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 8px 18px;
    border-radius: 2px;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
  }

  .toc-chip:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  /* SECTIONS */
  .section {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 80px 24px;
    border-top: 1px solid var(--border);
  }

  .section-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  h2 {
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 32px;
    line-height: 1.1;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 40px 0 16px;
    color: var(--accent3);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  h3::before {
    content: '▸';
    color: var(--accent);
  }

  p { margin-bottom: 16px; color: #cbd5e1; font-size: 0.97rem; }

  /* CODE BLOCKS */
  pre {
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: 4px;
    padding: 20px 24px;
    overflow-x: auto;
    margin: 20px 0;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    line-height: 1.6;
  }

  pre.purple { border-left-color: var(--accent2); }
  pre.amber { border-left-color: var(--accent3); }
  pre.red { border-left-color: var(--red); }
  pre.blue { border-left-color: var(--blue); }

  .kw { color: #c792ea; }
  .fn { color: #82aaff; }
  .str { color: #c3e88d; }
  .num { color: #f78c6c; }
  .cmt { color: #546e7a; font-style: italic; }
  .key { color: var(--accent); }
  .op { color: #89ddff; }

  /* CARDS */
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
    margin: 28px 0;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 24px;
    border-radius: 4px;
    transition: border-color 0.2s, transform 0.2s;
  }

  .card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
  }

  .card-icon { font-size: 1.8rem; margin-bottom: 12px; }
  .card-title { font-weight: 700; margin-bottom: 8px; font-size: 0.95rem; }
  .card-text { color: var(--muted); font-size: 0.85rem; line-height: 1.5; }

  /* COMPARISON TABLE */
  .table-wrap { overflow-x: auto; margin: 24px 0; }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
    font-family: 'Space Mono', monospace;
  }

  th {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 12px 16px;
    text-align: left;
    color: var(--accent);
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  td {
    border: 1px solid var(--border);
    padding: 12px 16px;
    vertical-align: top;
    color: #94a3b8;
  }

  tr:hover td { background: rgba(255,255,255,0.02); }

  td.yes { color: var(--accent); }
  td.no { color: var(--red); }
  td.mid { color: var(--accent3); }

  /* CALLOUT */
  .callout {
    border: 1px solid;
    padding: 16px 20px;
    border-radius: 4px;
    margin: 20px 0;
    font-size: 0.9rem;
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }

  .callout.info { border-color: var(--blue); background: rgba(56,189,248,0.05); }
  .callout.warn { border-color: var(--accent3); background: rgba(245,158,11,0.05); }
  .callout.tip { border-color: var(--accent); background: rgba(0,255,157,0.05); }
  .callout.danger { border-color: var(--red); background: rgba(244,63,94,0.05); }

  .callout-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 2px; }
  .callout p { margin: 0; color: var(--text); }
  .callout strong { color: var(--accent3); }

  /* HIGHLIGHT */
  .highlight { color: var(--accent); font-weight: 700; }
  .highlight.purple { color: #a78bfa; }
  .highlight.amber { color: var(--accent3); }

  /* STEP LIST */
  .steps { counter-reset: step; list-style: none; margin: 20px 0; }
  .steps li {
    counter-increment: step;
    padding: 14px 14px 14px 56px;
    position: relative;
    margin-bottom: 8px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 0.92rem;
    color: #cbd5e1;
  }
  .steps li::before {
    content: counter(step, decimal-leading-zero);
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--accent);
    font-weight: 700;
  }

  /* DIVIDER */
  .divider {
    text-align: center;
    color: var(--border);
    font-size: 1.5rem;
    margin: 60px 0;
    letter-spacing: 8px;
  }

  /* SCHEMA DIAGRAM */
  .schema-box {
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 28px;
    margin: 20px 0;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    line-height: 1.8;
    color: #94a3b8;
    overflow-x: auto;
  }

  .schema-box .arrow { color: var(--accent); }
  .schema-box .box { 
    display: inline-block;
    border: 1px solid var(--accent2);
    padding: 4px 12px;
    color: #a78bfa;
    border-radius: 2px;
  }
  .schema-box .box.green { border-color: var(--accent); color: var(--accent); }
  .schema-box .box.amber { border-color: var(--accent3); color: var(--accent3); }

  /* FOOTER */
  footer {
    text-align: center;
    padding: 60px 20px;
    border-top: 1px solid var(--border);
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: var(--muted);
    z-index: 1;
    position: relative;
  }

  footer span { color: var(--accent); }

  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* SCROLL REVEAL */
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* TAG */
  .tag {
    display: inline-block;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 2px;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-left: 8px;
    vertical-align: middle;
  }
  .tag.green { background: rgba(0,255,157,0.1); color: var(--accent); border: 1px solid rgba(0,255,157,0.3); }
  .tag.amber { background: rgba(245,158,11,0.1); color: var(--accent3); border: 1px solid rgba(245,158,11,0.3); }
  .tag.red { background: rgba(244,63,94,0.1); color: var(--red); border: 1px solid rgba(244,63,94,0.3); }

  ul.bullet { padding-left: 0; list-style: none; margin: 16px 0; }
  ul.bullet li { padding: 6px 0 6px 24px; position: relative; color: #94a3b8; font-size: 0.92rem; }
  ul.bullet li::before { content: '→'; position: absolute; left: 0; color: var(--accent); }
</style>
</head>
<body>

<!-- HERO -->
<section class="hero">
  <div class="badge">Cours Complet</div>
  <h1><span class="green">Pagination</span><br>&amp; <span class="purple">NoSQL</span></h1>
  <p class="hero-sub">Maîtrise complète : offset/cursor, MongoDB, Redis, Elasticsearch et stratégies de production.</p>
  <nav class="toc-grid">
    <a href="#pagination-intro" class="toc-chip">01 · Intro Pagination</a>
    <a href="#offset" class="toc-chip">02 · Offset/Limit</a>
    <a href="#cursor" class="toc-chip">03 · Cursor-based</a>
    <a href="#keyset" class="toc-chip">04 · Keyset</a>
    <a href="#nosql-intro" class="toc-chip">05 · Intro NoSQL</a>
    <a href="#mongodb" class="toc-chip">06 · MongoDB</a>
    <a href="#redis" class="toc-chip">07 · Redis</a>
    <a href="#elasticsearch" class="toc-chip">08 · Elasticsearch</a>
    <a href="#python" class="toc-chip">09 · Python + Flask</a>
    <a href="#perf" class="toc-chip">10 · Performance</a>
  </nav>
</section>

<!-- ============================================================ -->
<!-- SECTION 1 : INTRO PAGINATION -->
<!-- ============================================================ -->
<section class="section reveal" id="pagination-intro">
  <div class="section-label">Module 01</div>
  <h2>Pourquoi paginer ?</h2>

  <p>La <span class="highlight">pagination</span> est le mécanisme qui permet de découper un grand ensemble de données en sous-ensembles (pages) transmis progressivement au client. Sans pagination, une requête sur une table de 10 millions de lignes chargerait tout en RAM, ferait exploser la bande passante et tuerait l'expérience utilisateur.</p>

  <div class="card-grid">
    <div class="card">
      <div class="card-icon">🚀</div>
      <div class="card-title">Performance</div>
      <div class="card-text">Réduction drastique des temps de réponse. On ne charge que les données nécessaires.</div>
    </div>
    <div class="card">
      <div class="card-icon">💾</div>
      <div class="card-title">Mémoire</div>
      <div class="card-text">Le serveur et le client ne gardent qu'une fraction des données en mémoire à tout instant.</div>
    </div>
    <div class="card">
      <div class="card-icon">📡</div>
      <div class="card-title">Bande passante</div>
      <div class="card-text">Moins de données transférées = moins de coût réseau, surtout sur mobile.</div>
    </div>
    <div class="card">
      <div class="card-icon">⚡</div>
      <div class="card-title">UX</div>
      <div class="card-text">Affichage quasi-instantané. L'utilisateur reçoit les premières données en millisecondes.</div>
    </div>
  </div>

  <h3>Les 3 grandes stratégies</h3>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Stratégie</th><th>Principe</th><th>Cas d'usage</th><th>Complexité</th></tr></thead>
      <tbody>
        <tr><td><strong>Offset / Limit</strong></td><td>Sauter N lignes, prendre M</td><td>CMS, admin, petites tables</td><td class="yes">Facile</td></tr>
        <tr><td><strong>Cursor-based</strong></td><td>Reprendre depuis un token opaque</td><td>API publiques, feeds</td><td class="mid">Moyenne</td></tr>
        <tr><td><strong>Keyset</strong></td><td>Filtrer sur la dernière valeur vue</td><td>Grands volumes, temps réel</td><td class="mid">Moyenne</td></tr>
      </tbody>
    </table>
  </div>
</section>

<!-- ============================================================ -->
<!-- SECTION 2 : OFFSET / LIMIT -->
<!-- ============================================================ -->
<section class="section reveal" id="offset">
  <div class="section-label">Module 02</div>
  <h2>Pagination Offset / Limit</h2>

  <p>C'est la méthode la plus <span class="highlight">intuitive</span>. On demande au moteur de <em>sauter</em> N enregistrements puis d'en retourner M.</p>

  <h3>SQL classique</h3>
  <pre><span class="cmt">-- Page 3, 20 items par page → offset = (3-1)*20 = 40</span>
<span class="kw">SELECT</span> id, title, created_at
<span class="kw">FROM</span>   articles
<span class="kw">ORDER BY</span> created_at <span class="kw">DESC</span>
<span class="kw">LIMIT</span>  <span class="num">20</span>
<span class="kw">OFFSET</span> <span class="num">40</span>;</pre>

  <h3>Formule universelle</h3>
  <pre><span class="cmt"># Python</span>
<span class="kw">def</span> <span class="fn">paginate</span>(page: <span class="fn">int</span>, per_page: <span class="fn">int</span>) <span class="op">-></span> <span class="fn">tuple</span>:
    offset <span class="op">=</span> (page <span class="op">-</span> <span class="num">1</span>) <span class="op">*</span> per_page
    <span class="kw">return</span> offset, per_page

<span class="cmt"># page=1  → offset=0,  limit=20</span>
<span class="cmt"># page=2  → offset=20, limit=20</span>
<span class="cmt"># page=10 → offset=180,limit=20</span></pre>

  <h3>Réponse API standard</h3>
  <pre class="purple">{
  <span class="key">"data"</span>: [...],
  <span class="key">"pagination"</span>: {
    <span class="key">"page"</span>:        <span class="num">3</span>,
    <span class="key">"per_page"</span>:    <span class="num">20</span>,
    <span class="key">"total"</span>:       <span class="num">1547</span>,
    <span class="key">"total_pages"</span>: <span class="num">78</span>,
    <span class="key">"has_next"</span>:    <span class="kw">true</span>,
    <span class="key">"has_prev"</span>:    <span class="kw">true</span>
  }
}</pre>

  <div class="callout danger">
    <span class="callout-icon">⚠️</span>
    <p><strong>Le problème du grand offset :</strong> <code>OFFSET 100000</code> oblige la base à <em>lire et jeter</em> 100 000 lignes avant de retourner les résultats. Sur une table de plusieurs millions de lignes, cela devient catastrophiquement lent. C'est pourquoi on préfère le keyset pour les grands volumes.</p>
  </div>

  <h3>Flask-SQLAlchemy — Implémentation complète</h3>
  <pre><span class="kw">from</span> flask <span class="kw">import</span> request, jsonify
<span class="kw">from</span> models <span class="kw">import</span> Article

<span class="fn">@app.route</span>(<span class="str">'/articles'</span>)
<span class="kw">def</span> <span class="fn">list_articles</span>():
    page     <span class="op">=</span> request.args.get(<span class="str">'page'</span>, <span class="num">1</span>, type<span class="op">=</span><span class="fn">int</span>)
    per_page <span class="op">=</span> min(request.args.get(<span class="str">'per_page'</span>, <span class="num">20</span>, type<span class="op">=</span><span class="fn">int</span>), <span class="num">100</span>)

    pagination <span class="op">=</span> (
        Article.query
        .order_by(Article.created_at.desc())
        .paginate(page<span class="op">=</span>page, per_page<span class="op">=</span>per_page, error_out<span class="op">=</span><span class="kw">False</span>)
    )

    <span class="kw">return</span> jsonify({
        <span class="str">'data'</span>:        [a.to_dict() <span class="kw">for</span> a <span class="kw">in</span> pagination.items],
        <span class="str">'page'</span>:        pagination.page,
        <span class="str">'per_page'</span>:    pagination.per_page,
        <span class="str">'total'</span>:       pagination.total,
        <span class="str">'total_pages'</span>: pagination.pages,
        <span class="str">'has_next'</span>:    pagination.has_next,
        <span class="str">'has_prev'</span>:    pagination.has_prev
    })</pre>
</section>

<!-- ============================================================ -->
<!-- SECTION 3 : CURSOR-BASED -->
<!-- ============================================================ -->
<section class="section reveal" id="cursor">
  <div class="section-label">Module 03</div>
  <h2>Pagination Cursor-based</h2>

  <p>Au lieu de passer un numéro de page, on envoie un <span class="highlight">cursor</span> — un token opaque (souvent un ID ou une date encodée en base64) qui indique <em>à partir d'où</em> continuer la lecture. Cette approche est utilisée par Twitter, Instagram, GitHub…</p>

  <h3>Fonctionnement</h3>
  <div class="schema-box">
<span class="cmt"># 1ère requête</span>
GET /posts?limit=10

<span class="arrow">→</span> { data: [...10 items...], next_cursor: <span class="str">"eyJpZCI6MTIzfQ=="</span> }

<span class="cmt"># 2ème requête</span>
GET /posts?limit=10&amp;cursor=eyJpZCI6MTIzfQ==

<span class="arrow">→</span> { data: [...10 items suivants...], next_cursor: <span class="str">"eyJpZCI6OTh9"</span> }

<span class="cmt"># Dernière page</span>
GET /posts?limit=10&amp;cursor=eyJpZCI6Mn0=

<span class="arrow">→</span> { data: [...derniers items...], next_cursor: <span class="kw">null</span> }
  </div>

  <h3>Implémentation Python</h3>
  <pre><span class="kw">import</span> base64, json
<span class="kw">from</span> datetime <span class="kw">import</span> datetime

<span class="kw">def</span> <span class="fn">encode_cursor</span>(last_id: <span class="fn">int</span>) <span class="op">-></span> <span class="fn">str</span>:
    payload <span class="op">=</span> json.dumps({<span class="str">'id'</span>: last_id})
    <span class="kw">return</span> base64.b64encode(payload.encode()).decode()

<span class="kw">def</span> <span class="fn">decode_cursor</span>(cursor: <span class="fn">str</span>) <span class="op">-></span> <span class="fn">int</span>:
    payload <span class="op">=</span> base64.b64decode(cursor.encode()).decode()
    <span class="kw">return</span> json.loads(payload)[<span class="str">'id'</span>]

<span class="fn">@app.route</span>(<span class="str">'/posts'</span>)
<span class="kw">def</span> <span class="fn">list_posts</span>():
    limit  <span class="op">=</span> min(request.args.get(<span class="str">'limit'</span>, <span class="num">20</span>, type<span class="op">=</span><span class="fn">int</span>), <span class="num">100</span>)
    cursor <span class="op">=</span> request.args.get(<span class="str">'cursor'</span>)

    query <span class="op">=</span> Post.query.order_by(Post.id.desc())

    <span class="kw">if</span> cursor:
        last_id <span class="op">=</span> <span class="fn">decode_cursor</span>(cursor)
        query   <span class="op">=</span> query.filter(Post.id <span class="op">&lt;</span> last_id)

    posts       <span class="op">=</span> query.limit(limit <span class="op">+</span> <span class="num">1</span>).all()
    has_more    <span class="op">=</span> len(posts) <span class="op">></span> limit
    posts       <span class="op">=</span> posts[:limit]
    next_cursor <span class="op">=</span> <span class="fn">encode_cursor</span>(posts[<span class="op">-</span><span class="num">1</span>].id) <span class="kw">if</span> has_more <span class="kw">else</span> <span class="kw">None</span>

    <span class="kw">return</span> jsonify({
        <span class="str">'data'</span>:        [p.to_dict() <span class="kw">for</span> p <span class="kw">in</span> posts],
        <span class="str">'next_cursor'</span>: next_cursor,
        <span class="str">'has_more'</span>:    has_more
    })</pre>

  <div class="callout tip">
    <span class="callout-icon">💡</span>
    <p><strong>Astuce :</strong> On demande <code>limit + 1</code> résultats. Si on en obtient plus que <code>limit</code>, c'est qu'il y a une page suivante. On retourne uniquement les <code>limit</code> premiers.</p>
  </div>
</section>

<!-- ============================================================ -->
<!-- SECTION 4 : KEYSET -->
<!-- ============================================================ -->
<section class="section reveal" id="keyset">
  <div class="section-label">Module 04</div>
  <h2>Pagination Keyset (Seek Method)</h2>

  <p>La <span class="highlight">keyset pagination</span> utilise directement les valeurs des colonnes indexées comme filtre. C'est la méthode la plus performante pour les grands volumes.</p>

  <h3>Principe — WHERE au lieu d'OFFSET</h3>
  <pre><span class="cmt">-- ❌ Lent avec grand offset</span>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> events <span class="kw">ORDER BY</span> id <span class="kw">DESC LIMIT</span> <span class="num">20</span> <span class="kw">OFFSET</span> <span class="num">500000</span>;

<span class="cmt">-- ✅ Rapide même avec 10M de lignes</span>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> events
<span class="kw">WHERE</span>  id <span class="op">&lt;</span> <span class="num">500020</span>  <span class="cmt">-- dernier id vu</span>
<span class="kw">ORDER BY</span> id <span class="kw">DESC</span>
<span class="kw">LIMIT</span>  <span class="num">20</span>;</pre>

  <h3>Keyset sur plusieurs colonnes</h3>
  <pre><span class="cmt">-- Tri sur (created_at DESC, id DESC)</span>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> articles
<span class="kw">WHERE</span> (created_at, id) <span class="op">&lt;</span> (<span class="str">'2024-03-15 12:00:00'</span>, <span class="num">4521</span>)
<span class="kw">ORDER BY</span> created_at <span class="kw">DESC</span>, id <span class="kw">DESC</span>
<span class="kw">LIMIT</span> <span class="num">20</span>;</pre>

  <div class="callout info">
    <span class="callout-icon">ℹ️</span>
    <p><strong>Index requis :</strong> Pour que cette méthode soit efficace, il faut un index composite <code>(created_at, id)</code>. Sans index, le moteur fait un full scan et les perfs sont aussi mauvaises qu'avec OFFSET.</p>
  </div>

  <div class="table-wrap">
    <table>
      <thead><tr><th>Critère</th><th>Offset/Limit</th><th>Cursor</th><th>Keyset</th></tr></thead>
      <tbody>
        <tr><td>Simplicité</td><td class="yes">★★★</td><td class="mid">★★</td><td class="mid">★★</td></tr>
        <tr><td>Performance (gros volumes)</td><td class="no">★</td><td class="yes">★★★</td><td class="yes">★★★</td></tr>
        <tr><td>Navigation aléatoire (page 50)</td><td class="yes">✓</td><td class="no">✗</td><td class="no">✗</td></tr>
        <tr><td>Stable si insertion concurrente</td><td class="no">✗</td><td class="yes">✓</td><td class="yes">✓</td></tr>
        <tr><td>Nécessite index</td><td class="no">Non</td><td class="mid">Optionnel</td><td class="yes">Obligatoire</td></tr>
      </tbody>
    </table>
  </div>
</section>

<div class="divider">· · ·</div>

<!-- ============================================================ -->
<!-- SECTION 5 : INTRO NOSQL -->
<!-- ============================================================ -->
<section class="section reveal" id="nosql-intro">
  <div class="section-label">Module 05</div>
  <h2>Introduction au NoSQL</h2>

  <p>Le terme <span class="highlight">NoSQL</span> (Not Only SQL) désigne une famille de bases de données qui abandonnent le modèle relationnel en faveur de modèles de données plus flexibles, conçus pour la scalabilité horizontale et les grands volumes.</p>

  <h3>Les 4 grandes familles</h3>
  <div class="card-grid">
    <div class="card">
      <div class="card-icon">📄</div>
      <div class="card-title">Document <span class="tag green">MongoDB</span></div>
      <div class="card-text">Données stockées en JSON/BSON. Structure flexible par document. Idéal pour les catalogues, profils, CMS.</div>
    </div>
    <div class="card">
      <div class="card-icon">🔑</div>
      <div class="card-title">Clé-Valeur <span class="tag amber">Redis</span></div>
      <div class="card-text">Accès ultra-rapide par clé. Structures de données riches. Cache, sessions, files de messages.</div>
    </div>
    <div class="card">
      <div class="card-icon">📊</div>
      <div class="card-title">Colonnes larges <span class="tag green">Cassandra</span></div>
      <div class="card-text">Lignes avec colonnes dynamiques. Excellente écriture. Séries temporelles, IoT, logs massifs.</div>
    </div>
    <div class="card">
      <div class="card-icon">🔗</div>
      <div class="card-title">Graphe <span class="tag red">Neo4j</span></div>
      <div class="card-text">Nœuds et arêtes. Traversée de relations complexes. Réseaux sociaux, recommandations, fraude.</div>
    </div>
  </div>

  <h3>SQL vs NoSQL — Quand choisir quoi ?</h3>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Aspect</th><th>SQL (relationnel)</th><th>NoSQL</th></tr></thead>
      <tbody>
        <tr><td>Schéma</td><td>Rigide, prédéfini</td><td class="yes">Flexible, dynamique</td></tr>
        <tr><td>Transactions ACID</td><td class="yes">Natif</td><td class="mid">Partiel (MongoDB 4+)</td></tr>
        <tr><td>Scalabilité</td><td class="mid">Verticale (scale-up)</td><td class="yes">Horizontale (scale-out)</td></tr>
        <tr><td>Jointures complexes</td><td class="yes">Natif</td><td class="no">Déconseillé</td></tr>
        <tr><td>Modélisation</td><td>Normalisée</td><td>Dénormalisée, orientée requête</td></tr>
        <tr><td>Schéma évolutif</td><td class="no">Migrations lourdes</td><td class="yes">Zero downtime</td></tr>
      </tbody>
    </table>
  </div>
</section>

<!-- ============================================================ -->
<!-- SECTION 6 : MONGODB -->
<!-- ============================================================ -->
<section class="section reveal" id="mongodb">
  <div class="section-label">Module 06</div>
  <h2>MongoDB — Base documentaire</h2>

  <p>MongoDB stocke les données en <span class="highlight">BSON</span> (Binary JSON) dans des collections de documents. Chaque document peut avoir une structure différente.</p>

  <h3>Concepts fondamentaux</h3>
  <div class="schema-box">
<span class="box">SQL</span>         <span class="arrow">←→</span>  <span class="box green">MongoDB</span>

Database     <span class="arrow">←→</span>  Database
Table        <span class="arrow">←→</span>  Collection
Row          <span class="arrow">←→</span>  Document (JSON/BSON)
Column       <span class="arrow">←→</span>  Field
PRIMARY KEY  <span class="arrow">←→</span>  _id (ObjectId auto-généré)
JOIN         <span class="arrow">←→</span>  Embedding / $lookup
INDEX        <span class="arrow">←→</span>  Index (createIndex)
  </div>

  <h3>CRUD de base</h3>
  <pre><span class="kw">from</span> pymongo <span class="kw">import</span> MongoClient
<span class="kw">from</span> bson.objectid <span class="kw">import</span> ObjectId

client <span class="op">=</span> MongoClient(<span class="str">'mongodb://localhost:27017/'</span>)
db     <span class="op">=</span> client[<span class="str">'myapp'</span>]
users  <span class="op">=</span> db[<span class="str">'users'</span>]

<span class="cmt"># CREATE</span>
result <span class="op">=</span> users.insert_one({
    <span class="str">'name'</span>:  <span class="str">'Arthur'</span>,
    <span class="str">'email'</span>: <span class="str">'arthur@holberton.io'</span>,
    <span class="str">'role'</span>:  <span class="str">'student'</span>,
    <span class="str">'skills'</span>: [<span class="str">'Python'</span>, <span class="str">'Flask'</span>, <span class="str">'MongoDB'</span>]
})
print(result.inserted_id)  <span class="cmt"># ObjectId('...')</span>

<span class="cmt"># READ — un document</span>
user <span class="op">=</span> users.find_one({<span class="str">'email'</span>: <span class="str">'arthur@holberton.io'</span>})

<span class="cmt"># READ — filtrer + projeter</span>
students <span class="op">=</span> users.find(
    {<span class="str">'role'</span>: <span class="str">'student'</span>},
    {<span class="str">'name'</span>: <span class="num">1</span>, <span class="str">'email'</span>: <span class="num">1</span>, <span class="str">'_id'</span>: <span class="num">0</span>}   <span class="cmt"># projection</span>
)

<span class="cmt"># UPDATE</span>
users.update_one(
    {<span class="str">'_id'</span>: ObjectId(<span class="str">'...'</span>)},
    {<span class="str">'$set'</span>: {<span class="str">'role'</span>: <span class="str">'senior'</span>}, <span class="str">'$push'</span>: {<span class="str">'skills'</span>: <span class="str">'Docker'</span>}}
)

<span class="cmt"># DELETE</span>
users.delete_one({<span class="str">'email'</span>: <span class="str">'test@example.com'</span>})</pre>

  <h3>Pagination dans MongoDB</h3>
  <pre><span class="cmt"># ❌ Offset classique (lent sur gros volumes)</span>
docs <span class="op">=</span> collection.find().skip(<span class="num">200</span>).limit(<span class="num">20</span>)

<span class="cmt"># ✅ Keyset — bien plus performant</span>
<span class="kw">from</span> bson.objectid <span class="kw">import</span> ObjectId

<span class="kw">def</span> <span class="fn">get_page</span>(last_id<span class="op">=</span><span class="kw">None</span>, limit<span class="op">=</span><span class="num">20</span>):
    query <span class="op">=</span> {}
    <span class="kw">if</span> last_id:
        query <span class="op">=</span> {<span class="str">'_id'</span>: {<span class="str">'$lt'</span>: ObjectId(last_id)}}
    
    docs <span class="op">=</span> list(
        collection
        .find(query)
        .sort(<span class="str">'_id'</span>, <span class="op">-</span><span class="num">1</span>)
        .limit(limit <span class="op">+</span> <span class="num">1</span>)
    )
    has_more <span class="op">=</span> len(docs) <span class="op">></span> limit
    docs     <span class="op">=</span> docs[:limit]
    next_id  <span class="op">=</span> <span class="fn">str</span>(docs[<span class="op">-</span><span class="num">1</span>][<span class="str">'_id'</span>]) <span class="kw">if</span> has_more <span class="kw">else</span> <span class="kw">None</span>
    <span class="kw">return</span> docs, next_id</pre>

  <h3>Agrégations et Pipeline</h3>
  <pre class="amber"><span class="cmt"># Exemple : top 5 villes par nombre d'utilisateurs</span>
pipeline <span class="op">=</span> [
    {<span class="str">'$group'</span>:   {<span class="str">'_id'</span>: <span class="str">'$city'</span>, <span class="str">'count'</span>: {<span class="str">'$sum'</span>: <span class="num">1</span>}}},
    {<span class="str">'$sort'</span>:    {<span class="str">'count'</span>: <span class="op">-</span><span class="num">1</span>}},
    {<span class="str">'$limit'</span>:   <span class="num">5</span>},
    {<span class="str">'$project'</span>: {<span class="str">'city'</span>: <span class="str">'$_id'</span>, <span class="str">'count'</span>: <span class="num">1</span>, <span class="str">'_id'</span>: <span class="num">0</span>}}
]
results <span class="op">=</span> list(db.users.aggregate(pipeline))</pre>

  <h3>Indexes</h3>
  <pre><span class="cmt"># Index simple</span>
db.users.create_index(<span class="str">'email'</span>, unique<span class="op">=</span><span class="kw">True</span>)

<span class="cmt"># Index composé</span>
db.articles.create_index([(<span class="str">'author_id'</span>, <span class="num">1</span>), (<span class="str">'created_at'</span>, <span class="op">-</span><span class="num">1</span>)])

<span class="cmt"># Index texte (recherche full-text)</span>
db.articles.create_index({<span class="str">'title'</span>: <span class="str">'text'</span>, <span class="str">'content'</span>: <span class="str">'text'</span>})

<span class="cmt"># Vérifier les indexes d'une collection</span>
db.articles.index_information()</pre>
</section>

<!-- ============================================================ -->
<!-- SECTION 7 : REDIS -->
<!-- ============================================================ -->
<section class="section reveal" id="redis">
  <div class="section-label">Module 07</div>
  <h2>Redis — Cache & Structures de données</h2>

  <p>Redis est une base <span class="highlight">en mémoire</span> (RAM), extrêmement rapide (~100k ops/sec). Elle excelle comme cache, gestionnaire de sessions, file de messages et compteur temps réel.</p>

  <h3>Types de données Redis</h3>
  <div class="card-grid">
    <div class="card">
      <div class="card-icon">📝</div>
      <div class="card-title">String</div>
      <div class="card-text">GET, SET, INCR, APPEND. Cache simple, compteurs, flags.</div>
    </div>
    <div class="card">
      <div class="card-icon">📋</div>
      <div class="card-title">List</div>
      <div class="card-text">LPUSH, RPUSH, LRANGE. Files FIFO/LIFO, historique, queues.</div>
    </div>
    <div class="card">
      <div class="card-icon">🗂️</div>
      <div class="card-title">Hash</div>
      <div class="card-text">HSET, HGET, HMGET. Sessions utilisateur, objets légers.</div>
    </div>
    <div class="card">
      <div class="card-icon">🏆</div>
      <div class="card-title">Sorted Set</div>
      <div class="card-text">ZADD, ZRANGE, ZRANK. Leaderboards, top-N, pagination rapide.</div>
    </div>
  </div>

  <h3>Connexion et opérations de base</h3>
  <pre><span class="kw">import</span> redis

r <span class="op">=</span> redis.Redis(host<span class="op">=</span><span class="str">'localhost'</span>, port<span class="op">=</span><span class="num">6379</span>, db<span class="op">=</span><span class="num">0</span>, decode_responses<span class="op">=</span><span class="kw">True</span>)

<span class="cmt"># String avec TTL (expiration)</span>
r.set(<span class="str">'session:abc123'</span>, <span class="str">'user_id:42'</span>, ex<span class="op">=</span><span class="num">3600</span>)  <span class="cmt"># expire en 1h</span>
value <span class="op">=</span> r.get(<span class="str">'session:abc123'</span>)

<span class="cmt"># Hash — stocker un objet</span>
r.hset(<span class="str">'user:42'</span>, mapping<span class="op">=</span>{
    <span class="str">'name'</span>:  <span class="str">'Arthur'</span>,
    <span class="str">'email'</span>: <span class="str">'arthur@holberton.io'</span>,
    <span class="str">'role'</span>:  <span class="str">'student'</span>
})
user <span class="op">=</span> r.hgetall(<span class="str">'user:42'</span>)

<span class="cmt"># Compteur atomique</span>
r.incr(<span class="str">'page_views:article:55'</span>)
views <span class="op">=</span> r.get(<span class="str">'page_views:article:55'</span>)

<span class="cmt"># List — file de tâches</span>
r.lpush(<span class="str">'job_queue'</span>, <span class="str">'send_email:user:10'</span>)
job <span class="op">=</span> r.brpop(<span class="str">'job_queue'</span>, timeout<span class="op">=</span><span class="num">5</span>)</pre>

  <h3>Caching avec décorateur Python</h3>
  <pre class="purple"><span class="kw">import</span> json, functools

<span class="kw">def</span> <span class="fn">cache</span>(ttl<span class="op">=</span><span class="num">300</span>):
    <span class="str">"""Décorateur de cache Redis générique."""</span>
    <span class="kw">def</span> <span class="fn">decorator</span>(func):
        <span class="fn">@functools.wraps</span>(func)
        <span class="kw">def</span> <span class="fn">wrapper</span>(<span class="op">*</span>args, <span class="op">**</span>kwargs):
            key   <span class="op">=</span> <span class="str">f"cache:{func.__name__}:{args}:{kwargs}"</span>
            cached <span class="op">=</span> r.get(key)
            <span class="kw">if</span> cached:
                <span class="kw">return</span> json.loads(cached)
            result <span class="op">=</span> func(<span class="op">*</span>args, <span class="op">**</span>kwargs)
            r.setex(key, ttl, json.dumps(result))
            <span class="kw">return</span> result
        <span class="kw">return</span> wrapper
    <span class="kw">return</span> decorator

<span class="fn">@cache</span>(ttl<span class="op">=</span><span class="num">60</span>)
<span class="kw">def</span> <span class="fn">get_top_articles</span>(category):
    <span class="cmt"># requête DB coûteuse</span>
    <span class="kw">return</span> db.query(...)</pre>

  <h3>Pagination avec Sorted Sets (Leaderboard)</h3>
  <pre class="blue"><span class="cmt"># Ajouter des scores</span>
r.zadd(<span class="str">'leaderboard'</span>, {<span class="str">'arthur'</span>: <span class="num">1500</span>, <span class="str">'bob'</span>: <span class="num">1200</span>, <span class="str">'carol'</span>: <span class="num">1800</span>})

<span class="cmt"># Page 1 : top 10 (index 0 à 9, ordre décroissant)</span>
top10 <span class="op">=</span> r.zrevrange(<span class="str">'leaderboard'</span>, <span class="num">0</span>, <span class="num">9</span>, withscores<span class="op">=</span><span class="kw">True</span>)

<span class="cmt"># Page 2 : positions 10 à 19</span>
page2 <span class="op">=</span> r.zrevrange(<span class="str">'leaderboard'</span>, <span class="num">10</span>, <span class="num">19</span>, withscores<span class="op">=</span><span class="kw">True</span>)

<span class="cmt"># Rang d'un joueur</span>
rank <span class="op">=</span> r.zrevrank(<span class="str">'leaderboard'</span>, <span class="str">'arthur'</span>)  <span class="cmt"># → 1 (0-indexed)</span>
score <span class="op">=</span> r.zscore(<span class="str">'leaderboard'</span>, <span class="str">'arthur'</span>)  <span class="cmt"># → 1500.0</span></pre>
</section>

<!-- ============================================================ -->
<!-- SECTION 8 : ELASTICSEARCH -->
<!-- ============================================================ -->
<section class="section reveal" id="elasticsearch">
  <div class="section-label">Module 08</div>
  <h2>Elasticsearch — Recherche full-text</h2>

  <p>Elasticsearch (ES) est un moteur de recherche et d'analyse basé sur <span class="highlight">Apache Lucene</span>. Il excelle pour la recherche full-text, les agrégations analytiques, et la pagination dans des corpus de millions de documents.</p>

  <h3>Concepts clés</h3>
  <div class="schema-box">
<span class="box">SQL</span>         <span class="arrow">←→</span>  <span class="box green">Elasticsearch</span>

Database     <span class="arrow">←→</span>  Cluster
Table        <span class="arrow">←→</span>  Index
Row          <span class="arrow">←→</span>  Document (JSON)
Column       <span class="arrow">←→</span>  Field
Schema       <span class="arrow">←→</span>  Mapping
SELECT       <span class="arrow">←→</span>  Search Query (DSL)
EXPLAIN      <span class="arrow">←→</span>  _explain API
  </div>

  <h3>Indexer et rechercher</h3>
  <pre><span class="kw">from</span> elasticsearch <span class="kw">import</span> Elasticsearch

es <span class="op">=</span> Elasticsearch([<span class="str">'http://localhost:9200'</span>])

<span class="cmt"># Indexer un document</span>
es.index(index<span class="op">=</span><span class="str">'articles'</span>, id<span class="op">=</span><span class="num">1</span>, document<span class="op">=</span>{
    <span class="str">'title'</span>:   <span class="str">'Introduction à Flask'</span>,
    <span class="str">'content'</span>: <span class="str">'Flask est un microframework Python...'</span>,
    <span class="str">'tags'</span>:    [<span class="str">'python'</span>, <span class="str">'flask'</span>, <span class="str">'web'</span>],
    <span class="str">'views'</span>:   <span class="num">1542</span>
})

<span class="cmt"># Recherche full-text</span>
results <span class="op">=</span> es.search(index<span class="op">=</span><span class="str">'articles'</span>, body<span class="op">=</span>{
    <span class="str">'query'</span>: {
        <span class="str">'multi_match'</span>: {
            <span class="str">'query'</span>:  <span class="str">'flask python'</span>,
            <span class="str">'fields'</span>: [<span class="str">'title^2'</span>, <span class="str">'content'</span>]  <span class="cmt"># title boosté ×2</span>
        }
    }
})</pre>

  <h3>Pagination dans Elasticsearch</h3>
  <pre class="amber"><span class="cmt"># ✅ From/Size (équivalent offset, limité à 10 000)</span>
es.search(index<span class="op">=</span><span class="str">'articles'</span>, body<span class="op">=</span>{
    <span class="str">'query'</span>: {<span class="str">'match_all'</span>: {}},
    <span class="str">'from'</span>:  <span class="num">40</span>,    <span class="cmt"># offset</span>
    <span class="str">'size'</span>:  <span class="num">20</span>,    <span class="cmt"># limit</span>
    <span class="str">'sort'</span>:  [{<span class="str">'created_at'</span>: <span class="str">'desc'</span>}]
})

<span class="cmt"># ✅ Search After (keyset — pour grands volumes)</span>
<span class="cmt"># 1ère page</span>
r1 <span class="op">=</span> es.search(index<span class="op">=</span><span class="str">'articles'</span>, body<span class="op">=</span>{
    <span class="str">'size'</span>: <span class="num">20</span>,
    <span class="str">'sort'</span>: [{<span class="str">'created_at'</span>: <span class="str">'desc'</span>}, {<span class="str">'_id'</span>: <span class="str">'asc'</span>}]
})
last_sort <span class="op">=</span> r1[<span class="str">'hits'</span>][<span class="str">'hits'</span>][<span class="op">-</span><span class="num">1</span>][<span class="str">'sort'</span>]

<span class="cmt"># 2ème page</span>
r2 <span class="op">=</span> es.search(index<span class="op">=</span><span class="str">'articles'</span>, body<span class="op">=</span>{
    <span class="str">'size'</span>:        <span class="num">20</span>,
    <span class="str">'sort'</span>:        [{<span class="str">'created_at'</span>: <span class="str">'desc'</span>}, {<span class="str">'_id'</span>: <span class="str">'asc'</span>}],
    <span class="str">'search_after'</span>: last_sort
})</pre>
</section>

<!-- ============================================================ -->
<!-- SECTION 9 : PYTHON + FLASK -->
<!-- ============================================================ -->
<section class="section reveal" id="python">
  <div class="section-label">Module 09</div>
  <h2>Intégration Python / Flask complète</h2>

  <p>Combinons tout ce qu'on a vu dans une <span class="highlight">API REST Flask</span> avec pagination, cache Redis et stockage MongoDB.</p>

  <h3>Architecture</h3>
  <div class="schema-box">
<span class="box amber">Client HTTP</span>
      <span class="arrow">↓</span>
<span class="box">Flask Route</span>  → parse params (page, cursor, limit)
      <span class="arrow">↓</span>
<span class="box">Redis Cache</span>  → HIT ? → retourner immédiatement
      <span class="arrow">↓ MISS</span>
<span class="box green">MongoDB</span>     → find() + keyset + index
      <span class="arrow">↓</span>
<span class="box">Redis</span>        → stocker résultat (TTL 60s)
      <span class="arrow">↓</span>
<span class="box amber">Response JSON</span>
  </div>

  <h3>Code complet</h3>
  <pre><span class="kw">from</span> flask <span class="kw">import</span> Flask, request, jsonify
<span class="kw">from</span> pymongo <span class="kw">import</span> MongoClient, DESCENDING
<span class="kw">from</span> bson.objectid <span class="kw">import</span> ObjectId
<span class="kw">import</span> redis, json

app    <span class="op">=</span> Flask(__name__)
mongo  <span class="op">=</span> MongoClient(<span class="str">'mongodb://localhost:27017/'</span>)
db     <span class="op">=</span> mongo[<span class="str">'blog'</span>]
cache  <span class="op">=</span> redis.Redis(decode_responses<span class="op">=</span><span class="kw">True</span>)

<span class="fn">@app.route</span>(<span class="str">'/api/articles'</span>)
<span class="kw">def</span> <span class="fn">get_articles</span>():
    limit     <span class="op">=</span> min(request.args.get(<span class="str">'limit'</span>,  <span class="num">20</span>, type<span class="op">=</span><span class="fn">int</span>), <span class="num">100</span>)
    after_id  <span class="op">=</span> request.args.get(<span class="str">'after_id'</span>)
    category  <span class="op">=</span> request.args.get(<span class="str">'category'</span>, <span class="str">''</span>)

    <span class="cmt"># Clé de cache</span>
    cache_key <span class="op">=</span> <span class="str">f"articles:{category}:{after_id}:{limit}"</span>
    cached    <span class="op">=</span> cache.get(cache_key)
    <span class="kw">if</span> cached:
        <span class="kw">return</span> jsonify(json.loads(cached))

    <span class="cmt"># Requête MongoDB</span>
    query <span class="op">=</span> {}
    <span class="kw">if</span> category:
        query[<span class="str">'category'</span>] <span class="op">=</span> category
    <span class="kw">if</span> after_id:
        query[<span class="str">'_id'</span>] <span class="op">=</span> {<span class="str">'$lt'</span>: ObjectId(after_id)}

    docs <span class="op">=</span> list(
        db.articles
        .find(query, {<span class="str">'_id'</span>: <span class="num">1</span>, <span class="str">'title'</span>: <span class="num">1</span>, <span class="str">'category'</span>: <span class="num">1</span>, <span class="str">'created_at'</span>: <span class="num">1</span>})
        .sort(<span class="str">'_id'</span>, DESCENDING)
        .limit(limit <span class="op">+</span> <span class="num">1</span>)
    )

    has_more <span class="op">=</span> len(docs) <span class="op">></span> limit
    docs     <span class="op">=</span> docs[:limit]

    <span class="kw">for</span> d <span class="kw">in</span> docs:
        d[<span class="str">'id'</span>] <span class="op">=</span> <span class="fn">str</span>(d.pop(<span class="str">'_id'</span>))

    payload <span class="op">=</span> {
        <span class="str">'data'</span>:     docs,
        <span class="str">'has_more'</span>: has_more,
        <span class="str">'next_after_id'</span>: docs[<span class="op">-</span><span class="num">1</span>][<span class="str">'id'</span>] <span class="kw">if</span> has_more <span class="kw">else</span> <span class="kw">None</span>
    }

    <span class="cmt"># Mettre en cache 60 secondes</span>
    cache.setex(cache_key, <span class="num">60</span>, json.dumps(payload, default<span class="op">=</span><span class="fn">str</span>))

    <span class="kw">return</span> jsonify(payload)

<span class="kw">if</span> __name__ <span class="op">==</span> <span class="str">'__main__'</span>:
    app.run(debug<span class="op">=</span><span class="kw">True</span>)</pre>
</section>

<!-- ============================================================ -->
<!-- SECTION 10 : PERFORMANCE -->
<!-- ============================================================ -->
<section class="section reveal" id="perf">
  <div class="section-label">Module 10</div>
  <h2>Performance & Bonnes pratiques</h2>

  <h3>Règles d'or de la pagination</h3>
  <ol class="steps">
    <li>Toujours avoir un <strong>ORDER BY</strong> explicite — sans tri, les résultats sont non-déterministes.</li>
    <li>Indexer les colonnes de tri ET de filtre — sans index, tout est lent.</li>
    <li>Limiter la taille max de page côté serveur (<code>min(limit, 100)</code>) — protège des abus.</li>
    <li>Utiliser le <strong>keyset ou cursor</strong> dès que les tables dépassent 100k lignes.</li>
    <li>Mettre en cache les premières pages avec Redis — ce sont les plus consultées.</li>
    <li>Inclure <code>has_more</code> dans la réponse — évite une requête de count inutile.</li>
    <li>Ne jamais faire <code>SELECT COUNT(*)</code> à chaque page sur des tables énormes.</li>
  </ol>

  <h3>Règles d'or du NoSQL</h3>
  <ol class="steps">
    <li>Modéliser selon les <strong>requêtes</strong>, pas selon les entités — NoSQL est orienté requête.</li>
    <li>Dénormaliser intelligemment — dupliquer de la donnée est acceptable si ça évite un lookup.</li>
    <li>Utiliser les <strong>TTL Redis</strong> — toujours définir une expiration sur les caches.</li>
    <li>Éviter les jointures MongoDB (<code>$lookup</code>) en production à haute fréquence.</li>
    <li>Monitorer avec <code>explain()</code> en MongoDB et <code>profile</code> en Redis.</li>
    <li>Ne pas stocker en Redis ce qui doit être persistant sans <strong>AOF/RDB</strong> activé.</li>
  </ol>

  <h3>Checklist de production</h3>
  <div class="callout tip">
    <span class="callout-icon">✅</span>
    <p><strong>Index créés</strong> sur toutes les colonnes de pagination · <strong>TTL défini</strong> sur tous les caches Redis · <strong>Taille max page</strong> forcée côté serveur · <strong>Monitoring</strong> des slow queries · <strong>Tests de charge</strong> avec la 1000ème page · <strong>Invalidation cache</strong> sur mutation (POST/PUT/DELETE).</p>
  </div>

  <div class="callout warn">
    <span class="callout-icon">⚡</span>
    <p><strong>Piège courant :</strong> Calculer <code>total_pages</code> à chaque requête via <code>COUNT(*)</code> est très coûteux. Préférer un compteur Redis mis à jour à chaque insert/delete, ou utiliser les statistiques du moteur (approximatives mais instantanées).</p>
  </div>

  <h3>Récapitulatif visuel</h3>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Besoin</th><th>Solution recommandée</th><th>Pourquoi</th></tr></thead>
      <tbody>
        <tr><td>API REST standard</td><td>Cursor-based</td><td>Stable, API-friendly, scalable</td></tr>
        <tr><td>Interface admin paginée</td><td>Offset/Limit</td><td>Navigation libre, petites tables</td></tr>
        <tr><td>Feed temps réel (Twitter-like)</td><td>Keyset sur ID/date</td><td>Performances constantes</td></tr>
        <tr><td>Recherche full-text</td><td>ES search_after</td><td>Dépasse la limite 10k d'ES</td></tr>
        <tr><td>Leaderboard/Classement</td><td>Redis Sorted Set</td><td>O(log N), sans requête SQL</td></tr>
        <tr><td>Cache de résultats paginés</td><td>Redis + TTL court</td><td>Économie de requêtes DB</td></tr>
      </tbody>
    </table>
  </div>
</section>

<footer>
  <p>Cours réalisé par <span>MWA</span> · Pagination &amp; NoSQL · Holberton School 2026</p>
</footer>

<script>
  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
</script>
</body>
</html>