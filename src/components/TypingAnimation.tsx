import React, { Component } from 'react';

interface TypingAnimationProps {
  s: string;
  lg?: boolean;
  sm?: boolean;
  noStyling?: boolean;
}

interface TypingAnimationState {
  s: string;
  typing: boolean;
}

export default class TypingAnimation extends Component<TypingAnimationProps, TypingAnimationState> {
  constructor(props: TypingAnimationProps) {
    super(props);
    this.state = {
      s: "",
      typing: true,
    };
  }

  componentDidMount() {
    this.animateText();
  }

  componentDidUpdate(prevProps: TypingAnimationProps) {
    if (prevProps.s !== this.props.s) {
      this.setState({ s: "", typing: true }, () => {
        this.animateText();
      });
    }
  }

  animateText = () => {
    const { s } = this.props;
    const { typing } = this.state;
    if (typing) {
      const newLetter = s.charAt(this.state.s.length);
      if (newLetter === "") {
        this.setState({ typing: false });
        return;
      }
      this.setState({ s: this.state.s + newLetter }, () => {
        setTimeout(this.animateText, 20);
      });
    }
  }

  render() {
    const { lg, sm, noStyling } = this.props;
    return (
      <>
        {this.state.s}
      </>
    );
  }
}
