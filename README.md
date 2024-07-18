# **react-sound-recorder**

An audio recording helper for React. Provides a component to help with audio recording.

[![NPM downloads][npm-download-img]][npm-download-url]

[npm-download-img]: https://img.shields.io/npm/dm/react-audio-voice-recorder.svg?style=round-square
[npm-download-url]: soon

## Installation

```sh
npm install react-sound-recorder
```

```sh
yarn add react-sound-recorder
```

## Usage

### **AudioRecorder** Component ([See it in action](soon))

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

| Props                     | Description                                                                             | Default   | Optional |
| :------------------------ | :-------------------------------------------------------------------------------------- | :-------- | :------- |
| **`onRecordingComplete`** | A method that gets called when "Save recording" option is pressed                       | N/A       | Yes      |
| **`timeLimit`**           | A Parameter to set the time limit for the audio recorder - "in Seconds"                 | Unlimited | Yes      |
| **`customControls`**      | This Parameter allows you to create your own custom controls with your preferred style. | N/A       | Yes      |

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
