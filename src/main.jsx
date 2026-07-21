import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const storyBeats = [
  {
    chapter: 'Chapter one',
    title: 'The map that sparkled',
    copy: 'Poppy pressed her tiny paw to the window. Outside, a silver star was falling—right into the Whispering Woods.',
    prompt: 'What should Poppy pack for the journey?',
    options: [
      { label: 'A cinnamon snack', story: 'a cinnamon snack, a brave little lantern, and a lucky blue ribbon' },
      { label: 'A brave little lantern', story: 'her brave little lantern and a lucky blue ribbon' },
      { label: 'Her lucky blue ribbon', story: 'her lucky blue ribbon, a cinnamon snack, and a tiny lantern' }
    ],
    accent: 'lavender'
  },
  {
    chapter: 'Chapter two',
    title: 'A friend in the ferns',
    copy: 'The path hummed softly beneath their feet. Then a round, shy firefly peeked out from a fern and whispered, “I know where the star went.”',
    prompt: 'How does Poppy help the firefly feel brave?',
    options: [
      { label: 'Sing a silly song', story: 'sang a small, silly song until the firefly laughed and glowed brighter' },
      { label: 'Share her snack', story: 'shared her cinnamon snack, one crumb at a time, until the firefly felt brave' },
      { label: 'Offer an ear ride', story: 'offered the firefly a cozy ride on her ear, right beside her warm lantern' }
    ],
    accent: 'peach'
  },
  {
    chapter: 'Chapter three',
    title: 'The moonlight picnic',
    copy: 'Together, they found the star resting beneath an old oak tree. It had only needed a little kindness to shine again.',
    prompt: 'What promise does Poppy make before she goes home?',
    options: [
      { label: 'Visit every full moon', story: 'to visit whenever the moon was round' },
      { label: 'Share brave stories', story: 'to share brave stories with anyone who felt small' },
      { label: 'Bring a friend next time', story: 'to bring a friend on her next moonlit adventure' }
    ],
    accent: 'sky'
  }
];

const artWorlds = [
  { id: 'watercolor', name: 'Cozy watercolor', note: 'Soft forest adventures', symbol: '⌇' },
  { id: 'starlight', name: 'Starlight fable', note: 'Poetic and dreamy', symbol: '✦' },
  { id: 'crayon', name: 'Crayon clubhouse', note: 'Bright and playful', symbol: '✎' },
  { id: 'paper', name: 'Paper theatre', note: 'Layered little worlds', symbol: '▱' }
];

function App() {
  const [step, setStep] = useState('welcome');
  const [toyName, setToyName] = useState('Poppy');
  const [beat, setBeat] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [artWorld, setArtWorld] = useState('watercolor');
  const [childName, setChildName] = useState('Maya');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const narratorStyle = 'cozy';

  const current = storyBeats[beat];
  const companionName = useMemo(() => toyName.trim() || 'your friend', [toyName]);

  function beginStory() {
    setStep('setup');
  }

  function continueStory() {
    setStep('story');
    setBeat(0);
    setChoices([]);
  }

  function choose(option) {
    const nextChoices = [...choices, option];
    setChoices(nextChoices);
    if (beat === storyBeats.length - 1) {
      setStep('book');
    } else {
      setBeat(beat + 1);
    }
  }

  function restart() {
    setBeat(0);
    setChoices([]);
    setStep('setup');
  }

  function toggleSound() {
    if (soundEnabled) window.speechSynthesis?.cancel();
    setSoundEnabled((enabled) => !enabled);
  }

  return (
    <main className="app-shell">
      <nav className="topbar" aria-label="StorySprout navigation">
        <button className="brand" onClick={() => setStep('welcome')} aria-label="StorySprout home">
          <span className="brand-mark">✦</span>
          <span>Story<span>Sprout</span></span>
        </button>
        <div className="nav-actions">
          <button className="sound-button" onClick={toggleSound} aria-label={soundEnabled ? 'Sound on' : 'Sound off'} aria-pressed={soundEnabled} title={soundEnabled ? 'Turn narration off' : 'Turn narration on'}>{soundEnabled ? '♬' : '♩'}</button>
          <button className="parent-button" onClick={() => setShowMenu(!showMenu)}>For grown-ups</button>
          {showMenu && <div className="parent-popover">StorySprout is an imaginative co-play space. It is not a person, and children stay in charge of every story.</div>}
        </div>
      </nav>

      {step === 'welcome' && <Welcome onBegin={beginStory} />}
      {step === 'setup' && (
        <Setup
          toyName={toyName}
          childName={childName}
          artWorld={artWorld}
          onToyName={setToyName}
          onChildName={setChildName}
          onArtWorld={setArtWorld}
          onContinue={continueStory}
        />
      )}
      {step === 'story' && <Story beat={current} companionName={companionName} childName={childName} narratorStyle={narratorStyle} soundEnabled={soundEnabled} onChoose={choose} index={beat} artWorld={artWorld} />}
      {step === 'book' && <Book toyName={companionName} childName={childName} narratorStyle={narratorStyle} soundEnabled={soundEnabled} choices={choices} onRestart={restart} artWorld={artWorld} />}

      <footer>Made for make-believe · Your ideas lead the way</footer>
    </main>
  );
}

