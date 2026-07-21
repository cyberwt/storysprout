# StorySprout

StorySprout is a warm, choice-led bedtime storybook for children. It invites a child to step into a gentle, illustrated tale with a companion, make three meaningful decisions, listen to each scene, and carry the story into real-world imaginative play.

This hackathon build is intentionally a polished fixed-story demo: **Poppy and the Lost Star**. The bounded story makes the experience reliable, safe to demonstrate, and easy to understand while preserving the core interaction: the child is the author of the important choices.

## Demo flow

1. Enter a child and companion name.
2. Choose a visual story world.
3. Follow Poppy through three bedtime scenes.
4. Make a choice in each scene.
5. Listen to the personalized completed story and try an offline play prompt.

## Run locally

Prerequisite: Node.js 20 or later.

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal (normally `http://127.0.0.1:5173`).

To create a production build:

```bash
npm run build
```

## Technology

- React
- Vite
- JavaScript
- CSS animations and original CSS illustration
- Web Speech API for in-browser demo narration

No API key, account, or external service is needed to run the current demo.

## Product and safety choices

StorySprout is a co-play space, not a substitute for a parent, caregiver, or sibling. The child stays in charge of the story’s choices. The fixed demo avoids open-ended content generation so the demonstration remains age-appropriate and predictable.

## Using Codex

Codex was used throughout the build to shape the product concept, scaffold and iterate on the React interface, implement the choice-driven story flow and narration controls, refine the original illustration system, and run production-build checks.

For the OpenAI Build Week entry, add the exact `/feedback` session ID from the primary Codex session to the Devpost submission. See [SUBMISSION.md](SUBMISSION.md) for the ready-to-paste project copy and [DEMO_VIDEO_SCRIPT.md](DEMO_VIDEO_SCRIPT.md) for the required video narration.

## Repository notes

The submission repository should be public, or shared with `testing@devpost.com` and `build-week-event@openai.com` if private. Add its final URL in `SUBMISSION.md` before submitting.

