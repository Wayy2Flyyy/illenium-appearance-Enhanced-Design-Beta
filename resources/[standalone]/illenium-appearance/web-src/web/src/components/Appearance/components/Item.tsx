import styled from 'styled-components';
import { ReactNode } from 'react';

interface ItemProps {
  title?: string;
  children?: ReactNode;
}

const Container = styled.div`
  margin-top: 0.5rem;

  display: flex;
  flex-direction: column;

  padding: 12px;
  border-radius: ${props => props.theme.borderRadius || '10px'};

  border: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(${props => props.theme.secondaryBackground || '10, 10, 12'}, 0.48);
  backdrop-filter: blur(12px);

  span {
    color: rgba(${props => props.theme.fontColor || '255, 255, 255'}, 1);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

const Inputs = styled.div`
  width: 100%;
  display: inline-flex;
  flex-wrap: wrap;

  margin-top: 10px;

  > div {
    & + div {
      margin-top: 10px;
    }
  }
`;

const Item: React.FC<ItemProps> = ({ children, title }) => {
  return (
    <Container>
      {title && <span>{title}</span>}
      <Inputs>{children}</Inputs>
    </Container>
  );
};

export default Item;
