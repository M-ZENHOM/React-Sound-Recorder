import { useState } from 'react';
import { AudioRecorder } from 'react-sound-recorder';

function App() {
    const [audioUrl, setAudioUrl] = useState<{ url: string; title: string }>();
    const getAudio = (blob: Blob, title?: string) => {
        const url = URL.createObjectURL(blob);
        setAudioUrl({
            url,
            title: title!
        });
    };
    const handleError = (error: string) => {
        console.error('AudioRecorder error:', error);
    };

    return (
        <>
            <h2>React Sound Recorder</h2>
            <AudioRecorder
                onRecordingComplete={(blob, title) => getAudio(blob, title)}
                askForTitle
                timeLimit={10}
                onError={handleError}
                customControls={(actions, time, status, error) => (
                    <div>
                        <h2>{time}</h2>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button disabled={status === 'inactive'} onClick={actions.pauseRecording}>
                            Pause
                        </button>
                        <button onClick={actions.stopRecording}>Stop</button>
                        <button onClick={actions.startRecording}>Start</button>
                    </div>
                )}
            />
            {audioUrl && (
                <>
                    <h2>{audioUrl.title}</h2>
                    <audio src={audioUrl.url} title={audioUrl.title} controls />
                </>
            )}
        </>
    );
}

export default App;
