import { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
  padding: 1rem;
`;

const StyledButton = styled.button`
  padding: 1rem;
  margin: 1rem;
`;

const StyledDiv = styled.div`
  padding: 1rem;
`;

const StyledLabel = styled.label`
  padding: 1rem;
`;

const StyledInput = styled.input`
  padding: 1rem;
`;

const StyledSelect = styled.select`
  padding: 1rem;
`;

const StyledOption = styled.option`
  padding: 1rem;
`;

export default function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  function preventRefresh(event) {
    event.preventDefault();
  }
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);
    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);
  return (
    <StyledForm onSubmit={preventRefresh}>
      <StyledDiv>
        <StyledLabel>Search todos:</StyledLabel>
        <StyledInput
          type="text"
          value={localQueryString}
          onChange={(e) => {
            setLocalQueryString(e.target.value);
          }}
        />
        <StyledButton type="button" onClick={() => setLocalQueryString('')}>
          Clear
        </StyledButton>
      </StyledDiv>
      <StyledDiv>
        <StyledLabel>Sort by</StyledLabel>
        <StyledSelect
          onChange={(e) => setSortField(e.target.value)}
          value={sortField}
        >
          <StyledOption value="title">Title</StyledOption>
          <StyledOption value="createdTime">Time added</StyledOption>
        </StyledSelect>
        <StyledLabel>Direction</StyledLabel>
        <StyledSelect
          onChange={(e) => setSortDirection(e.target.value)}
          value={sortDirection}
        >
          <StyledOption value="asc">Ascending</StyledOption>
          <StyledOption value="desc">Descending</StyledOption>
        </StyledSelect>
      </StyledDiv>
    </StyledForm>
  );
}
