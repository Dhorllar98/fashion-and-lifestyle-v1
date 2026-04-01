import { Component } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-fl-base flex flex-col items-center justify-center px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-6">
            Something went wrong
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-fl-text mb-6 leading-tight max-w-lg">
            We're having trouble connecting right now. Please try again shortly.
          </h1>
          <Link
            to="/"
            className="text-xs font-semibold uppercase tracking-widest px-8 py-4 bg-fl-accent text-white hover:bg-fl-dark transition-all duration-300"
          >
            Return to Homepage
          </Link>
        </div>
      )
    }

    return this.props.children
  }
}
