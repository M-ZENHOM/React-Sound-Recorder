import React, { useState, useEffect, useRef, useCallback } from 'react';
import useTimer from '../hooks/useTimer';

type RecordingStatus = 'inactive' | 'paused' | 'recording';

interface AudioRecorderState {
    permission: boolean;
    recordingStatus: RecordingStatus;
    audioDetails: { audioUrl: string; audioName: string } | null;
}
interface AudioRecorderProps {
    timeLimit?: number;
    onRecordingComplete?: (blob: Blob, title?: string) => void;
    customControls?: (actions: Record<string, () => void>, time: string, recordingStatus: RecordingStatus) => JSX.Element;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ timeLimit, onRecordingComplete, customControls }) => {
    const [state, setState] = useState<AudioRecorderState>({
        permission: false,
        recordingStatus: 'inactive',
        audioDetails: null
    });

    const { time, start, reset, resume, pause, getElapsedTime } = useTimer();
    const timeLimitMs = timeLimit ? timeLimit * 1000 : undefined;

    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timeLimitRef = useRef<number | null>(null);

    const updateState = useCallback((newState: Partial<AudioRecorderState>) => {
        setState((prevState) => ({ ...prevState, ...newState }));
    }, []);

    const getPermission = useCallback(async () => {
        if (!('MediaRecorder' in window)) {
            alert('The MediaRecorder API is not supported in your browser.');
            return false;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            updateState({ permission: true });
            return true;
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Failed to access microphone. Please check your permissions.');
            return false;
        }
    }, [updateState]);

    const startTimer = useCallback(() => {
        if (timeLimitMs) {
            const remainingTime = timeLimitMs - getElapsedTime();
            timeLimitRef.current = window.setTimeout(stopRecording, remainingTime);
        }
    }, [timeLimitMs, getElapsedTime]);

    const stopTimer = useCallback(() => {
        if (timeLimitRef.current) {
            clearTimeout(timeLimitRef.current);
            timeLimitRef.current = null;
        }
    }, []);

    const startRecording = useCallback(async () => {
        if (!state.permission && !(await getPermission())) return;

        updateState({ audioDetails: null });
        chunksRef.current = [];

        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
            mediaRecorder.current.stop();
        }

        if (!streamRef.current) return;
        const media = new MediaRecorder(streamRef.current);
        mediaRecorder.current = media;
        media.start();
        media.onstart = () => {
            start();
            updateState({ recordingStatus: 'recording' });
            startTimer();
        };
        media.ondataavailable = (event: BlobEvent) => {
            if (event.data.size > 0) {
                chunksRef.current.push(event.data);
            }
        };
    }, [state.permission, getPermission, updateState, start, startTimer]);

    const stopRecording = useCallback(() => {
        if (!mediaRecorder.current) return;
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            updateState({ recordingStatus: 'inactive' });
            reset();
            stopTimer();
            const audioBlob = new Blob(chunksRef.current, { type: 'audio/mpeg' });
            const audioTitle = prompt('Enter a title for your audio:');
            onRecordingComplete?.(audioBlob, audioTitle || undefined);
            chunksRef.current = [];
        };
    }, [updateState, reset, stopTimer, onRecordingComplete]);

    const pauseRecording = useCallback(() => {
        if (!mediaRecorder.current) return;
        if (state.recordingStatus === 'paused') {
            mediaRecorder.current.resume();
            resume();
            updateState({ recordingStatus: 'recording' });
            startTimer();
        } else {
            mediaRecorder.current.pause();
            pause();
            updateState({ recordingStatus: 'paused' });
            stopTimer();
        }
    }, [state.recordingStatus, resume, updateState, startTimer, pause, stopTimer]);

    useEffect(() => {
        return () => {
            stopTimer();
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stopTimer]);

    const renderDefaultControls = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h2>{time}</h2>
            {state.recordingStatus === 'inactive' ? <button onClick={startRecording}>Start Recording</button> : <button onClick={stopRecording}>Stop Recording</button>}
            {state.recordingStatus === 'recording' ? (
                <button onClick={pauseRecording}>Pause Recording</button>
            ) : state.recordingStatus === 'paused' ? (
                <button onClick={pauseRecording}>Resume Recording</button>
            ) : null}
        </div>
    );

    return <>{customControls ? customControls({ startRecording, stopRecording, pauseRecording }, time, state.recordingStatus) : renderDefaultControls()}</>;
};

export default AudioRecorder;
