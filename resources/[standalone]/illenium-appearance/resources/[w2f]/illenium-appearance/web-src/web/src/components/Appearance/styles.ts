import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;

  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;

  color: var(--w2f-text);
  background: transparent;
`;

export const Container = styled.div`
  height: 100%;
  width: min(440px, 24vw);
  max-width: 440px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  padding: 28px 12px 28px 24px;

  background:
    linear-gradient(90deg, rgba(5, 5, 7, 0.94), rgba(5, 5, 7, 0.72) 76%, rgba(5, 5, 7, 0));

  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(${props => props.theme.primaryBackground || '192, 28, 40'}, 0.45);
    border-radius: 999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(${props => props.theme.primaryBackground || '192, 28, 40'}, 0.75);
  }
`;

export const FlexWrapper = styled.div`
  width: 100%;

  display: flex;

  > div {
    & + div {
      margin-left: 10px;
    }
  }
`;

/** W2F branding; upstream credit must stay visible alongside illenium-appearance. */
export const AppearanceBrandCredit = styled.div`
  position: fixed;
  right: max(16px, 1vw);
  bottom: 10px;
  z-index: 20;
  max-width: min(420px, 88vw);
  pointer-events: none;
  text-align: right;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.35;
  text-transform: uppercase;
  color: var(--w2f-muted);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.85);

  strong {
    color: rgba(240, 242, 248, 0.88);
    font-weight: 800;
  }

  span.accent-w2f {
    color: rgba(239, 68, 68, 0.92);
  }
`;
