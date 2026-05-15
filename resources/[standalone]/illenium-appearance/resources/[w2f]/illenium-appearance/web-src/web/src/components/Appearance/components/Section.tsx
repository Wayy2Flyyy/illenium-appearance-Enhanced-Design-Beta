import { useState, useEffect, useRef, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useSpring, animated } from 'react-spring';

interface SectionProps {
  title: string;
  deps?: any[];
  children?: ReactNode;
}

interface HeaderProps {
  active: boolean;
}

const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  color: rgba(${props => props.theme.fontColor || '255, 255, 255'}, 1);

  user-select: none;

  & + div {
    margin-top: 10px;
  }
`;

const Header = styled.div<HeaderProps>`
  width: 100%;
  min-height: 44px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 14px;
  border-radius: ${props => props.theme.borderRadius || '4px'};

  z-index: 2;

  border: 1px solid rgba(255, 255, 255, ${({ active }) => (active ? '0.18' : '0.08')});
  background:
    linear-gradient(135deg, rgba(${props => props.theme.primaryBackground || '192, 28, 40'}, ${({ active }) => (active ? '0.38' : '0.1')}), rgba(${props => props.theme.secondaryBackground || '10, 10, 12'}, 0.82));
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(14px);

  transition: background 0.1s;

  &:hover {
    background:
      linear-gradient(135deg, rgba(${props => props.theme.primaryBackground || '192, 28, 40'}, 0.45), rgba(${props => props.theme.secondaryBackground || '10, 10, 12'}, 0.88));
    transition: background 0.12s, border-color 0.12s;
    border-color: rgba(${props => props.theme.primaryBackground || '192, 28, 40'}, 0.65);
    cursor: pointer;
  }

  ${({ active }) =>
    active &&
    css`
      background:
        linear-gradient(135deg, rgba(${props => props.theme.primaryBackground || '192, 28, 40'}, 0.55), rgba(${props => props.theme.secondaryBackground || '10, 10, 12'}, 0.9));
      &:hover {
        ${props => props.theme.smoothBackgroundTransition ? 'transition: background 0.2s;' : ''}
        background:
          linear-gradient(135deg, rgba(${props => props.theme.primaryBackground || '192, 28, 40'}, 0.62), rgba(${props => props.theme.secondaryBackground || '10, 10, 12'}, 0.94));
      }
    `}

  span {
    font-size: 12px;
    font-weight: ${props => props.theme.sectionFontWeight || 'normal'};
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
`;

const Items = styled.div`
  padding: 0 2px 5px 2px;

  overflow: hidden;
`;

const Section: React.FC<SectionProps> = ({ children, title, deps = [] }) => {
  const [active, setActive] = useState(false);

  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const props = useSpring({
    height: active ? height : 0,
    opacity: active ? 1 : 0,
  });

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight);
    }
  }, [ref, setHeight]);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight);
    }
  }, [ref, setHeight, deps]);

  return (
    <Container>
      <Header active={active} onClick={() => setActive(state => !state)}>
        <span>{title}</span>
        {active ? <FiChevronUp size={30} /> : <FiChevronDown size={30} />}
      </Header>

      <animated.div style={{ ...props, overflow: 'hidden' }}>
        <Items ref={ref}>{children}</Items>
      </animated.div>
    </Container>
  );
};

export default Section;
