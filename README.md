# **react-sound-recorder**

An audio recording helper for React. Provides a component to help with audio recording.

[![NPM downloads][npm-download-img]][npm-download-url]

[npm-download-img]: https://img.shields.io/npm/dm/react-audio-voice-recorder.svg?style=round-square
[npm-download-url]: https://www.npmjs.com/package/react-sound-recorder

## Installation

```sh
npm install react-sound-recorder
```

```sh
yarn add react-sound-recorder
```

## Usage

### **AudioRecorder** Component ([See it in action](https://stackblitz.com/edit/react-sound-recorder?file=src%2FApp.tsx))

You can use an out-of-the-box component that takes `onRecordingComplete` method as a prop and calls it when you save the recording

```js
import { AudioRecorder } from 'react-sound-recorder';

const getAudio = (blob: Blob, title: string | undefined) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement('audio');
    audio.src = url;
    audio.controls = true;
    title && audio.setAttribute('title', title);
    document.getElementById('root')?.appendChild(audio);
};

return <AudioRecorder onRecordingComplete={(blob, title) => getAudio(blob, title)} />;
```

## Usage 2

```js
export function App() {
  const [audioUrl, setAudioUrl] = useState<{ url: string; title: string }>();
  const getAudio = (blob: Blob, title?: string) => {
    const url = URL.createObjectURL(blob);
    setAudioUrl({
      url,
      title: title!,
    });
  };

  return (
    <>
      <AudioRecorder
        timeLimit={5}
        onRecordingComplete={(blob, title) => getAudio(blob, title)}
      />
      {audioUrl && <audio src={audioUrl.url} title={audioUrl.title} controls />}
    </>
  );
}
```

| Props                     | Description                                                                                            | Default   | Optional |
| :------------------------ | :----------------------------------------------------------------------------------------------------- | :-------- | :------- |
| **`onRecordingComplete`** | A method that gets called when u need to save audio details to local state or displaying it to the dom | N/A       | Yes      |
| **`timeLimit`**           | A Parameter to set the time limit for the audio recorder - "in Seconds"                                | Unlimited | Yes      |
| **`customControls`**      | This Parameter allows you to create your own custom controls with your preferred style.                | N/A       | Yes      |
| **`askForTitle`**         | This Parameter ask for audio title to set it for audio name `[audioTitle.mp3]`                         | false     | Yes      |

---

## Usage For **`customControls`** Param

#### The customControls parameter provides three arguments:

-   `actions` - Returns pauseRecording, stopRecording, and startRecording functions.
-   `time` - Returns the time being recorded.
-   `status` - Returns the recording status.

```js
<AudioRecorder
    timeLimit={5}
    onRecordingComplete={(blob, title) => addAudioElement(blob, title)}
    customControls={(actions, time, status) => (
        <div>
            <h2>{time}</h2>
            <button disabled={status === 'inactive'} onClick={actions.pauseRecording}>
                Pause
            </button>
            <button onClick={actions.stopRecording}>Stop</button>
            <button onClick={actions.startRecording}>Start</button>
        </div>
    )}
/>
```
