import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-slate-500">
            <span className="text-3xl">⚠️</span>
            <p className="text-sm">页面加载出错了</p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="text-xs text-blue-400 hover:underline"
            >
              重试
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}