function useStoryNarration(text, narratorStyle = 'cozy', soundEnabled = true) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => () => {
    window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    if (!soundEnabled) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
    }
  }, [soundEnabled]);

  function toggle() {
    if (!soundEnabled || !window.speechSynthesis) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(text);
    const voiceSettings = {
      cozy: { rate: 0.82, pitch: 1.03 },
      playful: { rate: 0.94, pitch: 1.16 },
      calm: { rate: 0.78, pitch: 0.98 }
    };
    voice.rate = voiceSettings[narratorStyle].rate;
    voice.pitch = voiceSettings[narratorStyle].pitch;
    voice.onend = () => setIsPlaying(false);
    voice.onerror = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(voice);
  }

  return { isPlaying, toggle };
}

function Welcome({ onBegin }) {
  return (
    <section className="welcome page-enter">
      <div className="hero-copy">
        <p className="eyebrow">A warm co-play space</p>
        <h1>Every little idea<br />deserves a world.</h1>
        <p className="hero-text">Begin on a tiny star, with a friendly dog and a gentle bedtime tale. Your choices shape what happens next.</p>
        <button className="primary-button" onClick={onBegin}>Start the demo story <span>→</span></button>
        <p className="tiny-note">You are always the author.</p>
      </div>
      <div className="hero-art hero-stargazer" aria-label="An original little stargazer with a friendly dog on a tiny planet">
        <div className="cloud cloud-a" /><div className="cloud cloud-b" />
        <div className="moon">☾</div>
        <div className="star star-a">✦</div><div className="star star-b">✧</div><div className="star star-c">✦</div>
        <div className="planet-shadow" /><div className="tiny-planet"><span className="planet-ring" /></div>
        <div className="stargazer"><span className="scarf scarf-one" /><span className="scarf scarf-two" /><span className="hair" /><span className="head"><i>•</i><i>•</i></span><span className="coat" /><span className="arm arm-left" /><span className="hand hand-left" /><span className="arm arm-right" /><span className="hand hand-right" /><span className="boot boot-left" /><span className="boot boot-right" /></div>
        <div className="fox" aria-label="A friendly dog sitting on the tiny planet">
          <span className="fox-tail"><i /></span><span className="fox-body" /><span className="fox-paw paw-left" /><span className="fox-paw paw-right" />
          <span className="fox-head"><span className="fox-ear ear-left" /><span className="fox-ear ear-right" /><span className="fox-eye eye-left" /><span className="fox-eye eye-right" /><span className="fox-muzzle"><i /></span></span>
        </div>
      </div>
    </section>
  );
}

function Setup({ toyName, childName, artWorld, onToyName, onChildName, onArtWorld, onContinue }) {
  return (
    <section className="setup page-enter">
      <div className="progress"><span className="active" /><span /><span /></div>
      <p className="eyebrow">Let’s begin</p>
      <h1>Who’s joining your story?</h1>
      <p className="setup-intro">Tonight’s featured tale is <b>Poppy and the Lost Star</b>. Add your name, choose the look, and make its important choices.</p>
      <div className="setup-grid">
        <div className="toy-card"><div className="toy-portrait">♧<span>✦</span></div><p>Your story friend</p></div>
        <div className="form-card">
          <label htmlFor="child-name">Your name</label>
          <input id="child-name" value={childName} onChange={(event) => onChildName(event.target.value)} maxLength="24" />
          <label htmlFor="toy-name">Their name</label>
          <input id="toy-name" value={toyName} onChange={(event) => onToyName(event.target.value)} maxLength="32" />
          <div className="demo-story-note"><span>✦</span><div><b>Featured bedtime story</b><small>A falling star, a shy firefly, and three choices that make the ending yours.</small></div></div>
          <fieldset className="world-picker">
            <legend>Choose a story world</legend>
            <div className="world-options">
              {artWorlds.map((world) => (
                <button type="button" key={world.id} className={artWorld === world.id ? 'world-option selected' : 'world-option'} onClick={() => onArtWorld(world.id)} aria-pressed={artWorld === world.id}>
                  <span className={`world-icon ${world.id}`}>{world.symbol}</span><span><b>{world.name}</b><small>{world.note}</small></span>
                </button>
              ))}
            </div>
          </fieldset>
          <p className="narrator-note">Tap “listen” in each scene for the narrated demo. A narrator is a storytelling tool, not a replacement for a parent or caregiver.</p>
          <button className="primary-button wide" onClick={onContinue}>Begin Poppy’s story <span>→</span></button>
        </div>
      </div>
    </section>
  );
}

