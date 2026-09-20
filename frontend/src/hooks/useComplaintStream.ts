import { useState, useEffect, useRef, useCallback } from 'react';
import type { ClassifyOutput, RouteOutput, DraftOutput } from '../lib/types';

interface StreamState {
  classify: ClassifyOutput | null;
  route: RouteOutput | null;
  draft: DraftOutput | null;
  isStreaming: boolean;
  error: string | null;
  done: boolean;
}

const initialState: StreamState = {
  classify: null,
  route: null,
  draft: null,
  isStreaming: false,
  error: null,
  done: false,
};

export function useComplaintStream(complaintId: string | null) {
  const [state, setState] = useState<StreamState>(initialState);
  const eventSourceRef = useRef<EventSource | null>(null);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  useEffect(() => {
    if (!complaintId) {
      return;
    }

    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const url = `${apiUrl}/complaints/${complaintId}/stream`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    setState({
      classify: null,
      route: null,
      draft: null,
      isStreaming: true,
      error: null,
      done: false,
    });

    es.addEventListener('classify', (event) => {
      const data = JSON.parse(event.data) as ClassifyOutput;
      setState((prev) => ({ ...prev, classify: data }));
    });

    es.addEventListener('route', (event) => {
      const data = JSON.parse(event.data) as RouteOutput;
      setState((prev) => ({ ...prev, route: data }));
    });

    es.addEventListener('draft', (event) => {
      const data = JSON.parse(event.data) as DraftOutput;
      setState((prev) => ({ ...prev, draft: data }));
    });

    es.addEventListener('done', () => {
      setState((prev) => ({ ...prev, isStreaming: false, done: true }));
      es.close();
    });

    es.addEventListener('error', (event) => {
      const errorEvent = event as MessageEvent;
      const errorMsg = errorEvent.data ? String(errorEvent.data) : 'Stream connection error';
      setState((prev) => ({ ...prev, isStreaming: false, error: errorMsg }));
      es.close();
    });

    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) return;
      setState((prev) => {
        if (prev.done) return prev;
        return { ...prev, isStreaming: false, error: 'Connection lost' };
      });
      es.close();
    };

    return () => {
      es.close();
    };
  }, [complaintId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return { ...state, reset };
}
