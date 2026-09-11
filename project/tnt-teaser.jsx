/* TNT teaser — 9:16, 10s, typography + logo only, pure black & white. */
const W = 1080, H = 1920;

const MOTION = {
  enter: (o) => animate({ ease: Easing.easeOutExpo, ...o }),
  draw: (o) => animate({ ease: Easing.easeInOutQuart, ...o }),
  pop: (o) => animate({ ease: Easing.easeOutBack, ...o }),
};

const FONT = 'Archivo, system-ui, sans-serif';

function Piece({ t }) {
  const { T, CUES, authoredTotal } = useComposition();
  const ink = t.invert ? '#000' : '#fff';
  const paper = t.invert ? '#fff' : '#000';
  const name = (t.playerName || 'TON NOM').toUpperCase();
  const number = String(t.playerNumber ?? 10);

  // one camera for the whole piece
  const camScale = interpolate(
    [0, CUES.Nom, CUES.Prix, CUES.Signature, authoredTotal],
    [1.06, 1.0, 1.03, 1.0, 1.05],
    Easing.easeInOutSine
  )(T);

  // the logo persists across every section
  const logoScale = interpolate(
    [0, 0.9, 2.0, 2.6, CUES.Signature - 0.2, CUES.Signature + 0.9],
    [1.7, 1.0, 1.0, 0.34, 0.34, 0.92],
    Easing.easeInOutCubic
  )(T);
  const logoY = interpolate(
    [0, 2.0, 2.6, CUES.Signature - 0.2, CUES.Signature + 0.9],
    [0, 0, -640, -640, -170],
    Easing.easeInOutCubic
  )(T);
  const logoOpacity = interpolate(
    [0, 0.55, authoredTotal - 0.55, authoredTotal - 0.05],
    [0, 1, 1, 0],
    Easing.easeInOutSine
  )(T);
  const logoInk = interpolate([CUES.Nom - 0.1, CUES.Nom + 0.25, CUES.Prix - 0.1, CUES.Prix + 0.25], [0, 1, 1, 0], Easing.linear)(T);

  // white panel that owns the "name" section
  const panel = interpolate(
    [CUES.Nom - 0.35, CUES.Nom + 0.35, CUES.Prix - 0.35, CUES.Prix + 0.15],
    [0, 100, 100, 0],
    Easing.easeInOutQuart
  )(T);

  const kickerRise = MOTION.enter({ from: 90, to: 0, start: 1.05, end: 1.9 })(T);
  const kickerFade = interpolate([1.05, 1.5, 2.15, 2.45], [0, 1, 1, 0], Easing.linear)(T);
  const rule = MOTION.draw({ from: 0, to: 1, start: 0.85, end: 1.6 })(T);

  const nameChars = Math.round(MOTION.draw({ from: 0, to: name.length, start: CUES.Nom + 0.25, end: CUES.Nom + 1.15 })(T));
  const numPop = MOTION.pop({ from: 0.55, to: 1, start: CUES.Nom + 0.95, end: CUES.Nom + 1.6 })(T);
  const numFade = interpolate([CUES.Nom + 0.95, CUES.Nom + 1.25], [0, 1], Easing.linear)(T);
  const flockRise = MOTION.enter({ from: 40, to: 0, start: CUES.Nom + 1.5, end: CUES.Nom + 2.1 })(T);
  const flockFade = interpolate([CUES.Nom + 1.5, CUES.Nom + 1.9], [0, 1], Easing.linear)(T);

  const priceScale = MOTION.pop({ from: 1.35, to: 1, start: CUES.Prix - 0.25, end: CUES.Prix + 0.6 })(T);
  const priceFade = interpolate([CUES.Prix - 0.3, CUES.Prix - 0.05], [0, 1], Easing.linear)(T);
  const priceRule = MOTION.draw({ from: 0, to: 1, start: CUES.Prix + 0.5, end: CUES.Prix + 1.2 })(T);
  const priceSubRise = MOTION.enter({ from: 60, to: 0, start: CUES.Prix + 1.0, end: CUES.Prix + 1.7 })(T);
  const priceSubFade = interpolate([CUES.Prix + 1.0, CUES.Prix + 1.4], [0, 1], Easing.linear)(T);

  const wordSpread = MOTION.enter({ from: 0.5, to: 0.22, start: CUES.Signature + 0.35, end: CUES.Signature + 1.6 })(T);
  const wordFade = interpolate([CUES.Signature + 0.35, CUES.Signature + 0.9, authoredTotal - 0.3, authoredTotal - 0.02], [0, 1, 1, 0], Easing.linear)(T);
  const ctaRise = MOTION.enter({ from: 50, to: 0, start: CUES.Signature + 1.0, end: CUES.Signature + 1.8 })(T);
  const ctaFade = interpolate([CUES.Signature + 1.0, CUES.Signature + 1.45, authoredTotal - 0.25, authoredTotal - 0.02], [0, 1, 1, 0], Easing.linear)(T);
  const marquee = -((T * 150) % 900);

  return (
    <div style={{ position: 'absolute', inset: 0, background: paper, overflow: 'hidden', fontFamily: FONT }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${camScale})`, transformOrigin: '50% 50%' }}>

        {/* white panel behind the name section */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: H,
          background: ink, clipPath: `inset(${100 - panel}% 0 0 0)`,
        }} />

        {/* section 1 — ignition */}
        <Shot from={0} to={CUES.Nom + 0.4}>
          <div style={{
            position: 'absolute', left: 120, right: 120, top: H / 2 + 190,
            height: 3, background: ink, transform: `scaleX(${rule})`, transformOrigin: '0 50%',
          }} />
        </Shot>

        {/* section 2 — name and number */}
        <Shot from={CUES.Nom - 0.1} to={CUES.Prix + 0.2}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 620, textAlign: 'center',
            color: paper, fontSize: 78, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>{name.slice(0, nameChars)}</div>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 730, textAlign: 'center',
            color: paper, fontSize: 470, lineHeight: 0.9, fontWeight: 900, fontStretch: '84%',
            transform: `scale(${numPop})`, opacity: numFade,
          }}>{number}</div>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 1320, textAlign: 'center',
            color: paper, fontSize: 38, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase',
            transform: `translateY(${flockRise}px)`, opacity: flockFade,
          }}>Ton nom dans le dos</div>
        </Shot>

        {/* section 3 — price */}
        <Shot from={CUES.Prix - 0.1} to={CUES.Signature + 0.5}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center',
            color: ink, fontSize: 340, lineHeight: 0.86, fontWeight: 900, fontStretch: '112%', letterSpacing: '-0.03em',
            transform: `scale(${priceScale})`, opacity: priceFade,
          }}>{t.price || '35 €'}</div>
          <div style={{
            position: 'absolute', left: 200, right: 200, top: 1090, height: 4, background: ink,
            transform: `scaleX(${priceRule})`, transformOrigin: '50% 50%',
          }} />
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 1160, textAlign: 'center',
            color: ink, fontSize: 44, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase',
            transform: `translateY(${priceSubRise}px)`, opacity: priceSubFade,
          }}>{t.priceSub || 'Flocage 5 €'}</div>
        </Shot>

        {/* the logo, always mounted */}
        <img src="assets/tnt-logo.png" alt="" style={{
          position: 'absolute', left: '50%', top: '50%', width: 620,
          transform: `translate(-50%, calc(-50% + ${logoY}px)) scale(${logoScale})`,
          opacity: logoOpacity,
          filter: logoInk > 0.01 ? `invert(${logoInk})` : 'none',
        }} />

        {/* section 4 — signature */}
        <Shot from={CUES.Signature} to={authoredTotal}>
          <div style={{
            position: 'absolute', left: 60, right: 60, top: H / 2 + 60, textAlign: 'center',
            color: ink, fontSize: 42, fontWeight: 800, letterSpacing: `${wordSpread}em`,
            textTransform: 'uppercase', opacity: wordFade, whiteSpace: 'nowrap',
          }}>Torrow Nam Torrow</div>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: H / 2 + 260, display: 'flex', justifyContent: 'center',
            transform: `translateY(${ctaRise}px)`, opacity: ctaFade,
          }}>
            <div style={{
              background: ink, color: paper, fontSize: 42, fontWeight: 900,
              letterSpacing: '0.18em', textTransform: 'uppercase', padding: '30px 56px',
            }}>{t.cta || 'TNT-STORE.FR'}</div>
          </div>
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 120, overflow: 'hidden', opacity: ctaFade,
            borderTop: `2px solid ${ink}`, borderBottom: `2px solid ${ink}`, padding: '18px 0',
          }}>
            <div style={{
              display: 'flex', gap: 60, width: 'max-content', transform: `translateX(${marquee}px)`,
              color: ink, fontSize: 34, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i}>Maillot 35 € / Flocage 5 € / France 48h / Mayotte 15 à 20 jours</span>
              ))}
            </div>
          </div>
        </Shot>
      </div>
    </div>
  );
}

function TntTeaser() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || {});
  return (
    <React.Fragment>
      <CompositionStage
        width={W}
        height={H}
        bg={t.invert ? '#fff' : '#000'}
        scenes={window.OM_SCENES}
        playback={window.OM_PLAYBACK}
      >
        <Piece t={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Contenu" />
        <TweakText label="Nom floqué" value={t.playerName} onChange={(v) => setTweak('playerName', v)} />
        <TweakNumber label="Numéro" value={t.playerNumber} min={1} max={99} onChange={(v) => setTweak('playerNumber', v)} />
        <TweakText label="Prix" value={t.price} onChange={(v) => setTweak('price', v)} />
        <TweakText label="Appel à l'action" value={t.cta} onChange={(v) => setTweak('cta', v)} />
        <TweakSection label="Rendu" />
        <TweakToggle label="Inverser (fond blanc)" value={t.invert} onChange={(v) => setTweak('invert', v)} />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

window.TntTeaser = TntTeaser;