function Story({ beat, companionName, childName, narratorStyle, soundEnabled, onChoose, index, artWorld }) {
  const name = childName.trim() || 'friend';
  const narration = `A gentle story for ${name}. ${beat.title}. ${beat.copy.replaceAll('Poppy', companionName)} ${beat.prompt}`;
  const { isPlaying, toggle } = useStoryNarration(narration, narratorStyle, soundEnabled);
  return (
    <section className="story page-enter">
      <div className="story-header"><span>{beat.chapter}</span><span>Choice {index + 1} of {storyBeats.length}</span></div>
      <div className={`scene scene-${beat.accent} art-${artWorld} ${isPlaying ? 'scene-playing' : ''}`}>
        <div className="scene-label"><span className="recording-dot" /> Bedtime story scene</div>
        <div className="scene-star">✦</div><div className="scene-star star-small">✧</div><div className="scene-tree">♣</div><div className="scene-bunny">ʚɞ</div>
        <div className="scene-caption">{isPlaying ? 'Your story is playing…' : 'Tap listen to bring this scene to life'}</div>
      </div>
      <div className="story-copy">
        <div className="story-mode"><span className="companion-line"><span className="mini-buddy">✦</span> Narrated for {name}</span><button className={isPlaying ? 'listen-button playing' : 'listen-button'} onClick={toggle} aria-pressed={isPlaying} disabled={!soundEnabled}><span>{isPlaying ? '■' : '▶'}</span>{isPlaying ? 'Stop story' : soundEnabled ? 'Listen to this scene' : 'Narration is off'}</button></div>
        <h1>{beat.title}</h1>
        <p>{beat.copy.replaceAll('Poppy', companionName)}</p>
      </div>
      <div className="choice-card">
        <p>{beat.prompt}</p>
        <div className="choice-list">
          {beat.options.map((option) => <button key={option.label} onClick={() => onChoose(option)}><span>✦</span>{option.label}<b>→</b></button>)}
        </div>
      </div>
    </section>
  );
}

function Book({ toyName, childName, narratorStyle, soundEnabled, choices, onRestart, artWorld }) {
  const [showMovie, setShowMovie] = useState(false);
  const playIdeas = {
    watercolor: ['Find a cozy corner for a blanket “forest camp.”', 'Collect three soft or green things for Poppy’s trail.'],
    starlight: ['Look out a window and name three things that sparkle.', 'Make a moon map with a grown-up using paper and crayons.'],
    crayon: ['Draw a silly badge for your next brave adventure.', 'Build a tiny hiding place for a pretend lost star.'],
    paper: ['Make a paper star, then hide it for someone to find.', 'Create a little stage and act out your favorite scene.']
  };
  const name = childName.trim() || 'friend';
  const fullStory = `A gentle bedtime story for ${name}. One quiet evening, ${toyName} saw a silver star fall into the Whispering Woods. ${toyName} packed ${choices[0]?.story ?? 'a brave little lantern'} and followed its glow. Beneath the ferns, a shy firefly offered to help. ${toyName} ${choices[1]?.story ?? 'sang a small, silly song until the firefly laughed and glowed brighter'}. Together they found the star beneath an old oak tree. Before going home, ${toyName} promised ${choices[2]?.story ?? 'to share brave stories with anyone who felt small'}. The star was safe again, and the moon watched over them both. Sleep well, ${name}. The end.`;
  const { isPlaying, toggle } = useStoryNarration(fullStory, narratorStyle, soundEnabled);
  return (
    <section className={`book page-enter ${showMovie ? 'movie-open' : ''}`} aria-live="polite">
      {showMovie ? (
        <StoryMovie toyName={toyName} childName={name} choices={choices} artWorld={artWorld} narratorStyle={narratorStyle} soundEnabled={soundEnabled} onClose={() => setShowMovie(false)} />
      ) : <>
        <div className={`book-cover cover-${artWorld}`}><div className="cover-star">✦</div><span className="cover-eyebrow">A shared story starring {name}</span><h1>{toyName} and<br />the Lost Star</h1><div className="cover-bunny">•ᴗ•</div><p>Made with a little bit of magic</p></div>
        <div className="book-summary">
          <p className="eyebrow">Your story is complete</p>
          <h2>You made every important choice.</h2>
          <p>Along the way, {toyName} chose <strong>{choices[0]?.label}</strong>, helped a new friend by <strong>{choices[1]?.label}</strong>, and promised to <strong>{choices[2]?.label?.toLowerCase()}</strong>.</p>
          <div className="book-actions"><button className="primary-button" onClick={() => setShowMovie(true)}>▶ Watch Poppy’s adventure</button><button className={isPlaying ? 'secondary-button playing' : 'secondary-button'} onClick={toggle} disabled={!soundEnabled}>{isPlaying ? '■ Stop story' : soundEnabled ? '▶ Listen to the whole story' : 'Narration is off'}</button><button className="text-button" onClick={onRestart}>Make another story <span>→</span></button></div>
          <div className="story-to-play"><div className="play-heading"><span>☀</span><b>Take the story off the page</b></div><p>Try one of {toyName}’s real-world adventures:</p><ul>{playIdeas[artWorld].map((idea) => <li key={idea}>{idea}</li>)}</ul></div>
          <p className="tiny-note">A grown-up can save or share this story from the family space.</p>
        </div>
      </>}
    </section>
  );
}

