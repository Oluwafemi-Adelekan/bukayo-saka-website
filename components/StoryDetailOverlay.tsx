'use client'

import Image from 'next/image'
import GrainOverlay from './GrainOverlay'

type TextPanel = {
  type: 'text'
  heading?: string
  body: string
  desktopWidth?: string
  desktopMinWidth?: number
}

type ImagePanel = {
  type: 'image'
  src: string
  alt: string
  variant: 'half' | 'card' | 'wide'
  position?: string
  aspectRatio?: string
  ratio?: number
  desktopWidth?: string
  desktopMinWidth?: number
}

type VideoPanel = {
  type: 'video'
  src?: string
  embedSrc?: string
  poster?: string
  label?: string
  variant: 'card' | 'wide'
  aspectRatio?: string
  ratio?: number
  desktopWidth?: string
  desktopMinWidth?: number
}

export type StoryDetail = {
  id: string
  title: string[]
  intro: string
  heroImage: {
    src: string
    alt: string
    position?: string
  }
  panels: Array<TextPanel | ImagePanel | VideoPanel>
}

function CloseLink() {
  return (
    <a
      href="#story"
      aria-label="Close overlay"
      className="absolute right-4 top-4 md:right-6 md:top-6"
      style={{
        zIndex: 70,
        color: 'rgba(255,255,255,0.55)',
        background: 'rgba(0,0,0,0.18)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        width: 40,
        height: 40,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    </a>
  )
}

function ScrollPrompt() {
  return (
    <div className="flex items-center gap-3" style={{ fontFamily: 'Mona Sans, sans-serif' }}>
      <span className="story-overlay-scroll-line" aria-hidden="true" />
      <span
        style={{
          color: '#ffffff',
          fontSize: '0.72rem',
          lineHeight: 1,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          fontWeight: 500,
        }}
      >
        Scroll to Explore
      </span>
    </div>
  )
}

function TitleLine({ text, index }: { text: string; index: number }) {
  return (
    <span
      className="story-overlay-title-line"
      style={{
        display: 'block',
        fontFamily: index === 0 ? 'Kegilka, serif' : 'Mona Sans, sans-serif',
        fontWeight: index === 0 ? 400 : 300,
      }}
    >
      {Array.from(text).map((letter, letterIndex) => (
        <span
          key={`${text}-${letterIndex}`}
          className="story-overlay-letter"
          style={{
            transitionDelay: `${0.08 + index * 0.1 + letterIndex * 0.035}s`,
            width: letter === ' ' ? '0.28em' : undefined,
          }}
        >
          {letter === ' ' ? '\u00a0' : letter}
        </span>
      ))}
    </span>
  )
}

function DesktopPanel({ panel }: { panel: TextPanel | ImagePanel | VideoPanel }) {
  if (panel.type === 'text') {
    return (
      <article
        data-story-overlay-panel
        className="story-overlay-panel shrink-0"
        style={{
          width: panel.desktopWidth ?? '34vw',
          minWidth: panel.desktopMinWidth ?? 440,
          height: '100svh',
          padding: '24px 48px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: panel.heading ? 24 : 0,
          alignItems: 'flex-start',
          background: '#050505',
        }}
      >
        {panel.heading ? (
          <h2
            style={{
              fontFamily: 'Kegilka, serif',
              fontSize: 'clamp(2.4rem, 4.8vw, 5.2rem)',
              lineHeight: 0.92,
              fontWeight: 400,
              color: '#ffffff',
              margin: 0,
            }}
          >
            {panel.heading}
          </h2>
        ) : null}
        <p
          style={{
            fontFamily: 'Mona Sans, sans-serif',
            fontSize: 'var(--body-text-size)',
            lineHeight: 'var(--body-line-height)',
            color: 'rgba(255,255,255,0.9)',
            margin: 0,
            maxWidth: 580,
          }}
        >
          {panel.body}
        </p>
      </article>
    )
  }

  const isCard = panel.variant === 'card'
  const cardRatio = panel.ratio ?? (panel.type === 'video' ? 16 / 9 : 2356 / 2768)
  const cardHeight = '70svh'
  const width = panel.desktopWidth ?? (
    isCard ? `calc(${cardHeight} * ${cardRatio} + 56px)` : panel.variant === 'wide' ? '50vw' : '50vw'
  )
  const minWidth = panel.desktopMinWidth ?? (isCard ? 0 : 720)
  const padding = isCard ? '24px 28px 48px' : '0 0 0 28px'

  return (
    <div
      data-story-overlay-panel
      className="story-overlay-panel shrink-0"
      style={{
        width,
        minWidth,
        height: '100svh',
        padding,
        display: isCard ? 'flex' : 'block',
        alignItems: isCard ? 'flex-start' : undefined,
        justifyContent: isCard ? 'center' : undefined,
        background: '#050505',
      }}
    >
      <div
        className="relative overflow-hidden"
        style={
          isCard
            ? {
                height: cardHeight,
                width: `min(100%, calc(${cardHeight} * ${cardRatio}))`,
                aspectRatio: panel.aspectRatio ?? '2356 / 2768',
              }
            : {
                height: '100%',
                width: '100%',
              }
        }
      >
        {panel.type === 'video' ? (
          panel.embedSrc ? (
            <iframe
              src={panel.embedSrc}
              title={panel.label ?? 'Story video'}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-full w-full"
              style={{ border: 0, display: 'block' }}
            />
          ) : panel.src ? (
            <video
              src={panel.src}
              poster={panel.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'linear-gradient(135deg, rgba(122,28,25,0.42), rgba(5,5,5,0.88))',
                color: 'rgba(255,255,255,0.72)',
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {panel.label ?? 'Video Placeholder'}
            </div>
          )
        ) : (
          <Image
            src={panel.src}
            alt={panel.alt}
            fill
            unoptimized={true}
            sizes={panel.variant === 'card' ? '70vh' : '50vw'}
            style={{
              objectFit: 'cover',
              objectPosition: panel.position || 'center',
            }}
          />
        )}
      </div>
    </div>
  )
}

export default function StoryDetailOverlay({ detail }: { detail: StoryDetail }) {
  return (
    <div
      id={`story-${detail.id}`}
      data-story-overlay
      className="story-detail-overlay fixed inset-0 z-[300] bg-[#050505]"
      style={{
        overflow: 'hidden',
        display: 'none',
        opacity: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
        transform: 'translate3d(0,28px,0)',
        transition:
          'opacity 0.52s cubic-bezier(0.16, 1, 0.3, 1), transform 0.52s cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear 0.52s',
      }}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (() => {
              if (window.__storyDetailOverlayInit) return;
              window.__storyDetailOverlayInit = true;

              const overlays = () => Array.from(document.querySelectorAll('[data-story-overlay]'));

              const replayIntro = (overlay) => {
                if (overlay.__storyIntroFrame) window.cancelAnimationFrame(overlay.__storyIntroFrame);
                overlay.dataset.storyReset = 'true';
                overlay.dataset.storyIntro = 'false';
                void overlay.offsetHeight;
                overlay.__storyIntroFrame = window.requestAnimationFrame(() => {
                  overlay.dataset.storyReset = 'false';
                  overlay.dataset.storyIntro = 'true';
                });
              };

              const measure = (overlay) => {
                const scroll = overlay.querySelector('[data-story-overlay-scroll-desktop]');
                const track = overlay.querySelector('[data-story-overlay-track]');
                const spacer = overlay.querySelector('[data-story-overlay-spacer]');
                if (!scroll || !track || !spacer) return;

                const maxX = Math.max(0, track.scrollWidth - window.innerWidth);
                spacer.style.height = Math.max(window.innerHeight * 3.2, maxX + window.innerHeight) + 'px';
                overlay.__storyMaxX = maxX;
                update(overlay);
              };

              const update = (overlay) => {
                const scroll = overlay.querySelector('[data-story-overlay-scroll-desktop]');
                const track = overlay.querySelector('[data-story-overlay-track]');
                if (!scroll || !track) return;

                const maxScroll = Math.max(1, scroll.scrollHeight - scroll.clientHeight);
                const progress = Math.max(0, Math.min(1, scroll.scrollTop / maxScroll));
                const x = -progress * (overlay.__storyMaxX || 0);
                track.style.transform = 'translate3d(' + x + 'px, 0, 0)';

                const panels = Array.from(overlay.querySelectorAll('[data-story-overlay-panel]'));
                const atStart = scroll.scrollTop < 4;
                if (atStart && !overlay.__storyAtStart) {
                  panels.forEach((panel) => {
                    panel.dataset.inView = 'false';
                  });
                  if (overlay.dataset.storyOpen === 'true') replayIntro(overlay);
                }
                overlay.__storyAtStart = atStart;

                panels.forEach((panel) => {
                  const rect = panel.getBoundingClientRect();
                  const visible = rect.right > window.innerWidth * 0.18 && rect.left < window.innerWidth * 0.88;
                  if (visible) panel.dataset.inView = 'true';
                });
              };

              const sync = () => {
                const active = document.querySelector(window.location.hash || '__none__');
                const isOpen = !!active && active.matches('[data-story-overlay]');
                
                overlays().forEach((overlay) => {
                  const open = overlay === active;
                  window.clearTimeout(overlay.__storyHideTimer);
                  overlay.dataset.storyOpen = open ? 'true' : 'false';

                  if (open) {
                    overlay.dataset.storyIntro = 'false';
                    overlay.style.display = 'block';
                    overlay.style.visibility = 'visible';
                    overlay.style.pointerEvents = 'auto';
                    overlay.style.opacity = '0';
                    overlay.style.transform = 'translate3d(0,28px,0)';
                    measure(overlay);
                    const scroll = overlay.querySelector('[data-story-overlay-scroll-desktop]');
                    if (scroll) scroll.scrollTo({ top: 0, behavior: 'auto' });
                    overlay.querySelectorAll('[data-story-overlay-panel]').forEach((panel) => {
                      panel.dataset.inView = 'false';
                    });
                    overlay.__storyAtStart = false;
                    update(overlay);
                    replayIntro(overlay);
                    window.requestAnimationFrame(() => {
                      overlay.style.opacity = '1';
                      overlay.style.transform = 'translate3d(0,0,0)';
                    });
                  } else {
                    overlay.dataset.storyIntro = 'false';
                    overlay.style.opacity = '0';
                    overlay.style.pointerEvents = 'none';
                    overlay.style.transform = 'translate3d(0,28px,0)';
                    overlay.__storyHideTimer = window.setTimeout(() => {
                      overlay.style.visibility = 'hidden';
                      overlay.style.display = 'none';
                    }, 520);
                  }
                });
              };

              const bind = () => {
                overlays().forEach((overlay) => {
                  if (overlay.__storyBound) return;
                  overlay.__storyBound = true;
                  const scroll = overlay.querySelector('[data-story-overlay-scroll-desktop]');
                  if (!scroll) return;
                  let frame = null;
                  let smoothFrame = null;
                  let targetTop = scroll.scrollTop;
                  const maxScroll = () => Math.max(0, scroll.scrollHeight - scroll.clientHeight);
                  const smoothScroll = () => {
                    const current = scroll.scrollTop;
                    const next = current + (targetTop - current) * 0.105;
                    if (Math.abs(targetTop - current) < 0.5) {
                      scroll.scrollTop = targetTop;
                      smoothFrame = null;
                      update(overlay);
                      return;
                    }
                    scroll.scrollTop = next;
                    update(overlay);
                    smoothFrame = window.requestAnimationFrame(smoothScroll);
                  };

                  scroll.addEventListener('scroll', () => {
                    if (!smoothFrame) targetTop = scroll.scrollTop;
                    if (frame) return;
                    frame = window.requestAnimationFrame(() => {
                      frame = null;
                      update(overlay);
                    });
                  }, { passive: true });

                  scroll.addEventListener('wheel', (event) => {
                    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                    event.preventDefault();
                    const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
                    const delta = isHorizontal ? event.deltaX : event.deltaY;
                    targetTop = Math.max(0, Math.min(maxScroll(), targetTop + delta));
                    if (!smoothFrame) smoothFrame = window.requestAnimationFrame(smoothScroll);
                  }, { passive: false });
                });
              };

              const boot = () => {
                bind();
                overlays().forEach(measure);
                sync();
              };

              window.addEventListener('resize', () => overlays().forEach(measure));
              window.addEventListener('hashchange', sync);
              window.requestAnimationFrame(() => window.requestAnimationFrame(boot));
              window.setTimeout(boot, 300);
              window.setTimeout(boot, 1000);
            })();
          `,
        }}
      />

      <GrainOverlay className="z-[60] pointer-events-none" />
      <CloseLink />

      <div data-overlay-scroll data-story-overlay-scroll-desktop className="absolute inset-0 hidden overflow-y-auto overflow-x-hidden md:block">
        <div data-story-overlay-spacer style={{ height: '420vh', minHeight: '360vh' }}>
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <div className="story-overlay-hero-content absolute inset-y-0 left-0 z-10 flex w-[50vw] flex-col justify-between px-6 pb-10 pt-6">
              <h1
                className="story-overlay-heading"
                style={{
                  fontSize: 'clamp(3.7rem, 6.6vw, 7.2rem)',
                  lineHeight: 0.94,
                  fontWeight: 400,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                {detail.title.map((line, index) => <TitleLine key={line} text={line} index={index} />)}
              </h1>

              <div className="story-overlay-reveal story-overlay-reveal-2" style={{ maxWidth: '43vw' }}>
                <p
                  style={{
                    fontFamily: 'Mona Sans, sans-serif',
                    fontSize: 'var(--body-text-size)',
                    lineHeight: 'var(--body-line-height)',
                    color: 'rgba(255,255,255,0.88)',
                    margin: '0 0 34px',
                  }}
                >
                  {detail.intro}
                </p>
                <ScrollPrompt />
              </div>
            </div>

            <div
              data-story-overlay-track
              className="absolute left-0 top-0 z-20 flex h-full will-change-transform"
              style={{
                transform: 'translate3d(0,0,0)',
                background: 'linear-gradient(90deg, transparent 0 50vw, #050505 50vw 100%)',
              }}
            >
              <div className="shrink-0" style={{ width: '50vw', height: '100svh' }} />
              <DesktopPanel
                panel={{
                  type: 'image',
                  src: detail.heroImage.src,
                  alt: detail.heroImage.alt,
                  variant: 'half',
                  position: detail.heroImage.position,
                }}
              />
              {detail.panels.map((panel, index) => (
                <DesktopPanel key={`${panel.type}-${index}`} panel={panel} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div data-overlay-scroll className="absolute inset-0 overflow-y-auto md:hidden">
        <section className="min-h-[100svh] px-4 pb-4 pt-4">
          <h1
            style={{
              fontSize: 'clamp(2.8rem, 12vw, 4.5rem)',
              lineHeight: 0.94,
              fontWeight: 400,
              color: '#ffffff',
              margin: '0 0 28px',
              paddingRight: 56,
            }}
          >
            {detail.title.map((line, index) => (
              <span
                key={line}
                style={{
                  display: 'block',
                  fontFamily: index === 0 ? 'Kegilka, serif' : 'Mona Sans, sans-serif',
                  fontWeight: index === 0 ? 400 : 300,
                }}
              >
                {line}
              </span>
            ))}
          </h1>

          <p
            style={{
              fontFamily: 'Mona Sans, sans-serif',
              fontSize: 'var(--body-text-size)',
              lineHeight: 'var(--body-line-height)',
              color: 'rgba(255,255,255,0.86)',
              margin: '0 0 28px',
            }}
          >
            {detail.intro}
          </p>

          <div className="relative -mx-4 h-[58svh] overflow-hidden">
            <Image
              src={detail.heroImage.src}
              alt={detail.heroImage.alt}
              fill
              unoptimized={true}
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: detail.heroImage.position || 'center' }}
            />
          </div>
        </section>

        {detail.panels.map((panel, index) => {
          if (panel.type === 'text') {
            return (
              <section key={`mobile-text-${index}`} className="px-4 py-12 flex flex-col gap-6">
                {panel.heading ? (
                  <h2
                    style={{
                      fontFamily: 'Kegilka, serif',
                      fontSize: 'clamp(1.8rem, 6vw, 2.8rem)',
                      lineHeight: 0.92,
                      fontWeight: 400,
                      color: '#ffffff',
                      margin: 0,
                    }}
                  >
                    {panel.heading}
                  </h2>
                ) : null}
                <p
                  style={{
                    fontFamily: 'Mona Sans, sans-serif',
                    fontSize: 'var(--body-text-size)',
                    lineHeight: 'var(--body-line-height)',
                    color: 'rgba(255,255,255,0.9)',
                    margin: 0,
                  }}
                >
                  {panel.body}
                </p>
              </section>
            )
          }

          if (panel.type === 'video') {
            return (
              <section key={`mobile-video-${index}`} className={panel.variant === 'wide' ? 'py-0' : 'px-4 py-8'}>
                <div className={`relative overflow-hidden ${panel.variant === 'wide' ? 'h-[72svh]' : 'h-[58svh]'}`}>
                  {panel.embedSrc ? (
                    <iframe
                      src={panel.embedSrc}
                      title={panel.label ?? 'Story video'}
                      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="h-full w-full"
                      style={{ border: 0, display: 'block' }}
                    />
                  ) : panel.src ? (
                    <video
                      src={panel.src}
                      poster={panel.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center"
                      style={{
                        border: '1px solid rgba(255,255,255,0.14)',
                        background: 'linear-gradient(135deg, rgba(122,28,25,0.42), rgba(5,5,5,0.88))',
                        color: 'rgba(255,255,255,0.72)',
                        fontFamily: 'Mona Sans, sans-serif',
                        fontSize: '0.72rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {panel.label ?? 'Video Placeholder'}
                    </div>
                  )}
                </div>
              </section>
            )
          }

          return (
            <section key={`mobile-image-${index}`} className={panel.variant === 'wide' ? 'py-0' : 'px-4 py-8'}>
              <div className={`relative overflow-hidden ${panel.variant === 'wide' ? 'h-[72svh]' : 'h-[58svh]'}`}>
                <Image
                  src={panel.src}
                  alt={panel.alt}
                  fill
                  sizes="100vw"
                  style={{ objectFit: 'cover', objectPosition: panel.position || 'center' }}
                />
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
