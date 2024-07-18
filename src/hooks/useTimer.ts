import { useState, useRef, useCallback } from 'react';

const useTimer = () => {
    const [time, setTime] = useState('00:00');
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<number | NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const elapsedTimeRef = useRef<number>(0);

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const start = useCallback(() => {
        if (!isRunning) {
            setIsRunning(true);
            startTimeRef.current = Date.now() - elapsedTimeRef.current;
            intervalRef.current = setInterval(() => {
                const currentTime = Date.now();
                elapsedTimeRef.current = currentTime - (startTimeRef.current || currentTime);
                setTime(formatTime(elapsedTimeRef.current));
            }, 1000);
        }
    }, [isRunning]);

    const pause = useCallback(() => {
        if (isRunning && intervalRef.current) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
        }
    }, [isRunning]);

    const resume = useCallback(() => {
        if (!isRunning) {
            start();
        }
    }, [isRunning, start]);

    const reset = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setIsRunning(false);
        setTime('00:00');
        elapsedTimeRef.current = 0;
        startTimeRef.current = null;
    };

    const getElapsedTime = () => elapsedTimeRef.current;

    return { time, start, pause, resume, reset, getElapsedTime };
};

export default useTimer;