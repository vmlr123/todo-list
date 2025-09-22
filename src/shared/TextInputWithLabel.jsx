import styled from 'styled-components';

const StyledLabel = styled.label`
  padding: 1rem;
`;
const StyledInput = styled.input`
  padding: 1rem;
`;
function TextInputWithLabel({ elementId, labelText, onChange, ref, value }) {
  return (
    <>
      <StyledLabel htmlFor={elementId}>{labelText}</StyledLabel>
      <StyledInput
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;