function StoryMovie({ toyName, childName, choices, artWorld, narratorStyle, soundEnabled, onClose }) {
  const scenes = [
    {
      title: 'The map that sparkled',
      caption: `${toyName} packed ${choices[0]?.label?.toLowerCase() ?? 'a brave little lantern'} and followed the falling star into the Whispering Woods.`,
      accent: 'lavender'
    },
    {
      title: 'A friend in the ferns',
      caption: `When the shy firefly appeared, ${toyName} chose to ${choices[1]?.label?.toLowerCase() ?? 'sing a silly song'}. Soon, the whole forest glowed.`,
      accent: 'peach'
    },
    {
      title: 'The moonlight promise',
      caption: `The star was safe again. Before going home, ${toyName} promised to ${choices[2]?.label?.toLowerCase() ?? 'share brave stories'}.`,
      accent: 'sky'
    }
  ];
  const [activeScene, setActiveScene] = useState(0);
  const [isAutoplaying, setIsAutoplaying] = useState(true);
  const currentScene = scenes[activeScene];
  const narration = `A story for ${childName}. ${currentScene.title}. ${currentScene.caption}`;
  const { isPlaying, toggle } = useStoryNarration(narration, narratorStyle, soundEnabled);

  useEffect(() => {
    if (!isAutoplaying) return undefined;
    const timer = window.setTimeout(() => {
      setActiveScene((scene) => {
        if (scene === scenes.length - 1) {
          setIsAutoplaying(false);
          return scene;
        }
        return scene + 1;
      });
    }, 5600);
    return () => window.clearTimeout(timer);
  }, [activeScene, isAutoplaying, scenes.length]);

  function moveTo(scene) {
    setActiveScene(scene);
    setIsAutoplaying(false);
  }

  function toggleAutoplay() {
    if (activeScene === scenes.length - 1 && !isAutoplaying) {
      setActiveScene(0);
      setIsAutoplaying(true);
      return;
    }
    setIsAutoplaying((playing) => !playing);
  }

  return (
    <div className="story-movie" aria-label="Animated picture-book version of the story">
      <div className="movie-heading"><div><p className="eyebrow">Watch your picture book</p><h2>{toyName} and the Lost Star</h2></div><button className="close-movie" onClick={onClose}>Back to the book</button></div>
      <div className={`movie-frame movie-${currentScene.accent} art-${artWorld}`}>
        <div className="movie-moon">☾</div><div className="movie-spark movie-spark-one">✦</div><div className="movie-spark movie-spark-two">✧</div>
        <div className="movie-hill movie-hill-back" /><div className="movie-hill movie-hill-front" />
        <div className="movie-tree">♣</div><div className="movie-firefly">✦</div><div className="movie-poppy">•ᴗ•</div>
        <div className="movie-card"><span>Scene {activeScene + 1} of {scenes.length}</span><h3>{currentScene.title}</h3><p>{currentScene.caption}</p></div>
      </div>
      <div className="movie-controls">
        <div className="movie-dots" aria-label={`Scene ${activeScene + 1} of ${scenes.length}`}>{scenes.map((scene, index) => <button key={scene.title} className={index === activeScene ? 'active' : ''} onClick={() => moveTo(index)} aria-label={`Go to scene ${index + 1}`} aria-current={index === activeScene} />)}</div>
        <div className="movie-actions"><button className="secondary-button compact" onClick={toggleAutoplay}>{isAutoplaying ? '❚❚ Pause scenes' : activeScene === scenes.length - 1 ? '↻ Watch again' : '▶ Play scenes'}</button><button className="secondary-button compact" onClick={toggle} disabled={!soundEnabled}>{isPlaying ? '■ Stop narration' : soundEnabled ? '▶ Narrate this page' : 'Narration is off'}</button>{activeScene < scenes.length - 1 && <button className="primary-button compact" onClick={() => moveTo(activeScene + 1)}>Next scene <span>→</span></button>}</div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
